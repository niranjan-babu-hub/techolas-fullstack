import { Address } from "cluster"



    interface Address{
        "street":string,
      "suite": string,
      "city": string,
    }
 
 interface users {
    "id": number,
    "name":string,
    "username": string,
    "email": string,

    "address": Address[]
    "phone": string,
 }