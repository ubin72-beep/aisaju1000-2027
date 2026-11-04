import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: { extend: { colors: { ink: "#101827", gold: "#C8A96B", cream: "#F5F1E8" }, fontFamily: { sans: ["Arial", "sans-serif"] } } },
  plugins: []
};
export default config;
