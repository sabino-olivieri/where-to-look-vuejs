<template>
    <div class="carousel-container mb-4" >
        <swiper 
            :modules="[SwiperNavigation, SwiperPagination, SwiperAutoplay, SwiperEffectFade]" 
            :slides-per-view="1" 
            :space-between="30"
            :loop="true" 
            :pagination="{ clickable: true }" 
            :navigation="true" 
            @slideChangeTransitionEnd="handleSlideChange"
            :effect="'fade'"
            :fadeEffect="{ crossFade: true }"
            :speed="2000"
            :autoplay="{
                delay: 10000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true
            }" 
            class="mySwiper">
            <swiper-slide v-for="(slide, index) in slides.shows" :key="index">
                <div class="slide-content">
                    <img :src="slide.imageSet.horizontalPoster.w720" :alt="slide.title" class="slide-image">
                    <div class="slide-caption d-flex justify-content-between align-items-center">
                        <h3 :class="{ 'title-animation': activeIndex === index }">{{ slide.title }}</h3>

                        <div class="d-flex gap-2">

                            <div class="logos rounded-3 p-1" :class="{ 'title-animation': activeIndex === index }" v-for="stream in slide.streamingOptions.it" :key="stream" :style="{backgroundColor: stream.service.themeColorCode }">
                                    <img :src="stream.service.imageSet.whiteImage" class=" img-fluid" alt="">
                            </div>
                        </div>
                    </div>
                </div>
            </swiper-slide>
        </swiper>
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

export default {
    name: 'SwiperCarousel',
    components: {
        Swiper,
        SwiperSlide,
    },
    data() {
        return {
            SwiperNavigation: Navigation,
            SwiperPagination: Pagination,
            SwiperAutoplay: Autoplay,
            SwiperEffectFade: EffectFade,
            store,
            slides: store.show,
            activeIndex: 0
        }
    },
    methods: {
        handleSlideChange(swiper) {
            this.activeIndex = swiper.realIndex;
        }
    }
}
</script>

<style lang="scss" scoped>
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
    width: 100%;
    aspect-ratio: 16/5;
    min-height: 250px;
    object-fit: cover;
}

.slide-caption {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: linear-gradient(0deg, #1f1f1f 10%, rgba(0,0,0,0) 100%);
    color: white;
    padding: 20px 30PX;
}

.slide-caption h3 {
    margin: 0;
    font-size: 24px;
    opacity: 0;
    transform: translateY(50px);

    &.title-animation {
        animation: slideUp 0.5s ease forwards ;
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
        animation: slideUp 0.5s ease forwards ;
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
</style>