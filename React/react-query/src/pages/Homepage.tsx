// // import { useQuery } from "@tanstack/react-query"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {  useNavigate } from "react-router";
import { useUserquery, useUsersquery } from "../hooks/reactquery";
import { api } from "../lib/axios";

// import { api } from "../lib/axios"
// import type { Users } from "../types/users";
// import { Child } from "../components/child";

   



//    export const Homepage =()=> {
//     const {data,isLoading,isError} = useQuery({

//         queryKey:["users"],
//         queryFn: async () =>{
//             const res = await api.get<Users>("/users");
//             return res. data;
//         },
//          refetchOnWindowFocus: false,
//         enabled: true,
//         retry: 5,
//         staleTime: 1000 * 60
//     });
//     if(isLoading) {
//         return <div>Loading...</div>
//     }
//     if (isError){
//         return <div>Error</div>
//     }
//      return <div>
//         <div className="text-center my-5">
//             <h1 className="text-4xl font-bold underline">Tanstack React query</h1>

//         </div>
//          {data?.users[0].firstName}
//            <br /><br />
//         <Child/>
//      </div>
//    };



  
 export const Homepage=()=>{
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const {data,isLoading,isError} = useUsersquery();

    const {mutate}=useMutation({
        mutationFn: async ()=>{
            const response = await api.post("/users/add",{
                firstName:"Niranjan",
                lastName:"babu",
                age:21
            });
            return response.data;
        },
        onSuccess:()=>{
            return queryClient.invalidateQueries({
                queryKey:["users"]
            })
        }
    });
     if (isLoading){
        return <div>Loading...</div>
     }
     if (isError){
        return <div>Error</div>
     }
     return <div className="p-3">
        <div className="text-center my-5">
            <h1 className="text-4xl font-bold underline">Tanstack reactquery</h1>
        </div>
        <div className="text-end">
            <button className="p-2 px-4 bg-indigo-500 text-white rounded" onClick={()=> mutate()}>Add user </button>

        </div>
        <div className="grid gap-3 grid-cols-3 my-3">
            {data?.users.map(user =>{
                return <div  onClick={() => navigate(`/users/${user.id}`)} className="border p-3 cursor-pointer" key={user.id}>{user.firstName} {user.lastName} {user.age}</div>
            })}
        </div>
     <br /><br />
     </div>
 };