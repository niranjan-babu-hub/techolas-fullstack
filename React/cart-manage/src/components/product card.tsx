   import type { NavigateFunction } from "react-router";
import type { Product } from "../types/dymmyjson";
 
  interface ProductCardProps{
    product: Product;
    onAddToCart?: (product: Product) => void;
    navigate: NavigateFunction;
  }
          export const ProductCard = ({ product, onAddToCart, navigate }: ProductCardProps) =>{
            return(
                <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden flex flex-col justify-between hover:shadow-lg transition-shadow duration-300">

                </div>
            )
          }