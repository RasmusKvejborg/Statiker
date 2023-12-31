import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "./style.css";

import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import "@mdi/font/css/materialdesignicons.css";

const vuetify = createVuetify({
  components: {
    ...components,
  },
  directives,
});

createApp(App).use(router).use(vuetify).mount("#app");
