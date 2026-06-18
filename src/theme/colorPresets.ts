export type ColorPalette = "green" | "indigo" | "rose";

export interface PaletteTokens {
  id: ColorPalette;
  labelKey: "green" | "indigo" | "rose";
  swatch: string;
  descriptionKey: "greenDesc" | "indigoDesc" | "roseDesc";
}

/** Accent presets from Core Intelligence DESIGN.md */
export const COLOR_PALETTES: PaletteTokens[] = [
  {
    id: "green",
    labelKey: "green",
    swatch: "#4edea3",
    descriptionKey: "greenDesc",
  },
  {
    id: "indigo",
    labelKey: "indigo",
    swatch: "#c0c1ff",
    descriptionKey: "indigoDesc",
  },
  {
    id: "rose",
    labelKey: "rose",
    swatch: "#ffb2b7",
    descriptionKey: "roseDesc",
  },
];

export const DEFAULT_PALETTE: ColorPalette = "green";
