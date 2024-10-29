<template>
    <main  v-if="store.details">
        
        <hero class="hero position-relative">

            <div class="ms_img">
                <img :src="store.details.imageSet.horizontalPoster.w720" alt="" class=" img-fluid">
            </div>

            <div class="ms_title p-3">
                <h1 class="m-0">{{ store.italianDetails.title ?? store.italianDetails.name}}</h1>
            </div>

        </hero>

        <!-- descrizione -->
        <div class="container my-3" v-if="store.italianDetails.overview != ''">

            <p>{{ store.italianDetails.overview }}</p>

        </div>

        <div class="container my-3 rounded-3 border border-2 border-warning">
            <div class="row">

                <!-- subsctiption -->
                <div class="col-12 p-3 d-flex gap-3 align-items-center" v-if="subscription.length > 0">
                    <span class="label p-1 rounded-3 bg-warning">abbonamento</span>

                    <div class="logos rounded-3 p-1" v-for="stream in subscription" :key="stream" :style="{backgroundColor: stream.service.themeColorCode }">
                                    <img :src="stream.service.imageSet.whiteImage" class="" alt="">
    
                    </div>
                </div>

                <!-- buy -->
                <div class="col-12 p-3 d-flex gap-3 align-items-center" v-if="buy.length > 0">
                    <span class="label p-1 rounded-3 bg-warning">acquista</span>

                    <div class="logos rounded-3 p-1" v-for="stream in buy" :key="stream" :style="{backgroundColor: stream.service.themeColorCode }">
                                    <img :src="stream.service.imageSet.whiteImage" class="" alt="">
                                    <span class="price">{{ stream.quality }} {{ stream.price.amount }}€</span>
                    </div>
                </div>

                <!-- rent -->
                <div class="col-12 p-3 d-flex gap-3 align-items-center" v-if="rent.length > 0">
                    <span class="label p-1 rounded-3 bg-warning">noleggia</span>

                    <div class="logos rounded-3 p-1" v-for="stream in buy" :key="stream" :style="{backgroundColor: stream.service.themeColorCode }">
                                    <img :src="stream.service.imageSet.whiteImage" class="" alt="">
                                    <span class="price">{{ stream.quality }} {{ stream.price.amount }}€</span>
                    </div>
                </div>
            </div>
        </div>



    </main>



</template>

<script>
import CallApi from '../functions/CallApi';
import { store } from '../store';

export default {
    data() {
        return {
            store,
            subscription: [],
            rent: [],
            buy: [],


        }
    },
    async created() {

        const id = this.$route.params.id;
        console.log(id);



        if (!store.details) {
            // console.log('non esiste');

            // store.details = await CallApi(`https://streaming-availability.p.rapidapi.com/shows/${id}`, store.header, {
            //     country: 'it'
            // })            

        }

            // store.italianDetails = await CallApi(`https://api.themoviedb.org/3/${id}`, {}, {
            //     'api_key': '524981c982f2f9eac53799da92481683',
            //     'language': 'it-IT',
            // })

            // console.log(store.italianDetails);

            await store.details.streamingOptions.it.forEach(service => {
                switch (service.type) {
                    case "subscription":
                        this.pushSub(service);
                        break;
                
                    case "buy":
                        this.buy.push(service);
                        break;

                    case "rent":
                        this.rent.push(service);
                        break;

                    default:
                        break;
                }
            });
            
            
    },
    beforeUnmount() {
        store.details = null;
        console.log(store.details);
        this.subscription = [];
        this.rent = [];
        this.buy = [];

    },
    methods: {
        pushSub(service) {
            const exsist = this.subscription.some(obj => obj.id === service.id);

            if(!exsist) {
                this.subscription.push(service);
            }
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

.label {
    display: inline-block;
    writing-mode:vertical-lr;
    transform: rotate(180deg);
    font-weight: 700;
    text-transform: uppercase;
    // font-size: 14px;
    color: #1f1f1f;
}

.logos {
    width: 80px;
    aspect-ratio: 1/1;

    img {
        width: 100%;
        height: 100%;
        object-fit: contain;
    }

    .price {
        font-size: 10px;
    }
}

@media screen {}
</style>