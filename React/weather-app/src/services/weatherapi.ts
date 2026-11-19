   import axios from "axios";


interface CurrentWeather {
    temp_c: number;
    feelslike_c: number;
    humidity: number;
    wind_kph: number;

    condition: {
        text: string;
        icon: string;
    };
}


interface ForecastDay {
    date: string;

    day: {
        maxtemp_c: number;
        mintemp_c: number;
        avgtemp_c: number;

        condition: {
            text: string;
            icon: string;
        };
    };
}


export interface WeatherResponse {
    location: {
        name: string;
        country: string;
        localtime: string;
    };

    current: CurrentWeather;

    forecast: {
        forecastday: ForecastDay[];
    };
}


const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;


export const getWeather = async (
    city: string
): Promise<WeatherResponse> => {

    if (!API_KEY) {
        throw new Error("Weather API key is missing");
    }

    const response = await axios.get<WeatherResponse>(
        "https://api.weatherapi.com/v1/forecast.json",
        {
            params: {
                key: API_KEY,
                q: city,
                days: 5,
        
                
            }
        }
    );

    return response.data;
};