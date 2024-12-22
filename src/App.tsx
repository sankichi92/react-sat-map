import { Map } from "react-map-gl/maplibre";

import "maplibre-gl/dist/maplibre-gl.css";

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
    />
  );
}
