// import{ useState } from "react";
//   type Counter ={

//     counter_one: number;
//     counter_two: number;
//   }
//      type CounterType = 1 | 2;

//   export const App = () =>{
    
//     //  const [state, setState] = useState<number>(0);
//      const [counter, setCounter] = useState <Counter>({ counter_one: 1, counter_two: 2 });

//         // const handleUpdateA = () =>{

//           // setState(state + 1);
//         // }
//         const handleUpdate = (num: CounterType) =>{
//            if (num == 1){
//             setCounter({ ...counter, counter_one: counter.counter_one + 1 });
//            }
//            if (num == 2) {
//             setCounter({ ...counter, counter_two: counter.counter_two + 1 });
//            }
//         }

//          return <>
//          <div>
//           {/* <p>Data - {state}</p>
//                <button onClick={handleUpdateA}>Update A</button> */}
//                 <p>Counter 1: {counter.counter_one}</p>
//         <p>Counter 2: {counter.counter_two}</p>
                                               
//          </div>
//            <button onClick={function (){
//              handleUpdate(1)
//            }} > Update Counter 1</button>
//            <button onClick={() => handleUpdate(2)}>Update Counter 2</button>
//            </>
            
          
//   }











              // map, conditonal rendering

          //     import { useState } from "react";
          
          //     export const App = () =>{
          //       const [data, setData] = useState<number>(0);
          //        const [numbers] = useState<Array<number>>([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
              

          //     const handleClick = () =>{
          //       setData(data + 1)
          //     }
                    
          //   return <div>
           
          //   <div>{data}</div>
          //   <button onClick={handleClick}>update</button>
          //   {
          //     numbers.map((number) => {

          //        return <div key={number}>{number}</div>
          //       })

          //   }


          //   </div>

          // }




          import { useState } from "react";
        
           export const App = () =>{
             const [theme, setTheme] = useState<"light" | "dark">("light");
              const [counter, setCounter] = useState<number>(0);
                  const [className, setClassName] = useState<string>("font-mono uppercase bg-white text-black flex flex-col items-center justify-center h-screen");


            return <div className={className}>

               {theme === "dark" && "Dark theme"}
               {theme === "light" && "Light theme"}

                               {/* ternary */}
                      
        { theme === "dark" ? <div>This is dark mode</div> : <div>This is light mode</div>}

        <button className="p-2 bg-red-500 mt-8 text-white cursor-pointer rounded-full px-7 active:scale-99 shadow shadow-black active:shadow-none duration-200 font-mono" onClick={() => {

             if (theme === "dark"){
              setTheme("light")
              setClassName(className.replace("bg-black text-white", "bg-white text-black"));
             }else{
              setTheme("dark");
              setClassName(className.replace("bg-white text-black", "bg-black text-white"));
             }
              setCounter(counter + 1);
        }}>Toggle</button>
         <p className="font-serif capitalize mt-4 text-green-700">You have clicked button <span className="text-2xl">{counter}</span> times</p>

    </div>
}

