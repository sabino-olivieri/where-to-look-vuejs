<template>
    <iframe class="rounded-3" :src="'https://www.youtube.com/embed/'+video.key"
     frameborder="0"
     :title="video.name"
     allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
     allowfullscreen
     controls="1"></iframe>
</template>

<script>
import AnimateOnScroll from '../functions/AnimateOnScroll';

    export default {
        props: {
            video: Object
        },
        mounted() {
            AnimateOnScroll();
        }
    }
</script>

<style lang="scss" scoped>
    iframe {
        width: 100%;
        aspect-ratio: 16/9;
    }
</style>