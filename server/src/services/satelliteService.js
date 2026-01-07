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
const searchSatelliteImagery = (bbox, dateStart, dateEnd, cloudLimit = MAX_CLOUD_COVER) => {
    return new Promise((resolve, reject) => {
        const searchPayload = JSON.stringify({
            collections: ['sentinel-2-l2a'],
            bbox: bbox,
            datetime: `${dateStart}T00:00:00Z/${dateEnd}T23:59:59Z`,
            limit: 5,
            query: {
                'eo:cloud_cover': { lt: cloudLimit }
            },
            sortby: [
                { field: 'properties.eo:cloud_cover', direction: 'asc' },
                { field: 'properties.datetime', direction: 'desc' }
            ]
        });
        // ... (rest of searchSatelliteImagery stays same, but with cloudLimit variable)

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
 * Search for Sentinel-1 Radar imagery (SAR) using Microsoft Planetary Computer STAC API
 * Used as a failover when clouds obscure optical imagery.
 * @param {Array} bbox - Bounding box [west, south, east, north]
 * @param {string} dateStart - Start date
 * @param {string} dateEnd - End date
 * @returns {Promise<Object>} STAC search results
 */
const searchRadarImagery = (bbox, dateStart, dateEnd) => {
    return new Promise((resolve, reject) => {
        // Sentinel-1 GRD (Ground Range Detected) is suitable for water detection
        const searchPayload = JSON.stringify({
            collections: ['sentinel-1-grd'],
            bbox: bbox,
            datetime: `${dateStart}T00:00:00Z/${dateEnd}T23:59:59Z`,
            limit: 3,
            query: {
                'sar:instrument_mode': { eq: 'IW' }, // Interferometric Wide swath
                'sar:product_type': { eq: 'GRD' }
            },
            sortby: [
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
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(data);
                    if (res.statusCode === 200) {
                        logger.info(`📡 Found ${parsed.features?.length || 0} Radar (SAR) scan(s)`);
                        resolve(parsed);
                    } else {
                        reject(new Error(`Radar API returned ${res.statusCode}`));
                    }
                } catch (error) { reject(error); }
            });
        });

        req.on('error', (error) => reject(error));
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

        // 1. Try Sentinel-2 (Optical) first
        let searchResults = await searchSatelliteImagery(
            bbox,
            dateStart.toISOString().split('T')[0],
            dateEnd.toISOString().split('T')[0],
            70 // Allow up to 70% clouds for initial search as failover
        );

        let bestImage = null;
        let isRadar = false;

        if (searchResults.features && searchResults.features.length > 0) {
            // Check if even the best image is too cloudy
            const firstResult = searchResults.features[0];
            const cloudCover = firstResult.properties['eo:cloud_cover'];

            if (cloudCover <= MAX_CLOUD_COVER) {
                bestImage = firstResult;
            } else {
                logger.info(`☁️ Optical imagery too cloudy (${cloudCover.toFixed(1)}%). Failing over to Radar...`);
            }
        }

        // 2. Failover to Sentinel-1 (Radar) if optical is unavailable or too cloudy
        if (!bestImage) {
            const radarResults = await searchRadarImagery(
                bbox,
                dateStart.toISOString().split('T')[0],
                dateEnd.toISOString().split('T')[0]
            );

            if (radarResults.features && radarResults.features.length > 0) {
                bestImage = radarResults.features[0];
                isRadar = true;
                logger.info('🛰️ Using Sentinel-1 Radar imagery (All-weather mode)');
            }
        }

        if (!bestImage) {
            logger.warn('⚠️ No satellite imagery (Optical or Radar) found for this location/date');
            return {
                status: 'no_data',
                message: 'No satellite imagery (Optical or Radar) available for this location and date range',
                searchParams: { lat, lng, date: targetDate, radius }
            };
        }

        const imageDate = new Date(bestImage.properties.datetime);
        const cloudCover = isRadar ? 0 : bestImage.properties['eo:cloud_cover'];

        // Calculate metadata (NDWI for optical, Amplitude-based for radar)
        let processedData;
        if (isRadar) {
            // Simplified Radar metadata
            const visualUrlUnsigned = bestImage.assets?.rendered_preview?.href || bestImage.assets?.thumbnail?.href || null;
            const visualUrl = await signPlanetaryComputerUrl(visualUrlUnsigned);
            processedData = {
                visualUrl,
                interpretation: {
                    high: 'Low backscatter (dark areas) indicates standing water',
                    mode: 'Radar (Synthetic Aperture Radar)'
                },
                sensorType: 'Sentinel-1 (Radar)'
            };
        } else {
            processedData = await calculateNDWI(bestImage);
            processedData.sensorType = 'Sentinel-2 (Optical)';
        }

        if (!processedData) {
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
                visualUrl: processedData.visualUrl,
                bands: processedData.bands || null,
                sensorType: processedData.sensorType
            },
            ndwi: !isRadar ? {
                formula: processedData.formula,
                interpretation: processedData.interpretation,
                bandsAvailable: true
            } : null,
            radar: isRadar ? {
                interpretation: processedData.interpretation
            } : null,
            metadata: {
                source: isRadar ? 'Sentinel-1 GRD (Microsoft Planetary Computer)' : 'Sentinel-2 L2A (Microsoft Planetary Computer)',
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
