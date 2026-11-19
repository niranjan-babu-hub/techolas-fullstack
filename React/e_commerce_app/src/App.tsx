import { useEffect, useState } from "react"
import { getProducts } from "./services/products"
import { type Product, type DummyJsonResponse } from "./types/dummyjson";

    const LIMIT = 30;

    export const App = () =>{

        const [products, setProducts] = useState<Product[]>([]);
        const [page, setPage] = useState<number>(1);
        const [totalPages, setTotalPages] = useState<number>(0)
         const [openedModal, setOpenedModal] = useState<Product | null>(null);
    const [prodImage, setProdImage] = useState<string | null>(null)

      
          useEffect(() =>{
            (async () =>{
              const response = await getProducts(LIMIT, (page - 1) * LIMIT);
                if (!response.ok){
                   return alert(response.message);
                }
                const data = response.data as DummyJsonResponse;
            const total_pages = Math.ceil(data.total / LIMIT)
            setProducts(data.products);
            setTotalPages(total_pages);
            })();
          }, 

           return <div>
            
           </div>
    }