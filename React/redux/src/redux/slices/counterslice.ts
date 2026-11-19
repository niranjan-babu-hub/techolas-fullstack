  import {createSlice, type PayloadAction }from "@reduxjs/toolkit";

   type Init = {
     value:number;
   }
    
    const Init : Init ={
    value: 0
}
        
   const counterSlice = createSlice({
      name: "counter",
      initialState: Init,
       reducers: {
         increment: (state, action: PayloadAction<Init>) =>{
           state.value += action.payload.value;
         },
          decrement: (state, action: PayloadAction<Init>) => {
             state.value -= action.payload.value;
          }
       }
   });


            export const { increment, decrement } = counterSlice.actions; 


            export const { reducer: counterReducer } = counterSlice;
