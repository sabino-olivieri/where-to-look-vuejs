<template>
    <div class="carousel-container mb-4" v-if="slides.shows">
        <swiper :modules="[SwiperNavigation, SwiperPagination, SwiperAutoplay, SwiperEffectFade]" :slides-per-view="1"
            :space-between="30" :loop="true" :pagination="{ clickable: true }" :navigation="true" :lazy="true"
            @slideChangeTransitionEnd="handleSlideChange" :effect="'fade'" :fadeEffect="{ crossFade: true }"
            :speed="2000" :autoplay="{
                delay: 10000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true
            }" class="mySwiper">
            <swiper-slide v-for="(slide, index) in slides.shows" :key="index">
                <router-link :to="{ name: 'details', params: { id: slide.tmdbId } }">
                <div class="slide-content d-flex justify-content-center justify-content-md-end align-items-center" @click="detailsCahnge(slide)">
                    <div class="overlay">

                    </div>
                    <img :src="slide.imageSet.horizontalPoster.w1080" :alt="slide.title" class="slide-image" @load="handleImageLoad(index)" v-show="slideIndex[index]" >
                    <div class="slide-image d-flex align-items-center justify-content-center" v-if="!slideIndex[index]">
                        <Loader/>
                    </div>
                    <div class="slide-caption px-3 d-flex justify-content-between align-items-center">
                        <h3 :class="{ 'title-animation': activeIndex === index }">{{ slide.title }}</h3>

                        <div class="d-flex gap-2">

                            <div class="logos rounded-3 p-1" :class="{ 'title-animation': activeIndex === index }"
                                v-for="stream in slide.streamingOptions.it" :key="stream"
                                :style="{ backgroundColor: stream.service.themeColorCode }">
                                <img :src="stream.service.imageSet.whiteImage" class=" img-fluid" alt="">
                            </div>
                        </div>
                    </div>
                </div>
            </router-link>
            </swiper-slide>
        </swiper>
    </div>

    <div class="slide-image d-flex align-items-center justify-content-center w-100" v-else>
        <Loader />
    </div>
</template>

<script>
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
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
        slides: Object
    },
    data() {
        return {
            SwiperNavigation: Navigation,
            SwiperPagination: Pagination,
            SwiperAutoplay: Autoplay,
            SwiperEffectFade: EffectFade,
            store,
            activeIndex: 0,
            slideIndex: []
        }
    },
    methods: {
        handleSlideChange(swiper) {
            this.activeIndex = swiper.realIndex;
        },
        handleImageLoad(index) {
            this.slideIndex[index] = true;
        },
        detailsCahnge(slide) {
            store.details = slide;

        }
    },
    created() {
        
        if(this.slides.shows) {
            
            this.slides.shows.forEach(element => {
                this.slideIndex.push(false)
            });
        }
    }
}
</script>

<style lang="scss" scoped>
.overlay {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background: linear-gradient(-90deg, #1f1f1f00 40%, #1f1f1f 78%, rgba(31, 31, 31, 1) 100%);
}

.carousel-container {
    width: 100%;
    margin: 0 auto;
    position: relative;

    &:hover {

        :deep(.swiper-button-next),
        :deep(.swiper-button-prev) {
            opacity: 1;
            transition: opacity 0.3s ease;
        }
    }
}

.slide-content {
    position: relative;
}

.slide-image {
    width: 85%;
    aspect-ratio: 16/9;
    min-height: 500px;
    object-fit: cover;
}

.slide-caption {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: linear-gradient(0deg, #1f1f1f 15%, #1f1f1f00 100%);
    color: white;
    padding-bottom: 100px;
}

.slide-caption h3 {
    margin-bottom: 0;
    width: 40%;
    font-size: 24px;
    opacity: 0;
    transform: translateY(50px);

    &.title-animation {
        animation: slideUp 0.5s ease forwards;
    }
}

.logos {

    width: 50px;
    aspect-ratio: 1/1;
    opacity: 0;
    transform: translateY(50px);

    img {
        width: 100%;
        height: 100%;
        object-fit: contain;
    }

    &.title-animation {
        animation: slideUp 0.5s ease forwards;
    }

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
    opacity: 0;
    top: 0;
    margin: 0;
    padding: 0 20px;
    color: white;
    transition: opacity 0.3s ease;
}

:deep(.swiper-pagination-bullet) {
    background: white;
    transition: all 0.5s;
}

:deep(.swiper-pagination-bullet-active) {
    background: white;
    transform: scale(150%);
}


// @media screen and (min-width: 769px) {
//     :deep(.swiper-pagination) {
//         display: block;
//     }
// }


@media screen and (max-width: 768px) {
    .overlay {
    opacity: 0;
}


.slide-image {
    width: 100%;
    min-height: 350px;
}

:deep(.swiper-pagination) {
    display: none;
}

.slide-caption {
    padding-bottom: 30px;
}

.slide-caption h3 {
    width: 90%;
    text-shadow: 2px 2px 10px #1f1f1f,
    -2px -2px 10px #1f1f1f;
}

}
</style>