import { db } from "@/app/firebase/firebase";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { headers } from "next/headers";

export async function POST(req: Request) {
    const ip = await getIpAddress();
    const deviceType = await getDeviceType();
    const ms : number = new Date().getTime();

    const response = await fetch(
        `http://ip-api.com/json/${ip}`
    );

    const ipData = await response.json();
    
    const docRef = collection(db, 'visits');
    await addDoc(docRef, {
        ip: ip,
        deviceType: deviceType,
        dt: Timestamp.fromMillis(ms),
        ...(ipData),
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


async function getDeviceType() : Promise<string> {
    const userAgent = (await headers()).get("user-agent") || "";

    const isMobile =
        /Android|iPhone|iPad|iPod|Mobile/i.test(userAgent);
    
    const deviceType : string = isMobile ? "mobile" : "desktop";

    return deviceType;
}