import { createRouter, createWebHistory } from "vue-router";
import Project from "../views/Project.vue";
import Form from "../views/Form.vue";

import Home from "../views/Home.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: Home,
  },
  {
    path: "/project/:parameter/:projectNumber/:projectName",
    name: "project",
    component: Project,
    props: true,
  },
  {
    path: "/form/:parameter",
    name: "form",
    component: Form,
    props: true,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
