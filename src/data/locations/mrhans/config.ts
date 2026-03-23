import type { LocationConfig } from "../types";
import MrHansScene from "./scene";
import PlaqueIntro from "./plaque";

const mrhans: LocationConfig = {
  id: "mrhans",
  name: "Mr. Han's",
  subtitle: "The Supper Club",
  description: "Proper attire essential. Third generation, since 1975.",
  address: "6944 NW 10th Place, Gainesville, FL",
  phone: "(352) 331-6400",
  logo: "/mrhans-logo.png",
  theme: {
    colors: {
      "--loc-primary": "#ed0606",
      "--loc-accent": "#c9a44a",
      "--loc-dark": "#0a0505",
      "--loc-surface": "#1a0a0a",
      "--loc-text": "#e8ddd0",
      "--loc-red": "#ed0606",
    },
    bodyBackground: "#0a0505",
    textColor: "#e8ddd0",
  },
  Scene: MrHansScene,
  Intro: PlaqueIntro,
};

export default mrhans;
