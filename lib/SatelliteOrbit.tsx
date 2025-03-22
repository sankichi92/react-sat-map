import type { LineLayerSpecification } from "@vis.gl/react-maplibre";
import { Layer, Source } from "@vis.gl/react-maplibre";
import type { LineString } from "geojson";
import { useMemo, useRef } from "react";
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
  date: Date;
  steps?: number;
};

type SatelliteOrbitCache = {
  startDate: Date;
  stepMilliseconds: number;
  coordinates: [number, number][];
};

export function SatelliteOrbit({
  satrec,
  date,
  steps = 360,
  ...rest
}: SatelliteOrbitProps) {
  const cacheRef = useRef<SatelliteOrbitCache>(null);

  const stepMilliseconds = useMemo(() => {
    const orbitMinutes = (2 * Math.PI) / satrec.no;
    return (orbitMinutes / steps) * 60 * 1000;
  }, [satrec, steps]);

  const { startDate, coordinates } = getCachedCoordinates(
    cacheRef.current,
    date,
    stepMilliseconds,
  );

  if (coordinates.length === 0) {
    const initialLocation = getSatelliteLocation(satrec, startDate);
    if (!initialLocation) {
      return null;
    }
    coordinates.push(initialLocation);
  }

  const [lastLongitude, _] = coordinates[coordinates.length - 1];
  let meridianCrossings = Math.trunc(lastLongitude / 360);
  let prevLongitude = lastLongitude % 360;
  for (let i = coordinates.length; i < steps; i++) {
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

  cacheRef.current = {
    startDate,
    stepMilliseconds,
    coordinates,
  };

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

function getCachedCoordinates(
  cache: SatelliteOrbitCache | null,
  date: Date,
  stepMilliseconds: number,
) {
  if (cache && stepMilliseconds === cache.stepMilliseconds) {
    const timeDiff = date.getTime() - cache.startDate.getTime();
    const stepsToShift = Math.floor(timeDiff / stepMilliseconds);
    if (stepsToShift >= 0 && stepsToShift < cache.coordinates.length) {
      const startDate = new Date(
        cache.startDate.getTime() + stepsToShift * stepMilliseconds,
      );
      const coordinates = cache.coordinates.slice(stepsToShift);
      return { startDate, coordinates };
    }
  }
  return { startDate: date, coordinates: [] };
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

  return [longitude, latitude] as [number, number];
}
