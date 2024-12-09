<template>
    <div class="container-fluid mt-5 py-4" :class="!store.isPageReady ? 'hidden-animation' : ''">
        <div class="row g-3" v-if="results && results.results && results.results.length > 0">
            <h5 class="mb-0">Risultati di ricerca per: <span class="badge text-bg-warning">{{ title }}</span></h5>
            <div class="col-12 col-md-6 col-lg-4 animate" v-for="result, index in results.results" :key="result"
                @click="italianDetailsChange(result)">

                <div class="ms_card ms_border h-100 rounded-3">
                    <div class="row h-100 g-0">
                        <div
                            class="col-5 col-sm-6 h-100 d-flex justify-content-center align-items-center overflow-hidden rounded-start-3">
                            <img :src="getImagePath(result.poster_path)" class="poster" alt=""
                                v-show="resultsIndex[index]" @load="resultsIndex[index] = true">
                            <Loader v-if="!resultsIndex[index]" />
                        </div>
                        <div class="col-7 col-sm-6 h-100">
                            <div class="card-body h-100 p-3 overflow-hidden">
                                <h5 class="mb-0">{{ result.title ?? result.name }}</h5>
                                <p class="border-bottom py-2 mb-4 ms_border">
                                    {{ result.release_date ? result.release_date.split('-')[0] : '' }}{{
                                        result.first_air_date ? result.first_air_date.split('-')[0] : '' }}
                                    {{ (result.release_date || result.first_air_date) && result.vote_average &&
                                        result.vote_average > 0 ? ' | '
                                        : '' }}
                                    {{ result.vote_average && result.vote_average > 0 ? +
                                        result.vote_average.toFixed(1) : '' }}</p>
                                <p class=" m-0 overflow-hidden text-small">{{ result.overview }}</p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

        </div>
        <div class="row m-2" v-else>
            <h2 class="text-center p-5 border border-1 rounded-3 ms_border mb-0">Nessun risultato utile per "{{
                title }}"</h2>
        </div>

        <div class="row justify-content-center align-items-center p-5" v-if="isLoading">
            <Loader />
        </div>
    </div>
</template>

<script>
import Loader from '../components/Loader.vue';
import CallApi from '../functions/CallApi';
import { store } from '../store';
import AnimateOnScroll from "../functions/AnimateOnScroll";

export default {
    components: { Loader },
    data() {
        return {
            title: '',
            results: [],
            resultsIndex: [],
            isLoading: true,
            store,
        }
    },


    beforeUnmount() {
        this.results = [];
    },
    beforeRouteLeave(to, from, next) {
        store.isPageReady = false;
        setTimeout(() => {
            next();
        },500);
    },

    methods: {
        getImagePath(img) {
            return new URL("https://image.tmdb.org/t/p/w342" + img, import.meta.url).href;
        },
        async getResult() {
            this.resultsIndex = [];
            this.results = [];
            this.isLoading = true;

            this.results = await CallApi('https://api.themoviedb.org/3/search/multi', {}, {
                query: this.title,
                language: 'it-IT',
                api_key: import.meta.env.VITE_KEY_MOVIEDB
            });

            this.results.results.sort((a, b) => b.popularity - a.popularity);
            const filteredResults = this.results.results.filter(result => {
                return result.backdrop_path || result.poster_path;
            });

            this.results.results = filteredResults;

            this.results.results.forEach(() => {
                this.resultsIndex.push(false);
            });

            this.isLoading = false;
        },
        italianDetailsChange(result) {
            
            store.isPageReady = false;

            setTimeout(() => {
                
                this.$router.push({
                    name: 'details',
                    params: { id: `${result.media_type}/${result.id}`}
                });
            }, 500);
            
        },

    },
    watch: {
        '$route.query.title': {
            async handler(newTitle) {
                this.title = this.$route.query.title;
                await this.getResult();
                AnimateOnScroll();
                store.isPageReady = true;
            },
            immediate: true
        }
    },
};
</script>


<style lang="scss" scoped>
.poster {
    height: 100%;
    width: 100%;
    object-fit: cover;
    object-position: top;
}

.container-fluid {
    transition: transform 0.5s ease;
}

.ms_card {
    max-height: 300px;
    background-color: var(--bg-card);
    transition: box-shadow 0.5s ease;
    cursor: pointer;

    img {
        transition: transform 0.5s ease;
    }

    &:hover {
        box-shadow: 2px 2px 0px var(--color-border);

        img {
            transform: scale(105%);
        }
    }

    .text-small {
        font-size: 14px;
        // height: 100px;
        display: -webkit-box;
        /* Per abilitare il line clamping */
        -webkit-box-orient: vertical;
        /* Imposta l'orientamento delle linee */
        -webkit-line-clamp: 5;
        /* Numero massimo di linee visibili */
        text-overflow: ellipsis;
        /* Mostra i puntini di sospensione */
    }
}
</style>