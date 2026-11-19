import { Fragment } from "react";
import { ChildComponent } from "./ChildComponent";



     const data ="hello";

     export const App =() =>{
      return<Fragment>
        <h1>hello</h1>
        <p>hyy</p>
        <ChildComponent p1="data1" p2 ="data2" data={data}>
          <span>This is child of child component</span>
        </ChildComponent>
          </Fragment>
     }
