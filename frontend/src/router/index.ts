import { createRouter, createWebHistory } from "vue-router";
import Users from "../views/Users.vue";
import Requests from "../views/Requests.vue";

const routes = [
  { path: "/", redirect: "/requests" },
  { path: "/requests", component: Requests },
  { path: "/users", component: Users },
];

export default createRouter({
  history: createWebHistory(),
  routes,
});