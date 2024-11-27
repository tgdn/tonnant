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
};

export const defaultTheme = {
  colors: {
    ...sharedColors,
    backgroundColor: "#ffffff",
    typography: "#000000",

    accent: sharedColors.blood,
  },
  // add any keys/functions/objects/arrays you want!
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
