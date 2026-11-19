import { Link, type LinkProps } from "react-router";
import type { RouterMapType } from "../types/Route";
         
      type TLinkprops = Omit<LinkProps, "to"> &{
          
        to: RouterMapType | string;
      }

       export const TypedLink = (props: TLinkprops) =>{
                  return <Link {...props}/>
       };