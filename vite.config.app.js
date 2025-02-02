import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [tailwindcss()],
  base: "/react-sat-map/",
  build: {
    outDir: "app",
  },
});
