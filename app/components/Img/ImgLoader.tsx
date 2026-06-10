'use client'

import { useState } from "react";

type ImgLoaderProps = {
    src: string
}

export const ImgLoader = ({src} : ImgLoaderProps) => {
    const [loading, setLoading] = useState(true);
    
    return (
        <div className="w-50 h-50">
            {
                loading && <div className="animate-pulse bg-gray-200 rounded" />
            }
            <img src={src} className={loading ? `opacity-0` : `opacity-100`} onLoad={() => setLoading(false)}/>
        </div>
    );
}