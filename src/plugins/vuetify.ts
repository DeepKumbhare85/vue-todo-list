/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import "@mdi/font/css/materialdesignicons.css";
import "../main.scss";

import { createVuetify, ThemeDefinition } from "vuetify";
const myCustomDarkTheme: ThemeDefinition = {
  dark: true,
  colors: {
    background: "#b3b3B3",
    surface: "#FFFFFF",
    primary: "#6200EE",
    "primary-darken-1": "#3700B3",
    secondary: "#03DAC6",
    "secondary-darken-1": "#018786",
    error: "#B00020",
    info: "#2196F3",
    success: "#4CAF50",
    warning: "#FB8C00",
  },
};
const customDarkTheme: ThemeDefinition = {
  dark: true,
  colors: {
    background: "#2f3349",
    primary: "#7367f0",
    surface: "#1a1a1a",
    "primary-darken-1": "#3700B3",
    secondary: "#",
    "secondary-darken-1": "#018786",
    error: "#B00020",
    info: "##00CFE8",
    success: "#28c76f",
    warning: "##EA5455",
  },
};

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  theme: {
    defaultTheme: "myCustomDarkTheme",
    themes: {
      myCustomDarkTheme,
      customDarkTheme,
    },
  },
});
