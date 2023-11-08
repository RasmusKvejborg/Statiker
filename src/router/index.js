import { createRouter, createWebHistory } from "vue-router";
import Project from "../views/Project.vue";

import Home from "../views/Home.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: Home,
  },
  {
    path: "/project/:parameter",
    name: "project",
    component: Project,
    props: true,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
