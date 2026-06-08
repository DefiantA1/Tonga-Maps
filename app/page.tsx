'use client'

import { AdvancedMarker, APIProvider, Map} from "@vis.gl/react-google-maps";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export const containerStyle = {
    width: '100%',
    height: '80vh',
    borderRadius: '15px 0px 0px 15px',
};

const zoom = 15

const center = {
  lat: -21.1394,
  lng: -175.2049, // Nuku'alofa
};

export default function Home() {
  return (
      <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY!}>
        <Map
          style={{width: '100vw', height: '100vh'}}
          mapId={process.env.NEXT_PUBLIC_MAP_ID!}
          defaultCenter={center}
          defaultZoom={zoom}
          gestureHandling='greedy'
          colorScheme="DARK"
          disableDefaultUI
        >
          <MyLocationMarker/>
        </Map>
      </APIProvider>
  );
}

function MyLocationMarker(){

  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);
  
  useEffect(() => {

    const getLocation = () => {
      if(!navigator.geolocation){
        console.log('Geolocation is not supported');
        return;
      }

      navigator.geolocation.getCurrentPosition((pos) => {
        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        });
      }, (err) => {}, {enableHighAccuracy: true, timeout: 15000});
    }

    getLocation();

  }, [])
  
  return (
    <AdvancedMarker
      position={center}
      zIndex={2}
      title={'myLocation'}
      onClick={() => toast.info("That's My Location")}
    >
      <div className="relative flex items-center justify-center">
          <span
            className="absolute size-8 animate-ping rounded-full opacity-40"
            style={{ backgroundColor: "#3eb06b" }}
          />
          <span
            className={`relative block size-3.5 rounded-full border-2 ${
                "scale-125 ring-2 ring-white/30" 
            }`}
            style={{
              backgroundColor: "#3eb06b",
              borderColor: `#ffffff99`,
              boxShadow: `0 0 12px #ffffff66`,
            }}
          />
        </div>
    </AdvancedMarker>
  );
}