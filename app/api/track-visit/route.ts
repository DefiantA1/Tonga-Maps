import { db } from "@/app/firebase/firebase";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { headers } from "next/headers";

export async function POST(req: Request) {
    const ip = await getIpAddress();

    const ms : number = new Date().getTime();
    
    const docRef = collection(db, 'visits');
    await addDoc(docRef, {
        ip: ip,
        dt: Timestamp.fromMillis(ms)
    })
    
    return new Response('Success', {
        status: 201,
        headers: { 'Content-Type': 'application/json' }
    });
}

async function getIpAddress() : Promise<string> {
    const headersList = await headers();

    const forwardedFor = headersList.get("x-forwarded-for");
    const realIp = headersList.get("x-real-ip");

    const ip =
        forwardedFor?.split(",")[0].trim() ||
        realIp ||
        "unknown";

    return ip;
}