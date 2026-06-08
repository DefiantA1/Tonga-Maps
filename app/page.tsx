'use client'

import { APIProvider, Map} from "@vis.gl/react-google-maps";

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
        </Map>
      </APIProvider>
  );
}

