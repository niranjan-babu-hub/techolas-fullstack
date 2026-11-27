import { Suspense } from "react"

  async function Products (){
    const response = await fetch ('https://dummyjson.com/products')
    const data = await response.json ()

     return (
        <div>
            <h1>Product List</h1>
            {data.products.map((products:any)=>(
                <p key={products.id}>{products.title}</p>
            ))}
        </div>
     )



     
  }

     export default function page (){
        return <>
          <h1>Product list</h1>
          <Suspense fallback={<div>Loading...</div>}>
          <Products/>
          </Suspense>
        </>
          
            

     
     

    }
// async function products(){
//     "use cache"
//     const response = await fetch('https://dummyjson.com/products')
//     const data = await response.json();
//     return<>
//     <h1>products</h1>
//     {data.products.map((product:any)=>(
//         <p key ={product.id}>{product.title}

//         </p>
// ))}

//     </>
// }
// export default products


