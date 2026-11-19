     import { useState } from "react";

      type FormDataType = {
         name: string;
    username: string;
    phone: string;
    email: string;
    password: string;
    confirm_password: string;
      };

          export const App = () =>{
             const [formData, setFormData] = useState<FormDataType>({ name: "", username: "", phone: "", email: "", password: "", confirm_password: "" });
              const handleSubmit = (event: React.SubmitEvent) =>{
                 event.preventDefault();
                  console.log(formData);
              }
                       const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
                        if (event.target.name === "username") {
                           event.target.value = event.target.value.toLowerCase().replace(" ", "_");
                        }
                        setFormData(prevState => ({...prevState, [event.target.name]: event.target.value }));
                       }
                       return <div className="flex justify-center mt-10">
                        
                        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-100">

                           <input onChange={handleChange} value={formData.name} className="p-2 border-2 border-red-800 outline-0 rounded-md" type="text" name="name" placeholder="helen" />

                            <input onChange={handleChange} value={formData.username} className="p-2 border-2 border-red-800 outline-0 rounded-md" type="text" name="username" placeholder=" helen joy" />
                     <input onChange={handleChange} value={formData.phone} className="p-2 border-2 border-red-800 outline-0 rounded-md" type="text" name="phone" placeholder="+91 9876543210" />
                  <input onChange={handleChange} value={formData.email} className="p-2 border-2 border-red-800 outline-0 rounded-md" type="text" name="email" placeholder="Ex: helen@joy.com" />
                  <input onChange={handleChange} value={formData.password} className="p-2 border-2 border-red-800 outline-0 rounded-md" type="password" name="password" placeholder="*************" />
        <input onChange={handleChange} value={formData.confirm_password} className="p-2 border-2 border-red-800 outline-0 rounded-md" type="password" name="confirm_password" placeholder="*************" />
            <button type="submit" className="bg-yellow-800 text-white w-full p-2 rounded-md cursor-pointer">Register</button>
        </form>


                        

                       </div>
          }
