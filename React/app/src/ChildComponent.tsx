interface props{
    p1:string;
    p2:string;
    children:React.ReactNode;
    data:string;
}

    export const ChildComponent =({p1,p2,children,data}:props) =>{


     const handleClick = function (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        console.log("clicked", e);
    }


        return <div>

            Child Component -{p1},{p2}
            <br />
            Rendered in Child component-{children}
            <br />
            Data:{data}

            <div>
            <button onClick={handleClick}>Click Me!</button>
        </div>
        </div>

    }