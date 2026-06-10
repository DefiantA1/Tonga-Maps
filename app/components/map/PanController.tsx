import { useMap } from "@vis.gl/react-google-maps";
import { useEffect } from "react";

export function PanController({
  target,
}: {
  target: any | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (map && target) {

      const latOffset = 0;
      const lngOffset = 0;

      const offset = {
        lat: target.lat + latOffset, 
        lng: target.lng + lngOffset
      };

      map.panTo(offset);
    }
  }, [map, target]);

  return null;
}