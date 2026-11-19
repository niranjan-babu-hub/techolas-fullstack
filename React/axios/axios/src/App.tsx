// import { BrowserRouter,Route,Routes } from "react-router";
// import { AxiosPage } from "./pages/Axiospage";



//        export const App = () => {
//         return <BrowserRouter>
//             <Routes>
//                <Route path="/" Component={AxiosPage} />
//             </Routes>
//         </BrowserRouter>
//        }



import { BrowserRouter, Route, Routes } from "react-router"
import { RefPage } from "./pages/Refpage"


export const App = () => {
    return <BrowserRouter>
        <Routes>
            <Route path="/ref" Component={RefPage} />
        </Routes>
    </BrowserRouter>
}