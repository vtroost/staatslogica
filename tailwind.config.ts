import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    // Voeg hier eventuele andere mappen toe waar je Tailwind klassen gebruikt
  ],
  theme: {
    extend: {
      // Hier kun je je Tailwind thema uitbreiden (optioneel)
      // backgroundImage: {
      //   "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      //   "gradient-conic":
      //     "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      // },
    },
  },
  plugins: [
    // Hier kun je Tailwind plugins toevoegen (bijv. @tailwindcss/typography)
    require('@tailwindcss/typography'), // Voeg deze toe als je prose klassen gebruikt
  ],
};
export default config; 