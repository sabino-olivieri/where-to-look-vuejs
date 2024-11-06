<template>
    <div class="container-fluid mt-5 py-4">
        <div class="row g-3">
            <div class="col-12 col-sm-6 col-md-3 col-lg-2" v-for="result in results.results" :key="result" @click="italianDetailsChange(result)">
                <router-link :to="{name: 'details', params: {id: result.media_type+'/'+result.id }}">

                <img :src="getImagePath(result.poster_path)" class="poster rounded-3" alt="">
            </router-link>

            </div>
        </div>
    </div>
</template>

<script>
import CallApi from '../functions/CallApi';
import { store } from '../store';

export default {
    data() {
        return {
            title: '',
            results: []
        }
    },
    async created() {
        this.title = this.$route.query.title;

    },
    beforeUnmount() {
        this.result = [];
    },
    methods: {
        getImagePath(img) {
            return new URL("https://image.tmdb.org/t/p/w342" + img, import.meta.url).href;
        },
        async getResult() {
            this.results = await CallApi('https://api.themoviedb.org/3/search/multi', {}, {
                query: this.title,
                language: 'it-IT',
                api_key: import.meta.env.VITE_KEY_MOVIEDB
            });

            this.results.results.sort((a, b) => b.vote_average - a.vote_average);
            console.log(this.results.results);
            
        },
        italianDetailsChange(result) {
            store.italianDetails = result;
        }
    },
    watch: {
        '$route.query.title': {
            handler(newTitle) {
                this.title = newTitle;
                this.getResult(); // Richiama getResult quando cambia la query
            },
            immediate: true
        }
    },
}
</script>

<style lang="scss" scoped>
.poster {
    height: 100%;
    width: 100%;
    object-fit: cover;
}
</style>