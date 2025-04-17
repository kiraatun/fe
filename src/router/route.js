import { createRouter, createWebHistory } from "vue-router";
import loginPage from "@/views/loginPage.vue";
import MockPopup from "@/views/MockPopup.vue";
import FormPswd from "@/views/FormPswd.vue";

const routes = [
  { path: '/login', component: loginPage},
  { path: '/mock', component: MockPopup},
  { path: '/pswd', component: FormPswd},
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
