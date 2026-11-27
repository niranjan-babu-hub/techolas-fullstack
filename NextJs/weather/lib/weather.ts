
  export async function Getweather(city: string){
  const apikey = process.env.WEATHER_API_KEY;
  const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=${apikey}&q=${city}`)
    const data = await response.json();
    console.log(data);
    return  data;
  }
    
  