import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [tailwindcss()],
  worker: {
    format: "es",
  },
  build: {
    lib: {
      entry: "./lib/main.ts",
      formats: ["es"],
      name: "react-sat-map",
    },
    rollupOptions: {
      external: ["react", "react-dom", "@vis.gl/react-maplibre"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          "@vis.gl/react-maplibre": "ReactMapLibre",
        },
      },
    },
  },
});
