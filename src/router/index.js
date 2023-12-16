import { createRouter, createWebHistory } from "vue-router";
import Project from "../views/Project.vue";
import Form from "../views/Form.vue";
import ProjectOverview from "../views/ProjectOverview.vue";
import Register from "../views/Register.vue";
import Login from "../views/Login.vue";

import Home from "../views/Home.vue";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const routes = [
  {
    path: "/",
    name: "home",
    component: Home,
    props: (route) => ({ userId: route.params.userId }),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/project/:parameter/:projectNumber/:projectName",
    name: "project",
    component: Project,
    props: true,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/projectOverview/:parameter/:projectNumber/:projectName",
    name: "projectOverview",
    component: ProjectOverview,
    props: true,
    meta: {
      requiresAuth: true,
    },
  },

  {
    path: "/form/:parameter",
    name: "form",
    component: Form,
    props: true,
  },
  {
    path: "/register",
    name: "register",
    component: Register,
  },
  {
    path: "/login",
    name: "login",
    component: Login,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const removeListener = onAuthStateChanged(
      getAuth(),
      (user) => {
        removeListener();
        resolve(user);
      },
      reject
    );
  });
};

router.beforeEach(async (to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (await getCurrentUser()) {
      next();
    } else {
      // alert("Log ind for at få adgang til denne side");
      next("/login");
    }
  } else {
    next();
  }
});

export default router;
