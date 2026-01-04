const https = require('https');

/**
 * Weather Service - Fetches real-time weather data from OpenWeatherMap API
 */

// Cache to store last successful weather data
let weatherCache = {
    data: null,
    timestamp: null
};

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Fetch weather data from OpenWeatherMap API
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @returns {Promise<Object>} Weather data object
 */
const fetchWeatherData = (lat, lng) => {
    return new Promise((resolve, reject) => {
        const apiKey = process.env.OPENWEATHER_API_KEY;

        if (!apiKey || apiKey === 'your_api_key_here') {
            console.warn('⚠️  OpenWeatherMap API key not configured. Using cached/fallback data.');

            // Return cached data if available
            if (weatherCache.data) {
                return resolve(weatherCache.data);
            }

            // Fallback to simulated data
            return resolve({
                temperature: 28.5,
                rainfall: Math.random() * 100, // Random rainfall for simulation
                humidity: 75,
                windSpeed: 12.5,
                condition: 'Clouds',
                description: 'scattered clouds',
                icon: '02d',
                source: 'simulated'
            });
        }

        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${apiKey}&units=metric`;

        https.get(url, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                try {
                    const parsed = JSON.parse(data);

                    if (res.statusCode === 200) {
                        // Extract rainfall data (OpenWeather provides rain['1h'] or rain['3h'])
                        const rainfall = parsed.rain
                            ? (parsed.rain['1h'] || parsed.rain['3h'] || 0)
                            : 0;

                        const weatherData = {
                            temperature: parsed.main.temp,
                            rainfall: rainfall,
                            humidity: parsed.main.humidity,
                            windSpeed: parsed.wind.speed,
                            condition: parsed.weather[0].main,
                            description: parsed.weather[0].description,
                            icon: parsed.weather[0].icon,
                            pressure: parsed.main.pressure,
                            visibility: parsed.visibility / 1000, // Convert to km
                            cloudiness: parsed.clouds.all,
                            source: 'openweathermap',
                            location: parsed.name,
                            timestamp: Date.now()
                        };

                        // Update cache
                        weatherCache = {
                            data: weatherData,
                            timestamp: Date.now()
                        };

                        console.log(`✅ Weather data fetched for ${parsed.name}: ${weatherData.temperature}°C, Rainfall: ${weatherData.rainfall}mm`);
                        resolve(weatherData);
                    } else if (res.statusCode === 401) {
                        console.warn('🔑 API Key Pending Activation: Using simulated weather data for now...');

                        const simulatedData = {
                            temperature: 29.5,
                            rainfall: 65, // Significant rainfall for demo
                            humidity: 82,
                            windSpeed: 15.2,
                            condition: 'Rain',
                            description: 'heavy intensity rain',
                            icon: '09d',
                            pressure: 1012,
                            visibility: 8,
                            cloudiness: 90,
                            source: 'simulated (activation-pending)',
                            location: 'Godavari Basin (Demo)',
                            timestamp: Date.now()
                        };

                        resolve(simulatedData);
                    } else {
                        console.error('❌ OpenWeatherMap API error:', parsed.message);

                        // Return cached data if available
                        if (weatherCache.data) {
                            console.log('📦 Using cached weather data');
                            resolve(weatherCache.data);
                        } else {
                            reject(new Error(parsed.message || 'Weather API error'));
                        }
                    }
                } catch (error) {
                    console.error('❌ Error parsing weather data:', error);

                    // Return cached data if available
                    if (weatherCache.data) {
                        console.log('📦 Using cached weather data');
                        resolve(weatherCache.data);
                    } else {
                        reject(error);
                    }
                }
            });
        }).on('error', (error) => {
            console.error('❌ Network error fetching weather:', error.message);

            // Return cached data if available
            if (weatherCache.data) {
                console.log('📦 Using cached weather data');
                resolve(weatherCache.data);
            } else {
                reject(error);
            }
        });
    });
};

/**
 * Get cached weather data if still valid
 * @returns {Object|null} Cached weather data or null
 */
const getCachedWeather = () => {
    if (weatherCache.data && weatherCache.timestamp) {
        const age = Date.now() - weatherCache.timestamp;
        if (age < CACHE_DURATION) {
            return weatherCache.data;
        }
    }
    return null;
};

module.exports = {
    fetchWeatherData,
    getCachedWeather
};
