<template>
    <div class="carousel-container mb-4 px-3">
        <h2 class="">{{ title }}</h2>
        <swiper :modules="[Navigation, Autoplay, Virtual, EffectFade]" :breakpoints="{
            // mobile (default)
            320: {
                slidesPerView: 1,
                spaceBetween: 15
            },
            640: {
                slidesPerView: 2.5,

            },
            // tablet
            768: {
                slidesPerView: 3.5,

            },
            // desktop
            1024: {
                slidesPerView: 4.5,

            },

            1440: {
                slidesPerView: 6.5,

            }

        }" :virtual="true"  :lazy="true" :watchSlidesProgress="true" :space-between="15"
            :loop="false" :navigation="true" @slideChangeTransitionEnd="handleSlideChange" :autoplay="{
                delay: 10000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true
            }" class="mySwiper rounded-3">
            <swiper-slide v-for="(slide, index) in slides.shows" :key="index">
                <router-link :to="{name: 'details', params: {id: slide.tmdbId}}">
                <div class="slide-content" @click="detailsCahnge(slide)">
                    <img :src="slide.imageSet.horizontalPoster.w720" :alt="slide.title" class="slide-image rounded-3">
                    <div class="slide-caption rounded-3">
                        <h6 class="mb-3">{{ slide.title }}</h6>

                        <div class="d-flex gap-2">

                            <div class="logos d-flex align-items-center rounded-3 p-1" v-for="stream in slide.streamingOptions.it" :key="stream" :style="{backgroundColor: stream.service.themeColorCode }">
                                    <img :src="stream.service.imageSet.whiteImage" class=" img-fluid" alt="">
                            </div>
                        </div>
                    </div>
                </div>
            </router-link>
            </swiper-slide>
        </swiper>
    </div>
</template>

<script>
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Navigation, Pagination, Autoplay, Virtual, EffectFade  } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';  // Importante: aggiungere questo import
import { store } from '../store';

export default {
    name: 'SwiperCarousel',
    components: {
        Swiper,
        SwiperSlide,
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

        activeIndex: 0
    }
},

    methods: {
        handleSlideChange(swiper) {
            this.activeIndex = swiper.realIndex;
        },
        
        detailsCahnge(slide) {
            store.details = slide;
            console.log(store.details);
            
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
            animation: slideUp 0.5s ease forwards;
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
    opacity: 0;
    height: 100%;
    transform: translateY(50px);
    background: rgba(0, 0, 0, 0.597);
    color: white;
    padding: 10px;
    transition: all 0.5s ease;

    h6 {
        font-size: 18px;
    }
}



.logos {

    width: 35px;
    aspect-ratio: 1/1;
}

@keyframes slideUp {
    from {
        opacity: 0;
        transform: translateY(50px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
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