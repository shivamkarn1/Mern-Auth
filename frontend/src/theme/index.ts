import { createSystem, defaultConfig } from "@chakra-ui/react";
import buttonTheme from "./buttonTheme.ts";
import linkTheme from "./linkTheme.ts";

const theme = createSystem(defaultConfig, {
  theme: {
    tokens: {
      colors: {
        theme: {
          primary: { value: "{colors.blue.500}" },
          primaryDark: { value: "{colors.blue.600}" },
          bg: { value: "#000000" },
          cardBg: { value: "#0a0a0a" },
        },
        text: {
          muted: { value: "{colors.gray.400}" },
        },
      },
    },
    recipes: {
      button: buttonTheme,
      link: linkTheme,
    },
  },
});

export default theme;
