"use client";

import axios from "axios";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";

export default function Verifyotp(){
    const [otp,setotp] = useState(new Array(6).fill(""));
    const router = useRouter();
    const params = useParams<{email:string}>();
    const inputRef =  useRef<(HTMLInputElement | null)[]>([]);
    console.log(inputRef);

    useEffect(()=>{
        if(inputRef.current[0]){
            inputRef.current[0].focus();
        }

    },[])

    const handleSubmit = async(event:FormEvent<HTMLFormElement>)=> {
        // console.log(otp);
        const finalOtp = otp.join("");
        const email = decodeURIComponent(params.email as string);
        console.log(email);
        console.log(finalOtp);
        event.preventDefault();

        try {
            const response = await axios.post("/api/users/verify",
                JSON.stringify({
                    email:email,
                    verifyCode: finalOtp,
                }
            ));
            router.replace("/");
        } catch (error) {
            console.log("error during verification ",error);
        }
    }

    const handleChange = async(index:number,e: ChangeEvent<HTMLInputElement>)=>{
        const value = e.target.value;
        const newOtp = [...otp];
        newOtp[index] = value.substring(value.length - 1);
        setotp(newOtp);

        if(value && index < 5 && inputRef.current[index+1]){
            inputRef.current[index+1]?.focus();
        }
    }


    const handleKeyDown = (index:number,e: React.KeyboardEvent<HTMLElement>)=>{
        if(e.key === "Backspace" && index > 0 && !otp[index] && inputRef.current[index-1]){
            inputRef.current[index-1]?.focus();
        }
    }
  
    


    return (
        <div className="min-h-screen bg-black flex justify-center items-center"
        style={{
            backgroundImage: `url("https://images.unsplash.com/photo-1729433321403-69cf73e9720a?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")`,
          }}
        >

            <div className="rounded-md p-6 min-h-[200px] bg-white/10 backdrop-blur-md border border-white/20 shadow-lg ">
                <h2 className="text-center text-2xl mb-3 font-semibold text-white"> Enter the OTP Here</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        {otp.map((value,index)=>{
                            return (
                                <input key={index} type="text" value={value}
                                ref = {(input)=>{ inputRef.current[index]=input}}
                                onChange={(e)=>handleChange(index,e)}
                                onKeyDown={(e)=>handleKeyDown(index,e)}
                                className="border rounded-md border-purple-300 focus:border-primary focus:ring-2 focus:ring-primary focus:outline-none w-10 h-10 md:w-14 md:h-14 m-1 text-primary font-medium mt-2 bg-purple-200 text-center text-xl md:text-2xl"
                                />
                            )
                        })}
                    </div>
                    <div className="flex justify-center">
                        <button type="submit"  className="p-2 text-sm md:text-lg bg-primary text-white rounded-md mt-2.5 pl-8 pr-8 hover:bg-secondary">Submit</button>
                    </div>
                    
                </form>
            </div>
        </div>
    );
}