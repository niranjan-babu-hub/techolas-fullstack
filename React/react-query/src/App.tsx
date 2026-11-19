import { BrowserRouter, Route, Routes } from "react-router"
import { Homepage } from "./pages/Homepage"
import { productpage } from "./pages/productpage";

 

  export const App =()=>{
    return <BrowserRouter>

         <Routes>
          <Route path ="/" Component ={Homepage}/> 
          <Route path = "/users/:id" Component={productpage}></Route>
         </Routes>

        </BrowserRouter>
  };