import { Map } from "react-map-gl/maplibre";
import { Satellite, SatelliteMarkers } from "../lib/main";

import "maplibre-gl/dist/maplibre-gl.css";
import "../lib/main.css";
import satellitesTxt from "./satellites.txt?raw";

const lines = satellitesTxt.trim().split("\n");
const satellites: Satellite[] = [];
for (let i = 0; i < lines.length; i += 3) {
  const [name, line1, line2] = lines.slice(i, i + 3);
  satellites.push({ name, tle: { line1, line2 } });
}

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
      <SatelliteMarkers satellites={satellites} />
    </Map>
  );
}
