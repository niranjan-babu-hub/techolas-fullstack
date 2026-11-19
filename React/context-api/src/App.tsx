      import { createBrowserRouter, RouterProvider, type RouteObject } from "react-router"
   
import { createContext } from "react"
import { HomePage } from "./pages/Homepage";
import { AboutPage } from "./pages/Aboutpage";

     const routeData: RouteObject[] =[
      {
         path: "/",
        Component: HomePage
      },
      {
         path: "/about",
        Component: AboutPage
      }
     ];
       
       const routes = createBrowserRouter(routeData)
        type ContextValueType = { global: string; }

         export const CounterContext = createContext<ContextValueType | null>(null);

      export const App = () =>{
        const data = "This is global data";
          return <CounterContext.Provider value={{global: data}}>
        <RouterProvider router={routes} />
    </CounterContext.Provider>
      }
