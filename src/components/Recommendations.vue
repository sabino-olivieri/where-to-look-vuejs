<template>
    <div class="carousel-container my-5 px-3" v-if="slides">
        <h2 class="">{{ title }}</h2>
        <swiper :modules="[Navigation, Autoplay, Virtual, EffectFade]" :breakpoints="{
            // mobile (default)
            320: {
                slidesPerView: 1.2,
                spaceBetween: 15
            },
            640: {
                slidesPerView: 2.2,

            },
            // tablet
            768: {
                slidesPerView: 3.2,

            },
            // desktop
            1024: {
                slidesPerView: 4.2,

            },

            1440: {
                slidesPerView: 6.2,

            }

        }" :virtual="true" :lazy="true" :watchSlidesProgress="true" :space-between="15" :loop="false"
            :navigation="true" :autoplay="{
                delay: 10000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true
            }" class="mySwiper rounded-3">

            <swiper-slide v-for="(slide, index) in slides.results" :key="index">
                <router-link :to="{ name: 'details', params: { id: `${slide.media_type}/${slide.id}` } }">
                    <div class="slide-content" @click="detailsCahnge(slide)">
                        <img :src="getImagePath(slide)" :alt="slide.title" class="slide-image rounded-3"
                            v-show="slideIndex[index]" @load="handleImageLoad(index)">

                        <div class="slide-image d-flex justify-content-center align-items-center"
                            v-if="!slideIndex[index]">
                            <Loader />
                        </div>

                        <div class="slide-caption rounded-bottom-3">
                            <h6 class="m-0">{{ slide.title ?? slide.name }}</h6>
                        </div>
                    </div>
                </router-link>
            </swiper-slide>
        </swiper>
    </div>
</template>

<script>
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Navigation, Pagination, Autoplay, Virtual, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';  // Importante: aggiungere questo import
import { store } from '../store';
import Loader from './Loader.vue';

export default {
    name: 'SwiperCarousel',
    components: {
        Swiper,
        SwiperSlide,
        Loader,
    },
    props: {
        title: String,
        slides: Object
    },
    data() {
        return {
            Navigation,  // Usa direttamente i moduli importati
            Pagination,
            Autoplay,
            Virtual,
            EffectFade,
            store,
            slideIndex: [],
        }
    },

    created() {
        if (this.slides) {
            this.slides.results.forEach(element => {
                this.slideIndex.push(false);
            });
        }

    },

    methods: {

        detailsCahnge(slide) {

            store.italianDetails = slide;
            store.details = null;
        },
        getImagePath(img) {
            if (img.backdrop_path) {

                return new URL("https://image.tmdb.org/t/p/w342" + img.backdrop_path, import.meta.url).href;

            } else if (img.poster_path) {

                return new URL("https://image.tmdb.org/t/p/w342" + img.poster_path, import.meta.url).href;

            } else {


                return `https://placehold.co/600x400?text=${img.title}`;
            }
        },
        handleImageLoad(index) {
            this.slideIndex[index] = true;
        }

    }
}
</script>

<style lang="scss" scoped>
.carousel-container {
    width: 100%;
    margin: 0 auto;
    position: relative;
}



.slide-content {
    position: relative;
    transition: all 0.5s;

    &:hover {
        .slide-caption {
            height: auto;

            h6 {
                text-overflow: unset;
                white-space: unset;
            }
        }
    }
}

.slide-image {
    width: 100%;
    aspect-ratio: 16/9;
    object-fit: cover;
}

.slide-caption {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;

    transition: height 0.5s ease;
    background: rgba(0, 0, 0, 0.838);
    color: white;
    padding: 10px;

    h6 {
        font-size: 18px;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
    }
}



.logos {

    width: 35px;
    aspect-ratio: 1/1;
}


:deep(.swiper-button-next),
:deep(.swiper-button-prev) {
    height: 100%;
    // opacity: 0;
    top: 0;
    margin: 0;
    justify-content: unset;
    // padding: 0 20px;
    color: white;
    // transition: opacity 0.3s ease;
}

:deep(.swiper-button-prev) {
    left: 0px;
    background: linear-gradient(90deg, rgba(0, 0, 0, 0.7316176470588236) 0%, rgba(0, 0, 0, 0) 100%);

    &::after {
        padding-left: 5px;
        font-size: 20px;

    }
}

:deep(.swiper-button-next) {
    right: 0px;
    background: linear-gradient(270deg, rgba(0, 0, 0, 0.7316176470588236) 0%, rgba(0, 0, 0, 0) 100%);

    &::after {
        padding-right: 5px;
        margin-left: auto;
        font-size: 20px;

    }
}
</style>