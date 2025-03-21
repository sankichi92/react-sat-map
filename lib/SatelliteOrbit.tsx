import type { LineLayerSpecification } from "@vis.gl/react-maplibre";
import { Layer, Source } from "@vis.gl/react-maplibre";
import type { LineString } from "geojson";
import type { SatRec } from "satellite.js";
import {
  degreesLat,
  degreesLong,
  eciToGeodetic,
  gstime,
  propagate,
} from "satellite.js";

export type SatelliteOrbitProps = Omit<
  LineLayerSpecification,
  "id" | "type" | "source" | "source-layer"
> & {
  satrec: SatRec;
  startDate: Date;
  steps?: number;
};

export function SatelliteOrbit({
  satrec,
  startDate,
  steps = 360,
  ...rest
}: SatelliteOrbitProps) {
  const orbitMinutes = (2 * Math.PI) / satrec.no;
  const stepMilliseconds = (orbitMinutes / steps) * 60 * 1000;

  const initialLocation = getSatelliteLocation(satrec, startDate);
  if (!initialLocation) {
    return null;
  }

  const coordinates = [initialLocation];
  let [prevLongitude, _] = initialLocation;
  let meridianCrossings = 0;
  for (let i = 1; i < steps; i++) {
    const date = new Date(startDate.getTime() + i * stepMilliseconds);

    const location = getSatelliteLocation(satrec, date);
    if (!location) {
      break;
    }

    let [longitude, latitude] = location;
    if (longitude - prevLongitude > 180) {
      meridianCrossings -= 1;
    } else if (longitude - prevLongitude < -180) {
      meridianCrossings += 1;
    }
    prevLongitude = longitude;
    longitude += meridianCrossings * 360;

    coordinates.push([longitude, latitude]);
  }

  const geojson = {
    type: "LineString",
    coordinates,
  } satisfies LineString;

  return (
    <Source type="geojson" data={geojson}>
      <Layer type="line" {...rest} />
    </Source>
  );
}

function getSatelliteLocation(satrec: SatRec, date: Date) {
  const { position } = propagate(satrec, date);
  if (typeof position === "boolean") {
    return null;
  }

  const gmst = gstime(date);
  const location = eciToGeodetic(position, gmst);
  const longitude = degreesLong(location.longitude);
  const latitude = degreesLat(location.latitude);

  return [longitude, latitude];
}
