import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        b1: "#120E12",
        b2: "#120F12",
        c1: "#9B3C13",
        c2: "#9D251A",
        c3: "#9F171F",
        c4: "#662852",
        c5: "#2B1198"
      },
    },
  },
  plugins: [],
};
export default config;
