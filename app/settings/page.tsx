"use client"

import { signOut } from "firebase/auth";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { auth } from "../firebase/firebase";
import { useRouter } from "next/navigation";

const SettingsPage = () => {
    const router = useRouter();

    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const name = localStorage.getItem('name');
        const email = localStorage.getItem('email');
        const createdAt = localStorage.getItem('createdAt');
        const uid = localStorage.getItem('uid');
        const type = localStorage.getItem('type');

        if(name == null || email == null || createdAt == null || uid == null || type == null){
            return;
        }

        const fetchedUser : User = {
            name: name,
            email: email,
            createdAt: parseInt(createdAt),
            uid: uid,
            type: type == 'super' ? 'super' : 'normal'
        };

        setUser(fetchedUser);
    }, [])
    
    return (
        <div className="bg-white w-screen h-screen p-5 text-gray-700">
            <div className="flex flex-row items-center gap-3">
                <ArrowLeft className="cursor-pointer" onClick={() => returnHome()}/>
                <p className="cursor-pointer" onClick={() => returnHome()}>Return To Home</p>
            </div>
            <div className="mt-5 px-3">
                <h2 className="text-2xl">Settings Page</h2>
                {
                    user != null && <p className="text-black">Hi {user.name}!</p>
                }
                <button className="cursor-pointer bg-blue-500 my-3 p-2 rounded text-white" onClick={() => logOut()}>Logout</button>
            </div>
        </div>
    );

    function returnHome(){
        router.push('/');
        return;
    }


    async function logOut(){
        await signOut(auth);
        localStorage.clear();

        router.push('/');
    }
}

export default SettingsPage;