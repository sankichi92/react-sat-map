import type { MarkerProps } from "@vis.gl/react-maplibre";
import { Marker, Popup } from "@vis.gl/react-maplibre";
import type { ReactNode } from "react";
import { useCallback, useMemo, useState } from "react";
import type { GMSTime } from "satellite.js";
import {
  degreesLat,
  degreesLong,
  eciToGeodetic,
  gstime,
  propagate,
  twoline2satrec,
} from "satellite.js";
import type { Satellite } from "./Satellite";

export type SatelliteMarkerProps = {
  satellite: Satellite;
  date: Date;
  gmst?: GMSTime;
  children?: ReactNode;
};

export function SatelliteMarker({
  satellite,
  date = new Date(),
  gmst = gstime(date),
  children = "🛰️",
}: SatelliteMarkerProps) {
  const [showPopup, setShowPopup] = useState(false);

  const onSatClick: NonNullable<MarkerProps["onClick"]> = useCallback((e) => {
    e.originalEvent.stopPropagation();
    setShowPopup(true);
  }, []);

  const satrec = useMemo(() => {
    return twoline2satrec(satellite.tle.line1, satellite.tle.line2);
  }, [satellite]);

  const { position } = propagate(satrec, date);
  if (typeof position === "boolean") {
    throw new Error(
      `Propagation failed for ${satellite.name} (${satrec.error})`,
    );
  }

  const location = eciToGeodetic(position, gmst);
  const longitude = degreesLong(location.longitude);
  const latitude = degreesLat(location.latitude);

  return (
    <>
      <Marker
        longitude={longitude}
        latitude={latitude}
        subpixelPositioning={true}
        onClick={onSatClick}
        className="satmap:cursor-pointer satmap:hover:text-lg"
      >
        {children}
      </Marker>

      {showPopup && (
        <Popup
          longitude={longitude}
          latitude={latitude}
          offset={[-10, 0]}
          anchor="right"
          subpixelPositioning={true}
          onClose={() => setShowPopup(false)}
        >
          <h4 className="satmap:text-center satmap:m-0 satmap:mb-1 satmap:font-semibold">
            {satellite.name}
          </h4>
          <ul className="satmap:list-none satmap:m-0 satmap:p-0 satmap:font-mono">
            <li>lon: {longitude.toFixed(3)}</li>
            <li>lat: {latitude.toFixed(3)}</li>
            <li>alt: {location.height.toFixed(3)} km</li>
          </ul>
        </Popup>
      )}
    </>
  );
}
