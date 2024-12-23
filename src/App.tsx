import {
  FullscreenControl,
  Map,
  NavigationControl,
  ScaleControl,
} from "react-map-gl/maplibre";
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
        longitude: 135,
        latitude: 35,
        zoom: 2,
      }}
      style={{ height: "100vh" }}
      mapStyle="https://tile.openstreetmap.jp/styles/maptiler-basic-en/style.json"
      touchPitch={false}
      dragRotate={false}
    >
      <NavigationControl showCompass={false} />
      <FullscreenControl />
      <ScaleControl />

      <SatelliteMarkers satellites={satellites} />
    </Map>
  );
}
