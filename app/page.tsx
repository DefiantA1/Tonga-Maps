'use client'

import { AdvancedMarker, APIProvider, Map, MapMouseEvent, useMap} from "@vis.gl/react-google-maps";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { PanController } from "./components/map/PanController";
import { MyMarker } from "./components/map/MyMarker";
import { AddShopModal } from "./components/map/AddShopModal";


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

  const [isOpen, setIsOpen] = useState(false);


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
          // disableDefaultUI
        >
            <MyMarker/>
            <PanController target={markerPosition} />
            {
              markerPosition != null && <AdvancedMarker position={markerPosition} />
            }
            <AddShopModal 
              isOpen={isOpen} 
              exit={() => {
                setIsOpen(false);
                setMarkerPosition(null);
              }}
            />
        </Map>
      </APIProvider>
  );


  function handleMapClick(e: MapMouseEvent){
    // returns if a drag was detected
    if(dragged.current){
      dragged.current = false;
      return;
    }

    setIsOpen(true);

    const latLng = e.detail.latLng;

    setMarkerPosition({
      lat: latLng.lat,
      lng: latLng.lng,
    });
  }
}

