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
import { House, Settings, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";


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

  const [panToPosition, setPanToPosition] = useState<{lat: number, lng: number} | null>(null);

  const [shops, setShops] = useState<Shop[]>([]);

  const [mapTypeId, setMapTypeId] = useState<'roadmap' | 'satellite'>('roadmap');

  const router = useRouter();

  const [selectedShopTile, setSelectedShopTile] = useState<null | Shop> (null);


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
    <div className="bg-blue-300 h-screen">
      <div className="relative w-full h-full">
        <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY!}>
          <Map
            style={{width: '100%', height: '100%'}}
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
              <PanController target={panToPosition} />
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
                shops.filter((s) => !s.pending || s.uid == localStorage.getItem('uid') || localStorage.getItem('type') == 'super').map((s) => (<ShopMarker key={s.id} shop={s}/>))
              }
          </Map>
        </APIProvider>
        <div className="absolute top-5 right-2 flex flex-row gap-3 justify-center items-center">
          <Switch value={mapTypeId == 'roadmap'} onChange={() => toggleMap()}/>
          <p className="cursor-pointer bg-gray-600 px-2 py-1 rounded" onClick={() => toggleMap()}>{mapTypeId == 'roadmap' ? 'Road Map' : 'Satellite'}</p>
          {
            <div onClick={() => goToSettingPage()} className="bg-gray-600 p-1 rounded-full">
              <Settings className="cursor-pointer"/>
            </div>
          }
        </div>
        <div className="absolute top-4 left-4">
          <div className="flex flex-row gap-4">
            <div style={{backgroundColor: '#F8FAFD'}} className="w-80 border border-white opacity-90 h-185 p-5 hidden lg:block rounded-xl overflow-y-auto">
              <h2 style={{color: '#0F172A'}} className="text-xl font-semibold">Tonga Maps</h2>
              <p className="text-sm" style={{color: '#64748B'}}>Shops That Accept Card Payments</p>
              <hr className="border border-gray-400 my-3"/>
              <ul>
                {shops.length != 0 && shops.sort((a,b) => a.name.localeCompare(b.name)).map((s) => 
                  <li className={`cursor-pointer`} key={s.id} onClick={() => {handleShopTileClick(s)}}>
                    <div className={`flex flex-row gap-4 my-3 items-center p-2 ${selectedShopTile == s ? 'border border-green-400 bg-green-200 rounded' : ''}`}>
                      <div className="relative h-8 w-8 flex flex-row">
                        <div className={`absolute rounded p-1 ${selectedShopTile == s ? 'opacity-100' : 'opacity-5'} h-9 w-9`} style={{backgroundColor: selectedShopTile == s ? '#1ead2a' : '#0F172A'}}>
                        </div>
                        <ShoppingCart style={{color: selectedShopTile == s ? 'white' : '#64748B'}} className="cursor-pointer absolute text-black top-2 left-2" size={"20"}/>
                      </div>
                      <div>
                        <p className="cursor-pointer" style={{color: '#334155'}}>{s.name}</p>
                        <div className="flex flex-row items-center gap-1">
                          {
                            s.acceptsBSP == true ? <img src={'/BSP.png'} className="w-5 h-5 rounded"/> : <></>
                          }
                          {
                            s.acceptsANZ == true ? <img src={'/ANZ.png'} className="w-5 h-5 rounded"/> : <></>
                          }
                        </div>
                      </div>
                    </div>
                  </li>
                )}
              </ul>
            </div>
            <img src={'/defiant-logo.png'} className="h-12 w-12"/>
          </div>
        </div>
      </div>
    </div>
  );

  function handleShopTileClick(shop: Shop) {
    setPanToPosition({
      lat: shop.lat,
      lng: shop.lng
    });

    setSelectedShopTile(shop);
  }

  function toggleMap(){
    if(mapTypeId == 'roadmap'){
      setMapTypeId('satellite');
      return;
    }

    setMapTypeId('roadmap');
  }

  function goToSettingPage(){
    if(auth.currentUser == null){
      setLoginModalOpen(true);
      return;
    }

    router.push('/settings');
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

    setMarkerPosition({
      lat: latLng.lat,
      lng: latLng.lng,
    });

    setPanToPosition({
      lat: latLng.lat,
      lng: latLng.lng,
    });

    if(auth.currentUser == null){
      setLoginModalOpen(true);
      return;
    }

    setShopModalOpen(true);
  }
}

