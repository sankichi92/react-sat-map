import type { MarkerProps } from "@vis.gl/react-maplibre";
import { Marker } from "@vis.gl/react-maplibre";
import { Marker as MarkerInstance, Popup } from "maplibre-gl";
import { useEffect, useMemo, useRef } from "react";
import { createPortal } from "react-dom";
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

export type SatelliteMarkerProps = Omit<
  MarkerProps,
  "longitude" | "latitude" | "popup"
> & {
  satellite: Satellite;
  date: Date;
  gmst?: GMSTime;
  defaultShowPopup?: boolean;
};

export function SatelliteMarker({
  satellite,
  date = new Date(),
  gmst = gstime(date),
  defaultShowPopup = false,
  subpixelPositioning = true,
  children = "🛰️",
  ...rest
}: SatelliteMarkerProps) {
  const markerRef = useRef<MarkerInstance>(null);

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

  const popupContainer = useMemo(() => document.createElement("div"), []);
  const popup = useMemo(
    () =>
      new Popup({
        anchor: "right",
        offset: 10,
        subpixelPositioning,
        className: "satmap:opacity-75",
      }),
    [subpixelPositioning],
  );

  useEffect(() => {
    popup.setDOMContent(popupContainer);
  }, [popup, popupContainer]);

  useEffect(() => {
    if (defaultShowPopup) {
      markerRef.current?.togglePopup();
    }
  }, []);

  return (
    <>
      <Marker
        longitude={longitude}
        latitude={latitude}
        popup={popup}
        subpixelPositioning={subpixelPositioning}
        className="satmap:cursor-pointer satmap:hover:text-lg"
        ref={markerRef}
        {...rest}
      >
        {children}
      </Marker>

      {createPortal(
        <>
          <h4 className="satmap:text-center satmap:m-0 satmap:mb-1 satmap:font-semibold">
            {satellite.name}
          </h4>
          <ul className="satmap:list-none satmap:m-0 satmap:p-0 satmap:font-mono">
            <li>lon: {longitude.toFixed(3)}</li>
            <li>lat: {latitude.toFixed(3)}</li>
            <li>alt: {location.height.toFixed(3)} km</li>
          </ul>
        </>,
        popupContainer,
      )}
    </>
  );
}
