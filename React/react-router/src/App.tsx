import { BrowserRouter, Route, Routes } from "react-router"
import { HomePage } from "./pages/Homepage"
import { AboutPage } from "./pages/Aboutpage"
import { TopNavBar } from "./component/TopNavBar"
import { Contactpage } from "./pages/Contactpage"
import { ProfilePage } from "./pages/Profilepage"



          export const routeMap ={
            home:"/",
            about:"/about",
            Contact:"/contact",
            profile: "/profile/:id"
          }as const


           export const App = () =>{
             return <BrowserRouter>

                < TopNavBar/>
              <Routes>
                
                <Route path={routeMap.home} Component={HomePage}/>
                <Route path={routeMap.about} Component ={AboutPage}/>
                <Route path={routeMap.Contact} Component={Contactpage}/>
                <Route path={routeMap.profile} Component={ProfilePage} />
              </Routes>

             </BrowserRouter>
           }
