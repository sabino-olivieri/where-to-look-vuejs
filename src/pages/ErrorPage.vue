<template>
    <main class="vh-100 p-2 d-flex align-items-center" :class="!store.isPageReady ? 'hidden-animation' : ''">
        <div class="container p-5 text-center rounded-3 border ms_border">
            <h1>Pagina non trovata</h1>
            <router-link :to="{name: 'home'}" class="btn btn-warning"><i class="fa-solid fa-house"></i> Home</router-link>
        </div>
    </main>
</template>

<script>
import { store } from '../store';

export default {
    data() {
        return {
            store
        }
    },

    mounted() {
        setTimeout(()=> {
            store.isPageReady = true        
        },100)
    },

    beforeRouteLeave(to, from, next) {

        store.isPageReady = false;

        setTimeout(() => {
            next();
        }, 500);
    },

}
</script>

<style lang="scss" scoped>
.vh-100 {
    transition: transform 0.5s ease;
}
</style>