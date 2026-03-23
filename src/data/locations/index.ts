import wahhaha from "./wahhaha/config";
import mrhans from "./mrhans/config";
import type { LocationConfig } from "./types";

export const locations: Record<string, LocationConfig> = {
  wahhaha,
  mrhans,
};

export const defaultLocationId = "wahhaha";

export function getLocation(id: string): LocationConfig {
  return locations[id] || locations[defaultLocationId];
}

export function getAllLocations(): LocationConfig[] {
  return Object.values(locations);
}

export type { LocationConfig, MenuItem, StaffMember, SceneProps, EasterEggProps } from "./types";
