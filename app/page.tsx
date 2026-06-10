'use client'

import { AdvancedMarker, APIProvider, Map, MapMouseEvent, useMap} from "@vis.gl/react-google-maps";
import { useEffect, useRef, useState } from "react";
import { PanController } from "./components/map/PanController";
import { MyMarker } from "./components/map/MyMarker";
import { AddShopModal } from "./components/modals/AddShopModal";
import { collection, onSnapshot } from "firebase/firestore";
import { auth, db } from "./firebase/firebase";
import { ShopMarker } from "./components/map/markers/ShopMarker";
import Switch from "./components/misc/switch";
import { LoginModal } from "./components/modals/LoginModal";


export const containerStyle = {
    width: '100%',
    height: '80vh',
    borderRadius: '15px 0px 0px 15px',
};

const zoom = 18

const nukualofa = {
  lat: -21.1394,
  lng: -175.2049, // Nuku'alofa
};

export default function Home() {
  const dragged = useRef(false);
  const [markerPosition, setMarkerPosition] = useState<{lat: number, lng: number} | null>(null);
  const [shopModalOpen, setShopModalOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  const [shops, setShops] = useState<Shop[]>([]);

  const [mapTypeId, setMapTypeId] = useState<'roadmap' | 'satellite'>('roadmap');


  useEffect(() => {
      const unsubscribe = onSnapshot(
        collection(db, 'markers'),
        (snapshot) => {
          snapshot.docChanges().forEach((change) => {
            const shop  = {
              id: change.doc.id,
              ...change.doc.data(),
            } as Shop;

            if (change.type === 'added') {
              setShops((prev) => [...prev, shop]);
            }

            if (change.type === 'modified') {
              setShops((prev) =>
                prev.map((m) =>
                  m.id === shop.id ? shop : m
                )
              );
            }

            if (change.type === 'removed') {
              setShops((prev) =>
                prev.filter((m) => m.id !== shop.id)
              );
            }
          });
        }
      );

      return unsubscribe;
  }, [])


  return (
    <div className="relative">
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
          keyboardShortcuts={false}
          disableDefaultUI={true}
          mapTypeId={mapTypeId}
        >
            <MyMarker/>
            <PanController target={markerPosition} />
            {
              markerPosition != null && <AdvancedMarker position={markerPosition} />
            }
            <AddShopModal 
              isOpen={shopModalOpen} 
              exit={() => {
                setShopModalOpen(false);
                setMarkerPosition(null);
              }}
              markerPosition={markerPosition}
            />
            <LoginModal isOpen={loginModalOpen} exit={() => setLoginModalOpen(false)}/>
            {
              shops.filter((s) => !s.pending).map((s) => (<ShopMarker key={s.id} shop={s}/>))
            }
        </Map>
      </APIProvider>
      <div className="absolute top-5 right-5 flex flex-row gap-3">
        <Switch value={mapTypeId == 'roadmap'} onChange={() => toggleMap()}/>
        <p className="bg-gray-600 px-2 py-1 rounded" onClick={() => toggleMap()}>{mapTypeId == 'roadmap' ? 'Road Map' : 'Satellite'}</p>
      </div>
      <div className="absolute top-4 left-4">
        <img src={'/defiant-logo.png'} className="h-12 w-12"/>
      </div>
    </div>
  );

  function toggleMap(){
    if(mapTypeId == 'roadmap'){
      setMapTypeId('satellite');
      return;
    }

    setMapTypeId('roadmap');
  }


  function handleMapClick(e: MapMouseEvent){
    // returns if a drag was detected
    if(dragged.current){
      dragged.current = false;
      return;
    }
    
    const latLng = e.detail.latLng;

    if(latLng == null){
      return;
    }

    if(auth.currentUser == null){
      setLoginModalOpen(true);
      return;
    }

    setShopModalOpen(true);

    setMarkerPosition({
      lat: latLng.lat,
      lng: latLng.lng,
    });
  }
}

