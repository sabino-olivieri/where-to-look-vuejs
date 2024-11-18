import {createRouter, createWebHistory} from "vue-router";
import HomePage from './pages/HomePage.vue';
import DetailsPage from "./pages/DetailsPage.vue";
import SearchPage from "./pages/SearchPage.vue";
import ErrorPage from "./pages/ErrorPage.vue";

export const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: "/", 
            name: "home",
            component: HomePage 
        },
        {
            path: "/details/:id",
            name: "details",
            component: DetailsPage
        },
        {
            path: "/search",
            name: "search",
            component: SearchPage
        },
        {
            path: "/:pathMatch(.*)*", 
            name: "errorPage",    
            component: ErrorPage
        }

    ]
});