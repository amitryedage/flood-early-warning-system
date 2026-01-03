const WEATHER_API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export interface WeatherData {
    temp: number;
    condition: string;
    icon: string;
    humidity: number;
    windSpeed: number;
    rainfall: number; // in mm (last 3h or 1h)
}

export const getWeather = async (lat: number, lng: number): Promise<WeatherData | null> => {
    try {
        const response = await fetch(
            `${BASE_URL}/weather?lat=${lat}&lon=${lng}&appid=${WEATHER_API_KEY}&units=metric`
        );
        const data = await response.json();

        if (response.ok) {
            // Extract rainfall if available (OpenWeather provides rain['1h'] or rain['3h'])
            const rain = data.rain ? (data.rain['1h'] || data.rain['3h'] || 0) : 0;

            return {
                temp: data.main.temp,
                condition: data.weather[0].main,
                icon: data.weather[0].icon,
                humidity: data.main.humidity,
                windSpeed: data.wind.speed,
                rainfall: rain
            };
        } else {
            console.error('Weather API error:', data.message);
            return null;
        }
    } catch (error) {
        console.error('Error fetching weather:', error);
        return null;
    }
};
