<template>
    <div class="carousel-container mb-4 px-3" v-if="slides">
        <h2 class="carousel-title">{{ title }}</h2>
        <swiper ref="mySwiper" :modules="[Navigation, Autoplay, Virtual, EffectFade]" :breakpoints="{
            320: {
                slidesPerView: 1.1,
                slidesPerGroup: 1,
                spaceBetween: 15
            },
            640: {
                slidesPerView: 2.1,
                slidesPerGroup: 2
            },
            768: {
                slidesPerView: 3.1,
                slidesPerGroup: 3
            },
            1024: {
                slidesPerView: 4.1,
                slidesPerGroup: 4
            },
            1440: {
                slidesPerView: 6.1,
                slidesPerGroup: 6
            }
        }" :virtual="true" :lazy="true" :space-between="15" :loop="false" :navigation="true" :autoplay="{
            delay: 10000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true
        }" class="mySwiper py-5 rounded-3" @transitionEnd="changeFirstSlide()">
            <swiper-slide v-for="(slide, index) in newSlides ?? slides" :key="index" :class="'swiper-slide-' + title"
                :id="'movie' + index">

                    <div class="slide-content rounded-3" @click="detailsCahnge(slide)">
                        <img :src="getImagePath(slide)" :alt="slide.title"
                            class="slide-image rounded-3" v-show="slideIndex[index]" @load="handleImageLoad(index)">
                        <div class="slide-image d-flex justify-content-center align-items-center"
                            v-if="!slideIndex[index]">
                            <Loader />
                        </div>
                        <div class="slide-caption rounded-3">
                            <h6 class="mb-3">{{ slide.title ?? slide.name }}</h6>
                            <div class="d-flex gap-2" v-if="slide.streamingOptions">
                                <div class="logos d-flex align-items-center justify-content-center flex-column rounded-3 p-1"
                                    v-for="stream in slide.streamingOptions.it" :key="stream" 
                                    :style="{ backgroundColor: stream.service.themeColorCode }">
                                    
                                    <img :src="stream.service.imageSet.whiteImage" class="" alt="">
                                    <span class="addon" v-if="stream.type === 'addon'">Addon</span>

                                </div>
                            </div>
                        </div>
                    </div>

            </swiper-slide>
        </swiper>
    </div>
    <div class="my-5 py-4 d-flex justify-content-center align-items-center" v-else>
        <Loader />
    </div>
</template>

<script>
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Navigation, Pagination, Autoplay, Virtual, EffectFade } from 'swiper/modules';
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
        title: String,
        slides: Object
    },
    data() {
        return {
            Navigation,
            Pagination,
            Autoplay,
            Virtual,
            EffectFade,
            store,
            slideIndex: [],
            firstSlide: null,
            newSlides: null
            // activeFirstVisibleSlideIndex: 0,
            // swiperInstance: null
        }
    },
    created() {

        if(this.title === 'Suggeriti') {
            const newArray = this.slides.filter((slide)=> {
                return slide.backdrop_path;
            });

            if(newArray.length != this.slides.length) {
                this.newSlides = newArray;
            }
            
        }

        if (this.slides.shows) {
            this.slides.shows.forEach(() => {
                this.slideIndex.push(false)
            });
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.changeFirstSlide();
        });
    },
    methods: {
        detailsCahnge(slide) {
            if(this.title != 'Suggeriti') {
                store.details = slide;
            }

            store.isPageReady = false;            

            setTimeout(()=> {

            this.$router.push({
                name: 'details',
                params: {
                    id: slide.tmdbId ?? `${slide.media_type}/${slide.id}`
                }
            });
            },500)

        },
        handleImageLoad(index) {
            this.slideIndex[index] = true;
        },
        changeFirstSlide() {
            if (this.firstSlide) {

                this.firstSlide.classList.remove('first-visible-slide');
                this.firstSlide = null;
            }

            const firstSlideVisibleElem = document.querySelector(`.swiper-slide-${this.title.split(' ')[0]}.swiper-slide-visible`);

            if (firstSlideVisibleElem) {
                this.firstSlide = firstSlideVisibleElem;
                firstSlideVisibleElem.classList.add('first-visible-slide');

            }

        },

        getImagePath(slide) {
            if (slide.imageSet) {
                return new URL(slide.imageSet.horizontalPoster.w720, import.meta.url).href;
            } else if (slide.backdrop_path) {

                return new URL("https://image.tmdb.org/t/p/w342" + slide.backdrop_path, import.meta.url).href;

            } else if (slide.poster_path) {

                return new URL("https://image.tmdb.org/t/p/w342" + slide.poster_path, import.meta.url).href;

            } else {


                return `https://placehold.co/600x400?text=${slide.title}`;
            }
        }


    }
}

</script>


<style lang="scss" scoped>
.carousel-container {

    .carousel-title {
        margin-bottom: -20px;
    }
    
    width: 100%;
    margin: 0 auto;
    position: relative;
}


.carousel-container:has(.slide-content:hover) {
    .slide-content:not(:hover) {
        opacity: 0.5;
        filter: blur(1px);
    }

    .swiper-slide-visible.first-visible-slide .slide-content:hover {
        transform: translateX(30px) scale(120%);
        z-index: 9999;
    }

    .swiper-wrapper .swiper-slide-visible:last-of-type .slide-content:hover {
        transform: translateX(-30px) scale(120%);
        /* Aggiungi l'effetto hover */
        z-index: 9999;
    }
}


.swiper-slide-visible:hover {
    .slide-content {

        transform: scale(120%);
        z-index: 9999;

        .slide-caption {
            animation: slideUp 0.8s ease forwards;
        }
    }





}

.slide-content {
    position: relative;
    transition: all 0.5s;
    cursor: pointer;


    .slide-caption {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        opacity: 0;
        height: 100%;
        background: rgba(0, 0, 0, 0.597);
        color: white;
        padding: 10px;
        transition: all 5s ease;

        h6 {
            font-size: 18px;
        }
    }

    .addon {
        font-size: 6px;
    }
}



.slide-image {
    width: 100%;
    aspect-ratio: 16/9;
    object-fit: cover;
}



.logos {

    width: 35px;
    aspect-ratio: 1/1;

    img {
        width: 100%;
        object-fit: cover;
    }
}

@keyframes slideUp {
    from {
        opacity: 0;
        transform: translateY(40%);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

:deep(.swiper-button-next),
:deep(.swiper-button-prev) {
    height: calc(100% - 6rem);
    opacity: 0;
    overflow: hidden;
    width: 10px;
    top: 50%;
    margin: 0;
    transform: translateY(-50%);
    // padding: 0 20px;
    color: white;
    // transition: opacity 0.3s ease;
}

:deep(.swiper-button-prev) {
    left: 0px;

    &::after {
        padding-left: 5px;
        font-size: 10px;

    }
}

:deep(.swiper-button-next) {
    right: 0px;

    &::after {
        padding-right: 5px;
        margin-left: auto;
        font-size: 10px;

    }
}

@media screen and (max-width: 768px) {
    .carousel-container:has(.slide-content:hover) {


        .swiper-slide-visible.first-visible-slide .slide-content:hover {
            transform: translateX(15px) scale(108%);

        }

        .swiper-wrapper .swiper-slide-visible:last-of-type .slide-content:hover {
            transform: translateX(-15px) scale(108%);
            /* Aggiungi l'effetto hover */
        }
    }
}
</style>