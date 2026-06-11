'use client'

import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { Dispatch, SetStateAction, useState } from "react";
import { auth, googleProvider } from "../firebase/firebase";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { LogoText } from "../components/misc/logotext";

export default function LoginPage(){
    const router = useRouter();
    const [isLoggingIn, setIsLoggingIn] = useState(false);

    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    return (
        <div style={{backgroundColor: 'white'}} className="w-screen h-screen flex flex-col justify-center items-center">
            <div className="text-gray-800 px-5">
                <div className="flex flex-row items-center justify-center mb-4">
                    <img className="h-14 w-14" src={'/defiant-logo.png'}/>
                </div>
                <h2 className="font-semibold text-xl text-center block mb-1">Welcome to Tonga Maps</h2>
                <p className="text-gray-600 text-sm text-center mb-8">Find Stores in Tonga that accept BSP and ANZ Cards</p>
                <LoginField title={'Email'} value={email} setValue={setEmail}/>
                <LoginField title={'Password'} value={password} setValue={setPassword} obscureText={true}/>
                <button onClick={() => login()} className="mt-4 bg-blue-500 p-3 w-full rounded text-white font-bold">
                    {
                        isLoggingIn 
                            ? <p className="text-center font-bold">Logging In...</p> 
                            : <p className="text-center font-bold">Log in</p>
                    }
                </button>
                <div className="flex flex-row items-center gap-4 mt-8">
                    <hr className="text-gray-300 border flex-1"/>
                    <p className="text-sm text-gray-400 font-semibold">OR</p>
                    <hr className="text-gray-300 border flex-1"/>
                </div>
                <button onClick={() => authWithGoogle()} className="bg-gray-200 w-full rounded-full mx-auto text-center p-3 px-4 mt-7 flex flex-row items-center justify-between">
                    <img src={'/google.png'} className="w-7 h-7"/>
                    <p className="font-semibold">Continue with Google</p>
                    <div className="w-7 h-7"></div>
                </button>
                <div onClick={() => goToSignUpPage()} className="flex flex-row gap-1 items-center justify-center mt-7">
                    <p className="text-center text-color">Don't have an account?</p>
                    <p className="text-blue-600 font-semibold">Sign Up</p>
                </div>
            </div>
        </div>
    );

    async function login(){
        try{
            setIsLoggingIn(true);

            if(email == ''){
                throw Error('Please provide email.');
            }

            if(password == ''){
                throw Error('Please provide password');
            }

            const result = await signInWithEmailAndPassword(auth, email, password);

            router.push('/');
        }
        catch(err){
            toast.error(`${err}`);
        }

        setIsLoggingIn(false);
    }

    async function authWithGoogle() {
        try{
            const result = await signInWithPopup(auth, googleProvider);
        }
        catch(err){
            toast.error(`${err}`);
        }
    }

    async function goToSignUpPage(){
        router.push('/signup');   
    }
}

type LoginFieldProps = {
    title: string,
    value: string,
    setValue: Dispatch<SetStateAction<string>>,
    obscureText?: boolean
}

function LoginField({title, value, setValue, obscureText = false} : LoginFieldProps){
    return (
        <div className="my-4">
            <label className="text-sm text-gray-700 block">{title}</label>
            <input 
                className="bg-gray-200 border border-gray-300 rounded h-10 w-full block focus:border-blue-500 focus:outline-none px-2"
                type={obscureText ? 'password' : 'email'}
                onChange={(e) => setValue(e.target.value)}
                value={value}
            />
        </div>
    )
}