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
      map.panTo(target);
    }
  }, [map, target]);

  return null;
}