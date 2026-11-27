import { Getweather } from "@/lib/weather";
import { Suspense } from "react";


   async function Weather({searchparams}:{searchparams:Promise<{[key:string]: string | undefined}>}){
    const {city} = await searchparams;

    const weather = await Getweather(city || "london");
     return <div>
      <h1>Weather Dashboard</h1>
      <form>
     <input type="text"name="city"placeholder="Enter your city"></input> 
     <button type="submit">search</button>
      </form>
        
         <h2>
          {weather.location.country}
          <h3>
            {weather.current.temp_c}
          </h3>
         </h2>
     </div>
   }
    export default function Home({searchparams}:{searchparams:Promise<{[key:string]:string | undefined}>}){
    return <div>
      <Suspense fallback={<div>Loading</div>}>
      <Weather searchparams={searchparams}></Weather>

      </Suspense>
    </div>
    }
