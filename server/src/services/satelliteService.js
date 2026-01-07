const https = require('https');
const logger = require('../utils/logger');


// Cache to store satellite data
let satelliteCache = {
    data: null,
    timestamp: null,
    key: null
};

const CACHE_DURATION = parseInt(process.env.SATELLITE_CACHE_DURATION) || 3600000; // 1 hour
const DEFAULT_RADIUS = parseFloat(process.env.SATELLITE_DEFAULT_RADIUS) || 0.1; // ~11km
const MAX_CLOUD_COVER = parseInt(process.env.SATELLITE_MAX_CLOUD_COVER) || 10; // 10%

/**
 * Sign a URL using Microsoft Planetary Computer SAS API
 * @param {string} url - Unsigned URL
 * @returns {Promise<string>} Signed URL
 */
const signPlanetaryComputerUrl = (url) => {
    return new Promise((resolve, reject) => {
        if (!url) {
            resolve(null);
            return;
        }

        const options = {
            hostname: 'planetarycomputer.microsoft.com',
            path: `/api/sas/v1/sign?href=${encodeURIComponent(url)}`,
            method: 'GET'
        };

        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(data);
                    if (res.statusCode === 200 && parsed.href) {
                        resolve(parsed.href);
                    } else {
                        // Fallback to original URL if signing fails
                        logger.warn(`⚠️ Failed to sign URL (${res.statusCode}): ${url}`);
                        resolve(url);
                    }
                } catch (error) {
                    logger.error(`❌ Error parsing signing response: ${error.message}`);
                    resolve(url);
                }
            });
        });

        req.on('error', (error) => {
            logger.error(`❌ Network error signing URL: ${error.message}`);
            resolve(url);
        });

        req.end();
    });
};

/**
 * Search for Sentinel-2 imagery using Microsoft Planetary Computer STAC API
 * @param {Array} bbox - Bounding box [west, south, east, north]
 * @param {string} dateStart - Start date in ISO format (YYYY-MM-DD)
 * @param {string} dateEnd - End date in ISO format (YYYY-MM-DD)
 * @returns {Promise<Object>} STAC search results
 */
const searchSatelliteImagery = (bbox, dateStart, dateEnd) => {
    return new Promise((resolve, reject) => {
        const searchPayload = JSON.stringify({
            collections: ['sentinel-2-l2a'],
            bbox: bbox,
            datetime: `${dateStart}T00:00:00Z/${dateEnd}T23:59:59Z`,
            limit: 5,
            query: {
                'eo:cloud_cover': { lt: MAX_CLOUD_COVER }
            },
            sortby: [
                { field: 'properties.eo:cloud_cover', direction: 'asc' },
                { field: 'properties.datetime', direction: 'desc' }
            ]
        });

        const options = {
            hostname: 'planetarycomputer.microsoft.com',
            path: '/api/stac/v1/search',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(searchPayload)
            }
        };

        const req = https.request(options, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                try {
                    const parsed = JSON.parse(data);

                    if (res.statusCode === 200) {
                        logger.info(`✅ Found ${parsed.features?.length || 0} satellite images`);
                        resolve(parsed);
                    } else {
                        logger.error(`❌ STAC API error: ${res.statusCode}`);
                        reject(new Error(`STAC API returned status ${res.statusCode}`));
                    }
                } catch (error) {
                    logger.error(`❌ Error parsing STAC response: ${error.message}`);
                    reject(error);
                }
            });
        });

        req.on('error', (error) => {
            logger.error(`❌ Network error fetching satellite data: ${error.message}`);
            reject(error);
        });

        req.write(searchPayload);
        req.end();
    });
};

/**
 * Calculate NDWI (Normalized Difference Water Index) metadata from Sentinel-2 item
 * NDWI = (Green - NIR) / (Green + NIR)
 * NDWI > 0.3 indicates water bodies
 * 
 * Note: This returns band URLs for client-side processing or future server-side raster analysis
 * @param {Object} item - STAC item from search results
 * @returns {Object} NDWI metadata and band information
 */
const calculateNDWI = async (item) => {
    try {
        // Extract band URLs (B03 = Green, B08 = NIR)
        const greenBandUnsigned = item.assets?.B03?.href || null;
        const nirBandUnsigned = item.assets?.B08?.href || null;

        // Prioritize browser-renderable visual formats
        // 1. rendered_preview (usually PNG/JPG from Planetary Computer)
        // 2. thumbnail (usually PNG/JPG)
        // 3. visual (fallback, often GeoTIFF which browsers can't render)
        const visualUrlUnsigned =
            item.assets?.rendered_preview?.href ||
            item.assets?.thumbnail?.href ||
            item.assets?.visual?.href ||
            null;

        if (!greenBandUnsigned || !nirBandUnsigned) {
            logger.warn('⚠️  Missing required bands for NDWI calculation');
            return null;
        }

        // Sign URLs
        logger.info('🔐 Signing asset URLs for secure access...');
        const [greenBand, nirBand, visualUrl] = await Promise.all([
            signPlanetaryComputerUrl(greenBandUnsigned),
            signPlanetaryComputerUrl(nirBandUnsigned),
            signPlanetaryComputerUrl(visualUrlUnsigned)
        ]);

        // For now, we return band URLs for potential future processing
        // In a full implementation, we would download and process the actual raster data
        return {
            bands: {
                B03: greenBand,
                B08: nirBand
            },
            visualUrl: visualUrl,
            formula: 'NDWI = (B03 - B08) / (B03 + B08)',
            interpretation: {
                high: 'NDWI > 0.3 indicates water bodies (HIGH FLOOD RISK)',
                moderate: '0.0 < NDWI < 0.3 indicates wet soil/vegetation',
                low: 'NDWI < 0.0 indicates dry land (LOW RISK)'
            }
        };
    } catch (error) {
        logger.error(`❌ Error calculating NDWI: ${error.message}`);
        return null;
    }
};

/**
 * Get flood risk heatmap data for a specific location
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @param {number} radius - Search radius in degrees (default: 0.1 ≈ 11km)
 * @param {string} date - Target date in YYYY-MM-DD format (default: today)
 * @returns {Promise<Object>} Flood risk assessment data
 */
const getFloodRiskHeatmap = async (lat, lng, radius = DEFAULT_RADIUS, date = null) => {
    try {
        // Generate cache key
        const targetDate = date || new Date().toISOString().split('T')[0];
        const cacheKey = `${lat.toFixed(4)}_${lng.toFixed(4)}_${targetDate}`;

        // Check cache
        const cached = getCachedSatelliteData(cacheKey);
        if (cached) {
            logger.info('📦 Using cached satellite data');
            return cached;
        }

        logger.info(`🛰️  Fetching satellite data for ${lat}, ${lng} on ${targetDate}`);

        // Calculate bounding box
        const bbox = [
            lng - radius, // west
            lat - radius, // south
            lng + radius, // east
            lat + radius  // north
        ];

        // Search for imagery (try target date ± 7 days)
        const dateStart = new Date(targetDate);
        dateStart.setDate(dateStart.getDate() - 7);
        const dateEnd = new Date(targetDate);
        dateEnd.setDate(dateEnd.getDate() + 7);

        const searchResults = await searchSatelliteImagery(
            bbox,
            dateStart.toISOString().split('T')[0],
            dateEnd.toISOString().split('T')[0]
        );

        if (!searchResults.features || searchResults.features.length === 0) {
            logger.warn('⚠️  No satellite imagery found for this location/date');
            return {
                status: 'no_data',
                message: 'No clear satellite imagery available for this location and date range',
                searchParams: { lat, lng, date: targetDate, radius }
            };
        }

        // Get the best image (lowest cloud cover, most recent)
        const bestImage = searchResults.features[0];
        const imageDate = new Date(bestImage.properties.datetime);
        const cloudCover = bestImage.properties['eo:cloud_cover'];

        logger.info(`📸 Selected image from ${imageDate.toISOString()} with ${cloudCover.toFixed(1)}% cloud cover`);

        // Calculate NDWI metadata
        const ndwiData = await calculateNDWI(bestImage);

        if (!ndwiData) {
            return {
                status: 'error',
                message: 'Unable to process satellite imagery',
                searchParams: { lat, lng, date: targetDate, radius }
            };
        }

        // Prepare response
        const response = {
            status: 'success',
            imagery: {
                date: imageDate.toISOString().split('T')[0],
                datetime: imageDate.toISOString(),
                cloudCover: cloudCover,
                visualUrl: ndwiData.visualUrl,
                bands: ndwiData.bands
            },
            ndwi: {
                formula: ndwiData.formula,
                interpretation: ndwiData.interpretation,
                bandsAvailable: true
            },
            metadata: {
                source: 'Sentinel-2 L2A (Microsoft Planetary Computer)',
                resolution: '10m',
                bbox: bbox,
                cached: false,
                timestamp: Date.now()
            }
        };

        // Cache the response
        satelliteCache = {
            data: response,
            timestamp: Date.now(),
            key: cacheKey
        };

        return response;

    } catch (error) {
        logger.error(`❌ Failed to fetch satellite data: ${error.message}`);

        // Return cached data if available
        const cached = getCachedSatelliteData(null, true);
        if (cached) {
            logger.info('📦 Returning stale cached data due to error');
            return { ...cached, metadata: { ...cached.metadata, stale: true } };
        }

        return {
            status: 'error',
            message: error.message,
            searchParams: { lat, lng, date, radius }
        };
    }
};

/**
 * Get cached satellite data if still valid
 * @param {string} cacheKey - Cache key to check
 * @param {boolean} allowStale - Return stale cache on error
 * @returns {Object|null} Cached satellite data or null
 */
const getCachedSatelliteData = (cacheKey, allowStale = false) => {
    if (satelliteCache.data && satelliteCache.timestamp) {
        const age = Date.now() - satelliteCache.timestamp;

        // Check if cache key matches (if provided)
        if (cacheKey && satelliteCache.key !== cacheKey) {
            return null;
        }

        // Return if still valid or if stale is allowed
        if (age < CACHE_DURATION || allowStale) {
            return {
                ...satelliteCache.data,
                metadata: {
                    ...satelliteCache.data.metadata,
                    cached: true,
                    cacheAge: Math.floor(age / 1000) // seconds
                }
            };
        }
    }
    return null;
};

/**
 * Clear satellite data cache (for testing or manual refresh)
 */
const clearCache = () => {
    satelliteCache = {
        data: null,
        timestamp: null,
        key: null
    };
    logger.info('🗑️  Satellite cache cleared');
};

module.exports = {
    getFloodRiskHeatmap,
    getCachedSatelliteData,
    clearCache,
    // Exported for testing
    searchSatelliteImagery,
    calculateNDWI
};
