import type { ReactNode } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { gstime } from "satellite.js";
import type { Satellite } from "./Satellite";
import { SatelliteMarker, SatelliteMarkerProps } from "./SatelliteMarker";

export type SatelliteMarkersProps = Omit<
  SatelliteMarkerProps,
  "satellite" | "date" | "gmst" | "children"
> & {
  satellites: Satellite[];
  markerElement?: ReactNode;
};

export function SatelliteMarkers({
  satellites,
  markerElement,
  ...rest
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
          {...rest}
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
