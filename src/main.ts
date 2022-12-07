import { createApp } from "vue";

import App from "./App.vue";

import { registerPlugins } from "@/plugins";

// import "@mdi/font/css/materialdesignicons.css";
// import "vuetify/styles";
import "../src/style.css";
// import { createVuetify } from "vuetify";
// import * as components from "vuetify/components";
// import * as directives from "vuetify/directives";

// const vuetify = createVuetify({
//   components,
//   directives,
// });

// createApp(App).use(vuetify).mount("#app");
const app = createApp(App);

registerPlugins(app);

app.mount("#app");
