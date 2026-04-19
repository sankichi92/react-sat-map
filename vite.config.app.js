import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [tailwindcss()],
  base: "/react-sat-map/",
  worker: {
    format: "es",
  },
  build: {
    outDir: "app",
  },
});
