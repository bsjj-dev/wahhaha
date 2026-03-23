import type { LocationConfig } from "../types";
import WahHaHaScene from "./scene";

const wahhaha: LocationConfig = {
  id: "wahhaha",
  name: "Wah Ha Ha",
  subtitle: "The Back Room",
  description: "Sunday night dinner at the roundtable, online.",
  address: "1902 SW 13th St, Gainesville, FL",
  phone: "(352) 363-6327",
  logo: "/logo.png",
  logoCircle: "/logo-circle.png",
  theme: {
    colors: {
      "--loc-primary": "#d4a843",
      "--loc-accent": "#dd3333",
      "--loc-dark": "#1a0f0a",
      "--loc-surface": "#3d2417",
      "--loc-text": "#f5e6c8",
      "--loc-green": "#4a8c3f",
    },
    bodyBackground: "#1a0f0a",
    textColor: "#f5e6c8",
  },
  Scene: WahHaHaScene,
};

export default wahhaha;
