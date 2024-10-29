<template>

        <BigCarousel/>
        <MovieCarousel title="Movie"/>
        <MovieCarousel title="Serie"/>

</template>

<script>
import BigCarousel from '../components/BigCarousel.vue';
import MovieCarousel from '../components/MovieCarousel.vue';

    export default {
  components: { BigCarousel, MovieCarousel },
        
    }
</script>

<style lang="scss" scoped>

</style>