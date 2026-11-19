//         import { useEffect, useState } from "react";

// import { api } from "../lib/axios";
// import type { User } from "../types/users";
 



        //  export const AxiosPage = () =>{
        //      const [users, setUsers] = useState <User[]>([]);

        //      const getUsers = async () =>{
        //         try{
        //              const response = await api.get<User[]>("/users");
        //     setUsers(response.data);
        //         }catch (err){

        //         }
        //      }
        //      useEffect(() =>{
        //          getUsers();
        //      }, []);

        //      return <div>
        //         {
        //             users.map(user =>{
        //                                 return <div key={user.id}>
        //             <h1>{user.name}</h1>
        //             <p>{user.email}</p>
        //         </div>

        //             })
        //         }
        //      </div>
        //  };