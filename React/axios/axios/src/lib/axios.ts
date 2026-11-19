//        import axios from "axios";

//   export const api = axios.create({
//         baseURL: "https://dummyjson.com",

//   })
   
//       api.interceptors.request.use((config) =>{
//             config.headers.Authorization = "Bearer";
//     return config;

//       })

//       api.interceptors.response.use((response) =>{
//               return response;

//       }, (error) =>{
//               return Promise.reject(error);
//       })



        import axios from "axios";

export const api = axios.create({
    baseURL: "https://dummyjson.com",
})