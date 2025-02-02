import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [tailwindcss()],
  build: {
    lib: {
      entry: "./lib/main.ts",
      name: "react-sat-map",
    },
    rollupOptions: {
      external: ["react", "react-dom", "react-map-gl/maplibre"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          "react-map-gl/maplibre": "ReactMapLibre",
        },
      },
    },
  },
});
