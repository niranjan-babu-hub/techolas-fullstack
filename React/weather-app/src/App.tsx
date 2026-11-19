  import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { getWeather } from "./services/weatherapi";

function App() {

    const [search, setSearch] = useState("");
    const [city, setCity] = useState("London");

    const {
        data,
        isLoading,
        isError,
        error
    } = useQuery({

        queryKey: ["weather", city],

        queryFn: () => getWeather(city),

        enabled: !!city,

        staleTime: 5 * 60 * 1000

    });

    const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {

        event.preventDefault();

        if (search.trim()) {
            setCity(search.trim());
        }

    };

    if (isLoading) {
        return <h2>Loading weather...</h2>;
    }

    if (isError) {
        return <h2>Error: {error.message}</h2>;
    }

    if (!data) {
        return <h2>No weather data available</h2>;
    }

    return (

        <div className="bg-green-600">

            <h1>Weather App</h1>

            <div className="bg-indigo-800 border px-4  rounded-lg">
              <form onSubmit={handleSearch}>

                <input className="border bg-yellow-300 px-2 rounded-lg"
                    type="text"
                    placeholder="Enter city name"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <button type="submit" className="border bg-amber-200 px-2 rounded-lg">
                    Search
                </button>

            </form>

            <h2>
                {data.location.name}, {data.location.country}
            </h2>

            <img
                src={`https:${data.current.condition.icon}`}
                alt={data.current.condition.text} className="ml-116"
            />

            <h1>{data.current.temp_c}°C</h1>

            <h3>{data.current.condition.text}</h3>

            <p>Feels Like: {data.current.feelslike_c}°C</p>

            <p>Humidity: {data.current.humidity}%</p>

            <p>Wind: {data.current.wind_kph} km/h</p>
            </div>

            <h2>5 Day Forecast</h2>

            {data.forecast.forecastday.map((day) => (

                <div key={day.date}>

                    <h3>{day.date}</h3>

                    <img
                        src={`https:${day.day.condition.icon}`}
                        alt={day.day.condition.text} className="ml-116"
                    />

                    <p>{day.day.condition.text}</p>

                    <p>Max: {day.day.maxtemp_c}°C</p>

                    <p>Min: {day.day.mintemp_c}°C</p>

                </div>

            ))}

        </div>

    );

}

export default App;
