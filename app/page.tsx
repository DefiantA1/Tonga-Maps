'use client'

import { AdvancedMarker, APIProvider, Map, MapMouseEvent, useMap} from "@vis.gl/react-google-maps";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

export const containerStyle = {
    width: '100%',
    height: '80vh',
    borderRadius: '15px 0px 0px 15px',
};

const zoom = 15

const nukualofa = {
  lat: -21.1394,
  lng: -175.2049, // Nuku'alofa
};

export default function Home() {
  const dragged = useRef(false);
  const [markerPosition, setMarkerPosition] = useState<{lat: number, lng: number} | null>(null);

  function handleMapClick(e: MapMouseEvent){
    // returns if a drag was detected
    if(dragged.current){
      dragged.current = false;
      return;
    }

    const latLng = e.detail.latLng;

    setMarkerPosition({
      lat: latLng.lat,
      lng: latLng.lng,
    });
  }

  return (
      <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY!}>
        <Map
          style={{width: '100vw', height: '100vh'}}
          mapId={process.env.NEXT_PUBLIC_MAP_ID!}
          defaultCenter={nukualofa}
          defaultZoom={zoom}
          gestureHandling='greedy'
          colorScheme="DARK"
          onDragstart={() => {
            dragged.current = true;
          }}
          onClick={(e) => handleMapClick(e)}
          disableDefaultUI
        >
          <MyLocationMarker/>
          <PanController target={markerPosition} />
          {
            markerPosition != null && <AdvancedMarker position={markerPosition} />
          }
        </Map>
      </APIProvider>
  );
}

function PanController({
  target,
}: {
  target: any | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (map && target) {
      map.panTo(target);
    }
  }, [map, target]);

  return null;
}

function MyLocationMarker(){

  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);
  
  useEffect(() => {
    const getMyLocation = () => {
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

    getMyLocation();
  }, [])
  
  return (
    <>
      {
        location != null && <AdvancedMarker
          position={location}
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
      }
    </>
  );
}