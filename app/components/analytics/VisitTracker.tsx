'use client'

import { usePathname } from "next/navigation";
import { useEffect } from "react";

const SESSION_KEY = "visit_tracked";

export const VisitTracker = () => {
    const pathname = usePathname();

    useEffect(() => {
        if (typeof window === "undefined") return;
        if (sessionStorage.getItem(SESSION_KEY)) return;

        const track = async () => {
            try {
                const response = await fetch("/api/track-visit", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ path: pathname }),
                });

                if (response.ok) {
                    sessionStorage.setItem(SESSION_KEY, "1");
                }
            } catch {
                // Silent fail — don't affect the visitor experience
            }
        };

        track();
    }, [])
    
    return null;
}