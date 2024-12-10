<template>
    <main :class="!store.isPageReady ? 'hidden-animation' : ''" v-if="store.details && store.italianDetails">

        <div
            class="hero d-flex justify-content-center justify-content-md-end align-items-center position-relative animate">


            <div class="ms_img d-flex justify-content-center align-items-center">
                <img :src="getImagePath(store.italianDetails.backdrop_path)" alt="" class=" img-fluid"
                    @load="isLoaded = true" v-show="isLoaded">
                <Loader v-if="!isLoaded" />
            </div>

            <div class="ms_title tx-white justify-content-lg-center justify-content-end p-3">
                <h1 class="m-0 mb-md-4">{{ store.italianDetails.title ?? store.italianDetails.name }}</h1>
                <div class="d-none d-md-flex gap-2 mb-3">
                    <button @click="scrollTo('service-container')"
                        class="btn btn-light rounded-3 fs-5 fw-semibold py-2 px-3">
                        <span> Dove guardare </span>
                    </button>

                    <button @click="scrollTo('details-container')"
                        class="btn btn-secondary rounded-3 fs-5 fw-semibold py-2 px-3">
                        <i class="fa-solid fa-circle-info"></i>
                        <span> Altre info </span>
                    </button>

                </div>
            </div>

        </div>

        <!-- descrizione -->
        <div class="container">

            <p class="my-3 animate " v-if="store.italianDetails.overview != ''">{{ store.italianDetails.overview }}</p>

            <div class="p-2 my-3 rounded-3 border border-2 ms_border animate" id="service-container">
                <div class="text-end" v-if="serviceExsist">

                    <!-- free -->
                    <ServicesView :title="'gratuito'" :arrStream="free" />

                    <!-- subsctiption -->
                    <ServicesView :title="'abbonamento'" :arrStream="subscription" />

                    <!-- buy -->
                    <ServicesView :title="'acquista'" :arrStream="buy" />

                    <!-- rent -->
                    <ServicesView :title="'noleggia'" :arrStream="rent" />

                    <span class=" align-content-end">Powered by JustWatch</span>
                </div>

                <h4 class="m-0 p-4 text-center" v-else>Nessun servizio disponibile</h4>
            </div>

            <Videos :video="video" v-if="video" class="animate" />

            <Seasons v-if="store.italianDetails.seasons" class="animate" />
        </div>

        <DetailsComponent :id="id" v-if="store.italianDetails && id" class="animate" />

        <MovieCarousel title="Suggeriti" :slides="suggested.results" v-if="suggested" class="animate" />



    </main>

    <div v-if="!store.isPageReady" class="d-flex justify-content-center align-items-center vh-100">
        <Loader />
    </div>



</template>

<script>
import DetailsComponent from '../components/DetailsComponent.vue';
import Loader from '../components/Loader.vue';
import MovieCarousel from '../components/MovieCarousel.vue';
import Seasons from '../components/Seasons.vue';
import ServicesView from '../components/ServicesView.vue';
import Videos from '../components/Videos.vue';
import AnimateOnScroll from '../functions/AnimateOnScroll';
import CallApi from '../functions/CallApi';
import ScrollTop from '../functions/ScrollTop';
import TransformObject from '../functions/TransformObject';
import { store } from '../store';

export default {
    components: { ServicesView, Seasons, Loader, DetailsComponent, Videos, MovieCarousel },
    data() {
        return {
            store,
            free: [],
            subscription: [],
            rent: [],
            buy: [],
            serviceExsist: false,
            suggested: null,
            isLoaded: false,
            id: null,
            video: null

        }
    },

    beforeUnmount() {
        store.details = null;
        store.italianDetails = null;
        this.resetArray()

    },
    beforeRouteLeave(to, from, next) {

        store.isPageReady = false;

        setTimeout(() => {
            next();
        }, 500);
    },
    methods: {
        getImagePath(img) {
            if (store.italianDetails.backdrop_path) {

                return new URL("https://image.tmdb.org/t/p/w1280" + img, import.meta.url).href;

            } else if (store.details.imageSet.horizontalPoster.w1080) {

                return new URL(store.details.imageSet.horizontalPoster.w1080, import.meta.url).href;

            } else {

                return `https://placehold.co/600x400?text=${img.title}`;
            }
        },
        pushSub(service) {
            // controllo se nell'array subscription ci sia un servizio con lo stesso id
            const exsist = this.subscription.some(obj => obj.id === service.id);

            // se non esiste già lo metto nell'array
            if (!exsist) {
                this.subscription.push(service);
            }
        },
        isServiceInArray(service, array) {

            return array.some((item) => {
                const { name } = item.service;
                const providerName = service.provider_name;

                if ((name === 'Prime Video' && (providerName === 'Amazon Video' || providerName === 'Amazon Prime Video')) ||
                    (name === 'Disney+' && providerName === 'Disney Plus') || (name === 'Now' && providerName === 'Now TV')) {
                    return true;
                }

                return name === providerName;
            });
        },
        createServiceObject(service) {
            return {
                service: {
                    id: service.provider_id,
                    imageSet: {
                        whiteImage: `https://image.tmdb.org/t/p/original${service.logo_path}`
                    },
                    name: service.provider_name
                },
            };
        },
        async callVideos(id) {
            const resp = await CallApi(`https://api.themoviedb.org/3/${id}/videos`, {}, store.objPramsMovieDB);
            if (resp && resp.results) {


                resp.results.some((element) => {
                    if (element.type === "Trailer") {
                        this.video = element;
                        return true;
                    } else {
                        return false;
                    }
                });

            }

        },
        async createPage() {
            const id = this.$route.params.id;
            this.id = id;


            // themoviedb
            if (!store.italianDetails) {

                store.italianDetails = await CallApi(`https://api.themoviedb.org/3/${id}`, {}, store.objPramsMovieDB);

            }

            // streaming-availability
            if (!store.details) {

                const resp = await CallApi(`https://streaming-availability.p.rapidapi.com/shows/${id}`, store.header, {
                    country: 'it'
                })
                if (resp) {
                    store.details = resp;
                }   // Se ho errore nella chiamata streaming-availability modifico la risposta di themoviedb
                else if (!store.details) {

                    store.details = await TransformObject(store.italianDetails);
                }

            }

            // smisto le opzioni di streaming di store.details negli array di appartenenza
            if (store.details && store.details.streamingOptions.it) {

                this.createServiceArray();

            }

            await this.addServiceMoviedb();

            await this.addSuggested();

            await this.callVideos(id);

            ScrollTop();

        },

        createServiceArray() {
            store.details.streamingOptions.it.forEach(service => {
                switch (service.type) {

                    case "subscription":
                        this.pushSub(service);
                        this.serviceExsist = true;
                        break;

                    case "buy":
                        this.buy.push(service);
                        this.serviceExsist = true;
                        break;

                    case "rent":
                        this.rent.push(service);
                        this.serviceExsist = true;
                        break;

                    default:
                        break;
                }
            });
        },

        async addServiceMoviedb() {
            const stream = await CallApi(`https://api.themoviedb.org/3/${this.id}/watch/providers`, {}, store.objPramsMovieDB)

            const streamTypes = {
                ads: this.free,
                buy: this.buy,
                rent: this.rent,
                flatrate: this.subscription
            };


            // restituisce un array di array composto da chiave + contenuto della chiave
            Object.entries(streamTypes).forEach(([type, targetArray]) => {

                // controllo se esite il tipo nella risposta di themoviedb
                if (stream.results && stream.results.IT && stream.results.IT[type]) {

                    // analizzo tutti i tipi della risposta
                    stream.results.IT[type].forEach(service => {

                        // controllo se il servizio è già presente nell'array di streaming-availability
                        if (!this.isServiceInArray(service, targetArray)) {

                            this.serviceExsist = true;
                            targetArray.push(this.createServiceObject(service));
                        }
                    });
                }
            });
        },

        async addSuggested() {
            this.suggested = await CallApi(`https://api.themoviedb.org/3/${this.id}/recommendations`, {}, store.objPramsMovieDB)
            if (this.suggested.results.length === 0) {
                this.suggested = null;
            }
        },

        scrollTo(whereScroll) {
            const element = document.querySelector(`#${whereScroll}`);
            const navbar = document.querySelector('.navbar');
            if (element) {
                const navbarHeight = navbar ? navbar.offsetHeight : 0;
                const elementPosition = element.getBoundingClientRect().top - 10;
                const scrollPosition = elementPosition - navbarHeight;
                window.scrollTo({ top: scrollPosition, behavior: 'smooth' });
            }
        },
        resetArray() {
            this.subscription = [];
            this.free = [];
            this.rent = [];
            this.buy = [];
            this.exsist = false;
            this.suggested = null;
            this.video = null;
        }

    },
    watch: {
        '$route.query': {
            async handler(newQuery, oldQuery) {
                store.isPageReady = false;

                const id = this.$route.params.id;
                const idMovieDB = id.split('/')[1];

                store.details = store.details && store.details.tmdbId && store.details.tmdbId != id ? null : store.details;
                store.italianDetails = store.italianDetails && store.italianDetails.id && store.italianDetails.id != idMovieDB ? null : store.italianDetails;

                this.resetArray();

                await this.createPage();

                if (!this.video) {

                    AnimateOnScroll();
                }
                store.isPageReady = true;

            },
            deep: true,
            immediate: true,
        }
    },
}
</script>

<style lang="scss" scoped>
.hero::after {
    content: '';
    position: absolute;
    z-index: 2;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background: linear-gradient(-90deg, rgba(31, 31, 31, 0) 40%, rgba(31, 31, 31, 1) 78%, rgba(31, 31, 31, 1) 100%);
}


.ms_img {
    aspect-ratio: 16/9;
    overflow: hidden;
    max-width: 85%;


    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

}

.ms_title {
    position: absolute;
    z-index: 3;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
    flex-direction: column;
    display: flex;
    // justify-content: center;
    background: linear-gradient(180deg, rgba(0, 0, 0, 0) 50%, #1f1f1f 100%);

    h1 {
        width: 40%;
        text-shadow: 2px 2px 10px #1f1f1f,
            -2px -2px 10px #1f1f1f;
    }
}

main {
    transition: all 0.5s ease;
}

@media screen and (max-width: 768px) {
    .hero::after {
        opacity: 0;
    }

    .ms_img {
        max-width: 100%;
    }

    .ms_title {

        h1 {
            width: auto;
        }
    }
}
</style>