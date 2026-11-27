"use client"

import Link from "next/link";
import { useRouter } from "next/navigation";


export const Header =()=>{
    const router = useRouter();
    return <header>
        <nav>
            <Link href={"/"}>Home</Link>
            <Link href={"/about"}>About</Link>
            <Link href={"/counter"}>Counter</Link>
            <button onClick={()=>router.push("/contact")}>contact</button>
        </nav>
    </header>
}