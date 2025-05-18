import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import PrimeVue from "primevue/config";
import StyleClass from "primevue/styleclass";
import { createPinia } from 'pinia';
import ToastService from 'primevue/toastservice';
import ConfirmationService from 'primevue/confirmationservice';

const app = createApp(App);
app.use(PrimeVue, { unstyled: true });
app.use(createPinia());
app.use(ToastService);
app.use(ConfirmationService);
app.directive("styleclass", StyleClass);
app.mount("#app");
