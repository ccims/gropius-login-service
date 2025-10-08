// Composables
import { RouteRecordRaw, createRouter, createWebHistory } from "vue-router";
import { requiresAuth } from "./navigationGuards";

const routes: RouteRecordRaw[] = [
    {
        path: "/login",
        name: "login",
        component: () => import("../views/Login.vue")
    },
    {
        path: "/prompt",
        name: "prompt",
        component: () => import("../views/Prompt.vue")
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
        path: "/account",
        name: "account",
        beforeEnter: requiresAuth,
        component: () => import("../views/Account.vue")
    },
    {
        path: "/update",
        name: "update",
        beforeEnter: requiresAuth,
        component: () => import("../views/Update.vue")
    }
];

const router = createRouter({
    history: createWebHistory("/auth/flow"),
    routes
});

export default router;
