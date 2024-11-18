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
        "light-bg": "#FFFDFD",
        "dark-bg": "#212121",
        "light-text-primary": "#24252A",
        "light-text-secondary": "#2D1313",
        primary: "#DBC9FF",
        secondary: "#CEB4FF",
        "light-chats-bg": "#F6F1FF",
        "dark-chats-bg": "#1C1C1C",
        "light-chats-text": "#111827",
        "light-chats-unread": "#483769",
        "light-chat-top-bg": "#F0E8FF",
        "light-input-border": "#DAC8FF",
        "light-sender-bg": "#EDE4FF",
        "light-receiver-bg": "#C6ADF8",
        "dark-grey": "#9C9C9C",
        "light-grey": "#F4F5F6",
        purple: "#7388FC",
      },
      fontFamily: {
        sora: ["Sora", "sans-serif"],
        roboto: ["Roboto", "sans-serif"],
      },
    },
    screens: {
      desktop: "1200px",
      mobile: "700px",
      tablet: "870px",
    },
    gridTemplateColumns: {
      "16": "repeat(16, minmax(0, 1fr))",
    },
  },
  darkMode: "class",
  plugins: [],
};
export default config;
