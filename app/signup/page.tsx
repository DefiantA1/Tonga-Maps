'use client'

import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useState } from "react";
import { toast } from "react-toastify";
import { auth, db, googleProvider } from "../firebase/firebase";
import { addDoc, collection } from "firebase/firestore";

export default function SignUpPage(){

    const router = useRouter();
    const [isSigningUp, setIsSigningUp] = useState(false);
    
    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');

    return (
        <div className="bg-white h-screen w-screen flex flex-col items-center justify-center">
            <div className="text-gray-800 px-4">
                <ArrowLeft className="mb-5" onClick={() => router.push('/')}/>
                <h2 className="font-semibold text-xl block mb-1">Sign Up to Tonga Maps</h2>
                <p className="text-gray-600 text-sm mb-5">Find Stores in Tonga that accept BSP and ANZ Cards</p>
                <div className="flex flex-row gap-3">
                    <SignUpField title={'First Name'} value={firstName} setValue={setFirstName}/>
                    <SignUpField title={'Last Name'} value={lastName} setValue={setLastName}/>
                </div>
                <SignUpField title={'Email'} value={email} setValue={setEmail}/>
                <SignUpField title={'Password'} value={password} setValue={setPassword} obscureText={true}/>
                <SignUpField title={'Confirm Password'} value={confirmPassword} setValue={setConfirmPassword} obscureText={true}/>
                <button onClick={() => signUpUser()} className="mt-4 bg-blue-500 p-3 w-full rounded text-white font-bold">
                    {
                        isSigningUp 
                            ? <p className="text-center font-bold">Signing Up...</p> 
                            : <p className="text-center font-bold">Sign Up</p>
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
                {/*<div onClick={() => goToSignUpPage()} className="flex flex-row gap-1 items-center justify-center mt-7">
                    <p className="text-center text-color">Don't have an account?</p>
                    <p className="text-blue-600 font-semibold">Sign Up</p>
                </div> */}
            </div>
        </div>
    );

    async function signUpUser(){
        try{
            setIsSigningUp(true);
            if(firstName == ''){
                throw Error('Please provide first name.');
            }

            if(firstName.length < 2){
                throw Error('First name is too short');
            }

            if(lastName == ''){
                throw Error('Please provide last name.');
            }

            if(lastName.length < 2){
                throw Error('Last name is too short');
            }

            if(email == ''){
                throw Error('Please provide email.');
            }

            if(!email.includes('@')){
                throw Error('Email is not valid');
            }

            if(!email.includes('.')){
                throw Error('Email is not valid');
            }

            if(password == ''){
                throw Error('Please provide password');
            }

            if(confirmPassword == ''){
                throw Error('Please confirm your password');
            }

            if(confirmPassword != password){
                throw Error('Your passwords does not match!');
            }

            // create user
            const result = await createUserWithEmailAndPassword(auth, email, password);

            const user : User = {
                email: email,
                name: `${firstName} ${lastName}`,
                createdAt: new Date().getTime(),
                uid: result.user.uid
            };

            // save to local storage
            localStorage.setItem('email', user.email);
            localStorage.setItem('name', user.name);
            localStorage.setItem('uid', user.uid);

            // save to db
            const userRef = collection(db, 'users');
            await addDoc(userRef, user);

            router.push('/');
        }
        catch(err){
            toast.error(`${err}`);
        }

        setIsSigningUp(false);
    }

    async function authWithGoogle() {
        try{
            const result = await signInWithPopup(auth, googleProvider);
            router.push('/');
        }
        catch(err){
            toast.error(`${err}`);
        }
    }
}

type SignUpFieldProps = {
    title: string,
    value: string,
    setValue: Dispatch<SetStateAction<string>>,
    obscureText?: boolean
}

function SignUpField({title, value, setValue, obscureText = false} : SignUpFieldProps){
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