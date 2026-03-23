import type { ComponentType } from "react";

export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  priceLabel?: string;
  category: string;
  spicy?: 1 | 2 | 3;
  note?: string;
  favorite?: boolean;
  vegan?: boolean;
  vegetarian?: boolean;
}

export interface MenuCategory {
  name: string;
  items: MenuItem[];
}

export interface StaffMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  greeting: string;
  orderResponses: string[];
  waitingLines: string[];
  servingLines: string[];
}

export interface LocationTheme {
  /** CSS custom properties for this location */
  colors: Record<string, string>;
  /** Primary background for the body */
  bodyBackground: string;
  /** Primary text color */
  textColor: string;
}

export interface LocationConfig {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  address: string;
  phone: string;
  logo: string;         // path in /public
  logoCircle?: string;  // path in /public
  theme: LocationTheme;
  /** The scene component (walls, table, etc.) */
  Scene: ComponentType<SceneProps>;
  /** Optional easter egg components */
  easterEggs?: ComponentType<EasterEggProps>[];
  /** Optional intro/entry screen shown before the lobby */
  Intro?: ComponentType<{ onEnter: () => void }>;
}

export interface SceneProps {
  participants: Array<{
    id: string;
    name: string;
    videoTrack?: MediaStreamTrack | null;
    audioTrack?: MediaStreamTrack | null;
    isSelf?: boolean;
    orderedFood?: string | null;
  }>;
  menuOpen: boolean;
  onOpenMenu?: () => void;
}

export interface EasterEggProps {
  onDiscover?: (id: string) => void;
}
