import type { ReactNode } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { gstime } from "satellite.js";
import type { Satellite } from "./Satellite";
import { SatelliteMarker } from "./SatelliteMarker";

export type SatelliteMarkersProps = {
  satellites: Satellite[];
  markerElement?: ReactNode;
  openPopupOnMount?: boolean;
};

export function SatelliteMarkers({
  satellites,
  markerElement,
  openPopupOnMount,
}: SatelliteMarkersProps) {
  const [date, setDate] = useState<Date>(new Date(performance.timeOrigin));

  const updateDate = useCallback((timestamp: DOMHighResTimeStamp) => {
    setDate(new Date(performance.timeOrigin + timestamp));
  }, []);
  useAnimationFrame(updateDate);

  const gmst = gstime(date);

  return (
    <>
      {satellites.map((satellite, i) => (
        <SatelliteMarker
          key={i}
          satellite={satellite}
          date={date}
          gmst={gmst}
          openPopupOnMount={openPopupOnMount}
        >
          {markerElement}
        </SatelliteMarker>
      ))}
    </>
  );
}

// https://bom-shibuya.hatenablog.com/entry/2020/10/27/182226
const useAnimationFrame = (
  callback: (timestamp: DOMHighResTimeStamp) => void,
) => {
  const reqIdRef = useRef<number>(null);

  const animate = useCallback(
    (timestamp: DOMHighResTimeStamp) => {
      reqIdRef.current = requestAnimationFrame(animate);
      callback(timestamp);
    },
    [callback],
  );

  useEffect(() => {
    reqIdRef.current = requestAnimationFrame(animate);
    return () => {
      if (reqIdRef.current) {
        cancelAnimationFrame(reqIdRef.current);
      }
    };
  }, [animate]);
};
