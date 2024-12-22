import { Map } from "react-map-gl/maplibre";
import { SatelliteMarker } from "../lib/SatelliteMarker";

import "maplibre-gl/dist/maplibre-gl.css";

const satellite = {
  name: "YODAKA",
  tle: {
    line1:
      "1 62295U 98067XB  24356.80692813  .00138458  00000+0  20531-2 0  9992",
    line2:
      "2 62295  51.6364 105.6293 0012447   6.1035 354.0105 15.54174727  1956",
  },
};

export default function App() {
  return (
    <Map
      initialViewState={{
        longitude: 139.78881425,
        latitude: 35.637313872,
        zoom: 1.5,
      }}
      style={{ height: "100vh" }}
      mapStyle="https://tile.openstreetmap.jp/styles/maptiler-basic-ja/style.json"
    >
      <SatelliteMarker satellite={satellite} date={new Date()} />
    </Map>
  );
}
