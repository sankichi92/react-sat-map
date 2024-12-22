import React from "react";
import { Map } from "react-map-gl/maplibre";
import { SatelliteMarkers } from "../lib/main";

import "maplibre-gl/dist/maplibre-gl.css";
import "../lib/main.css";

const satellites = [
  {
    name: "YODAKA",
    tle: {
      line1:
        "1 62295U 98067XB  24356.80692813  .00138458  00000+0  20531-2 0  9992",
      line2:
        "2 62295  51.6364 105.6293 0012447   6.1035 354.0105 15.54174727  1956",
    },
  },
  {
    name: "ONGLAISAT",
    tle: {
      line1:
        "1 62299U 98067XF  24356.80956985  .00137277  00000+0  20793-2 0  9997",
      line2:
        "2 62299  51.6370 105.6484 0011002   0.4931 359.6068 15.53614663  1919",
    },
  },
];

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
