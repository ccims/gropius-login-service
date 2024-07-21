// Composables
import { RouteRecordRaw, createRouter, createWebHistory } from "vue-router";
import { checkAuth } from "./navigationGuards";

const routes: RouteRecordRaw[] = [
    {
        path: "/login",
        name: "login",
        component: () => import("../views/Login.vue")
    },
    {
        path: "/register-additional",
        name: "register-additional",
        component: () => import("../views/Login.vue")
    },
    {
        path: "/register",
        name: "register",
        component: () => import("../views/Register.vue")
    },
    {
        path: "/update",
        name: "update",
        beforeEnter: checkAuth,
        component: () => import("../views/Update.vue")
    }
];

const router = createRouter({
    history: createWebHistory("/auth/flow"),
    routes
});

export default router;
