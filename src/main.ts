import { createApp } from "vue";
import { createPinia } from "pinia";
import Cookies from "js-cookie";
import { VueQueryPlugin, QueryClient } from "@tanstack/vue-query";

import App from "./App.vue";
import router from "./router";
import { i18n } from "./i18n";
import "./assets/main.css";
import "./assets/semantic.css";
import { useAuthStore } from "@/stores/auth.store";

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);
app.use(i18n);
app.use(VueQueryPlugin, {
  queryClient: new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
      },
    },
  }),
});

const authStore = useAuthStore(pinia);
if (Cookies.get("admin-token")) {
  authStore.fetchMe();
}

app.mount("#app");
