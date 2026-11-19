import { useParams } from "react-router"
import { useUserquery } from "../hooks/reactquery";


 
  export const productpage=()=>{
    const {id}= useParams<{id:string;}>();
    const {data,isLoading,isError}= useUserquery(Number(id)||0);
    if (isLoading){
        return <div>Loading...</div>
    }
    if (isError){
        return <div>Error</div>
    }
      return <div>{data?.firstName}</div>
  };