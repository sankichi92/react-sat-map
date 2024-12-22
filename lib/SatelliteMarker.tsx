import { useMemo } from "react";
import { Marker } from "react-map-gl/maplibre";
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

type SatelliteMarkerProps = {
  satellite: Satellite;
  date: Date;
  gmst?: GMSTime;
};

export function SatelliteMarker({
  satellite,
  date = new Date(),
  gmst = gstime(date),
}: SatelliteMarkerProps) {
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

  return (
    <Marker
      longitude={degreesLong(location.longitude)}
      latitude={degreesLat(location.latitude)}
      subpixelPositioning={true}
    >
      🛰️
    </Marker>
  );
}
