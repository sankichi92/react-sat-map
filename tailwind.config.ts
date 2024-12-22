import type { Config } from "tailwindcss";

export default {
  corePlugins: {
    preflight: false,
  },
  prefix: "satmap-",
  content: ["./lib/**/*.{ts,tsx}"],
} satisfies Config;
