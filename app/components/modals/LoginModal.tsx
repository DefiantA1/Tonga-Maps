'use client'

import { auth, db, storage } from "@/app/firebase/firebase";
import { addDoc, collection } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { ShoppingCart, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";
import { toast } from "react-toastify";
import { LogoText } from "../misc/logotext";

type LoginModalProps = {
  isOpen: boolean,
  exit: () => void,
}

export function LoginModal({isOpen, exit} : LoginModalProps){

    const router = useRouter();

  
    return (
        <div
            className={`fixed inset-0 bg-black/50 transition-opacity ${
                isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
            onClick={() => exitModal()}
        >
        <div
            className={`absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 transition-transform duration-300 ease-out text-black ${
            isOpen ? 'translate-y-0' : 'translate-y-full'
            }`}
            onClick={(e) => e.stopPropagation()}
        >
            <div className="flex flex-row justify-between">
                <h2 className="font-semibold">Add Shop?</h2>
                <X onClick={() => exit()}/>
            </div>
            <hr className="mb-3 mt-2"/>
            <p>Do you want to add shop? You have to first login or create an account.</p>
            <div className="flex flex-row gap-3 mt-3 items-center">
                <button onClick={() => goToLoginPage()} className="bg-blue-500 text-white p-2 flex-1 rounded">Login</button>
                <p className="text-sm text-gray-500 font-semibold">OR</p>
                <button onClick={() => goToSignUpPage()} className="bg-blue-500 text-white p-2 flex-1 rounded">Sign Up</button>
            </div>
            <LogoText/>
        </div>
        </div>
    );

    function exitModal(){
        exit();
    }

    function goToLoginPage(){
        router.push('/login');
    }

    function goToSignUpPage(){
        router.push('/signup');
    }
}