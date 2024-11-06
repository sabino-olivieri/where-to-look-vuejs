<template>
    <main v-if="store.details && store.italianDetails">

        <div class="hero position-relative">

            <div class="ms_img">
                <img :src="store.details.imageSet.horizontalPoster.w720" alt="" class=" img-fluid">
            </div>

            <div class="ms_title p-3">
                <h1 class="m-0">{{ store.italianDetails.title ?? store.italianDetails.name }}</h1>
            </div>

        </div>

        <!-- descrizione -->
        <div class="container my-3" v-if="store.italianDetails.overview != ''">

            <p>{{ store.italianDetails.overview }}</p>

        </div>

        <div class="container my-3 rounded-3 border border-2 border-warning">
            <div class="row" v-if="exsist">

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



    </main>



</template>

<script>
import ServicesView from '../components/ServicesView.vue';
import CallApi from '../functions/CallApi';
import { store } from '../store';

export default {
    components: { ServicesView },
    data() {
        return {
            store,
            free: [],
            subscription: [],
            rent: [],
            buy: [],
            exsist: false


        }
    },
    async created() {

        const id = this.$route.params.id;
        console.log(id);


        // movieofthenight
        if (!store.details) {

            store.details = await CallApi(`https://streaming-availability.p.rapidapi.com/shows/${id}`, store.header, {
                country: 'it'
            })

        }

        // themoviedb
        if (!store.italianDetails) {

            store.italianDetails = await CallApi(`https://api.themoviedb.org/3/${id}`, {}, {
                language: 'it-IT',
                api_key: import.meta.env.VITE_KEY_MOVIEDB
            })


        }

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

        const stream = await CallApi(`https://api.themoviedb.org/3/${id.split("/")[0]}/${store.italianDetails.id}/watch/providers`, {}, {
            language: 'it-IT',
            api_key: import.meta.env.VITE_KEY_MOVIEDB
        })

        
        const streamTypes = {
            ads: this.free,
            buy: this.buy,
            rent: this.rent,
            flatrate: this.subscription
        };

        Object.entries(streamTypes).forEach(([type, targetArray]) => {
            if (stream.results.IT && stream.results.IT[type]) {
                stream.results.IT[type].forEach(service => {
                    if (!this.isServiceInArray(service, targetArray)) {
                        const additionalFields = type === 'buy' || type === 'rent'
                            ? { type: "", quality: "", price: { amount: "" } }
                            : {};

                        targetArray.push(this.createServiceObject(service, additionalFields));
                    }
                });
            }
        });


    },
    beforeUnmount() {
        store.details = null;
        store.italianDetails = null;
        console.log(store.details);
        this.subscription = [];
        this.rent = [];
        this.buy = [];
        this.exsist = false;

    },
    methods: {
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
                    (name === 'Disney+' && providerName === 'Disney Plus')) {
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
                    }
                },
                ...additionalFields
            };
        }
    }
}
</script>

<style lang="scss" scoped>
.ms_img {
    aspect-ratio: 16/5;
    overflow: hidden;
    min-height: 250px;
    max-width: 100%;

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
</style>