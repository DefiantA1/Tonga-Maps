import { AdvancedMarker, useMap } from "@vis.gl/react-google-maps";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";


export function MyMarker(){
  const map = useMap();
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

        if(map){
          const offset = {
            lat: pos.coords.latitude, 
            lng: pos.coords.longitude
          };

          map.panTo(offset);
        }
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