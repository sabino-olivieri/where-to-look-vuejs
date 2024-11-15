<template>
    <main v-if="store.details && store.italianDetails">

        <div class="hero d-flex justify-content-center align-items-center position-relative">

            <div class="overlay">

            </div>

            <div class="ms_img d-flex justify-content-center align-items-center">
                <img :src="getImagePath(store.italianDetails.backdrop_path)" alt="" class=" img-fluid">
            </div>

            <div class="ms_title p-3">
                <h1 class="m-0">{{ store.italianDetails.title ?? store.italianDetails.name }}</h1>
            </div>

        </div>

        <!-- descrizione -->
        <div class="container my-3" v-if="store.italianDetails.overview != ''">

            <p>{{ store.italianDetails.overview }}</p>

        </div>

        <div class="container">

            <div class="container my-3 rounded-3 border border-2 border-warning">
                <div v-if="exsist">

                    <!-- free -->
                    <ServicesView :title="'gratuito'" :arrStream="free" />

                    <!-- subsctiption -->
                    <ServicesView :title="'abbonamento'" :arrStream="subscription" />

                    <!-- buy -->
                    <ServicesView :title="'acquista'" :arrStream="buy" />

                    <!-- rent -->
                    <ServicesView :title="'noleggia'" :arrStream="rent" />
                </div>

                <h4 class="m-0 p-4 text-center" v-else>Nessun servizio disponibile</h4>
            </div>

            <Seasons v-if="store.italianDetails.seasons"/>

        </div>

        <Recommendations :title="'Suggeriti'" :slides="suggested" />



    </main>



</template>

<script>
import Recommendations from '../components/Recommendations.vue';
import Seasons from '../components/Seasons.vue';
import ServicesView from '../components/ServicesView.vue';
import CallApi from '../functions/CallApi';
import TransformObject from '../functions/TransformObject';
import { store } from '../store';

export default {
    components: { ServicesView, Recommendations, Seasons },
    data() {
        return {
            store,
            free: [],
            subscription: [],
            rent: [],
            buy: [],
            exsist: false,
            suggested: null


        }
    },
    created() {


        this.createPage()

    },

    beforeUnmount() {
        store.details = null;
        store.italianDetails = null;
        this.subscription = [];
        this.rent = [];
        this.buy = [];
        this.exsist = false;
        this.suggested = null;

    },
    methods: {
        getImagePath(img) {
            if (store.italianDetails.backdrop_path) {

                return new URL("https://image.tmdb.org/t/p/w1280" + img, import.meta.url).href;

            } else if (store.details.imageSet.horizontalPoster.w720) {

                return new URL(store.details.imageSet.horizontalPoster.w720, import.meta.url).href;

            } else {

                return `https://placehold.co/600x400?text=${img.title}`;
            }
        },
        pushSub(service) {
            const exsist = this.subscription.some(obj => obj.id === service.id);

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
        createServiceObject(service, additionalFields = {}) {
            return {
                service: {
                    id: service.provider_id,
                    imageSet: {
                        whiteImage: `https://image.tmdb.org/t/p/original${service.logo_path}`
                    },
                    name: service.provider_name
                },
                ...additionalFields
            };
        },
        async createPage() {
            const id = this.$route.params.id;



            // themoviedb
            if (!store.italianDetails) {

                store.italianDetails = await CallApi(`https://api.themoviedb.org/3/${id}`, {}, {
                    language: 'it-IT',
                    api_key: import.meta.env.VITE_KEY_MOVIEDB
                })


            }

            // movieofthenight
            if (!store.details) {

                store.details = await CallApi(`https://streaming-availability.p.rapidapi.com/shows/${id}`, store.header, {
                    country: 'it'
                })

                if (store.details.length === 0) {

                    store.details = await TransformObject(store.italianDetails);
                }

            }

            // inserire controllo se non esiste il contenuto
            if (store.details && store.details.streamingOptions.it) {

                await store.details.streamingOptions.it.forEach(service => {
                    switch (service.type) {

                        case "subscription":
                            this.pushSub(service);
                            this.exsist = true;
                            break;

                        case "buy":
                            this.buy.push(service);
                            this.exsist = true;
                            break;

                        case "rent":
                            this.rent.push(service);
                            this.exsist = true;
                            break;

                        default:
                            break;
                    }
                });
            }

            const stream = await CallApi(`https://api.themoviedb.org/3/${id}/watch/providers`, {}, {
                language: 'it-IT',
                api_key: import.meta.env.VITE_KEY_MOVIEDB
            })
            console.log(stream);
            


            const streamTypes = {
                ads: this.free,
                buy: this.buy,
                rent: this.rent,
                flatrate: this.subscription
            };

            Object.entries(streamTypes).forEach(([type, targetArray]) => {


                if (stream.results && stream.results.IT && stream.results.IT[type]) {

                    stream.results.IT[type].forEach(service => {
                        if (!this.isServiceInArray(service, targetArray)) {

                            const additionalFields = type === 'buy' || type === 'rent'
                                ? { type: "", quality: "", price: { amount: "" } }
                                : {};
                            this.exsist = true;
                            targetArray.push(this.createServiceObject(service, additionalFields));
                        }
                    });
                }
            });

            this.suggested = await CallApi(`https://api.themoviedb.org/3/${id}/recommendations`, {}, {
                language: 'it-IT',
                api_key: import.meta.env.VITE_KEY_MOVIEDB,

            })
        }

    },
    watch: {
        '$route.query': {
            handler(newQuery, oldQuery) {

                store.details = null;
                store.italianDetails = null;
                this.subscription = [];
                this.rent = [];
                this.buy = [];
                this.exsist = false;
                this.suggested = null;
                this.createPage();

            },
            deep: true,
            immediate: true,
        }
    },
}
</script>

<style lang="scss" scoped>
.overlay {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background: radial-gradient(circle, rgba(31, 31, 31, 0) 50%, rgba(31, 31, 31, 1) 68%, rgba(31, 31, 31, 1) 100%);
}

.ms_img {
    aspect-ratio: 16/5;
    overflow: hidden;
    min-height: 500px;
    max-width: 80%;

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

}

.ms_title {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: end;
    background: linear-gradient(180deg, rgba(0, 0, 0, 0) 50%, #1f1f1f 100%);
}

@media screen and (max-width: 768px) {
    .overlay {
        opacity: 0;
    }

    .ms_img {
        min-height: 350px;
        max-width: 100%;

    }
}
</style>