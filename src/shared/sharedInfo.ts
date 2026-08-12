//Name: Keyboard key
export const units = {
  City: 1,
  Factory: 2,
  Port: 3,
  Silo: 5,
  SAM: 6,
  "Atom Bomb": 8,
  Hydro: 9,
  Warship: 7,
  MIRV: 0,
};
export type Unit = keyof typeof units;