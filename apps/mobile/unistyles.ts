import { UnistylesRegistry } from "react-native-unistyles";

const sharedColors = {
  barbie: "#ff9ff3",
  oak: "#1dd1a1",
  sky: "#48dbfb",
  fog: "#c8d6e5",
  aloes: "#00d2d3",
  blood: "#ff6b6b",
  purpleBlue: "#5E60FF",
  electricBlue: "#2f95dc",
  lightGray: "#f5f5f5",
  sonicSilver: "#777777",
  chineseSilver: "#cccccc",
  dark: "#333333",
  red: "rgb(255, 59, 48)",
};

const lightGrays = {
  systemGray: "rgb(142, 142, 147)",
  systemGray2: "rgb(174, 174, 178)",
  systemGray3: "rgb(199, 199, 204)",
  systemGray4: "rgb(209, 209, 214)",
  systemGray5: "rgb(229, 229, 234)",
  systemGray6: "rgb(242, 242, 247)",
};

const sharedSpacing = {
  s: 8,
  m: 16,
  l: 24,
  xl: 40,
};

const sharedFontSizes = {
  s: 12,
  m: 20,
  l: 24,
  xl: 40,
};

export const defaultTheme = {
  colors: {
    ...lightGrays,
    ...sharedColors,
    /** Used for the background color of the main container */
    backgroundColor: lightGrays.systemGray6,
    /** Used as the main text color */
    typography: "#000000",
    /** TODO: not used for now, remove? */
    accent: sharedColors.blood,
    /** Used for active elements such as the active tab bar */
    tint1: sharedColors.purpleBlue,
  },
  spacing: {
    ...sharedSpacing,
    screenGutter: sharedSpacing.m,
  },
  fontSizes: {
    ...sharedFontSizes,
  },
};

type AppThemes = {
  default: typeof defaultTheme;
};

declare module "react-native-unistyles" {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface UnistylesThemes extends AppThemes {}
}

UnistylesRegistry.addThemes({
  default: defaultTheme,
});
