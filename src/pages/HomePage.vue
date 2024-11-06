<template>

        <BigCarousel v-if="store.show"/>
        <MovieCarousel title="Film" :slides="store.movies" v-if="store.movies"/>
        <MovieCarousel title="Serie" :slides="store.series" v-if="store.series"/>

</template>

<script>
import BigCarousel from '../components/BigCarousel.vue';
import MovieCarousel from '../components/MovieCarousel.vue';
import CallApi from '../functions/CallApi';
import { store } from '../store';

    export default {
      data() {
        return {
          store
        }
      },
  components: { BigCarousel, MovieCarousel },

  async created() {

const params = {
  'country': 'it',
  'order_by': 'popularity_1week',
};

if (!store.show) {

  store.show = await CallApi('https://streaming-availability.p.rapidapi.com/shows/search/filters', store.header, params);

}

if (!store.movies) {

  store.movies = await CallApi('https://streaming-availability.p.rapidapi.com/shows/search/filters', store.header, {
    'country': 'it',
    'order_by': 'popularity_1week',
    'show_type': 'movie'
  });
}

if (!store.series) {

  store.series = await CallApi('https://streaming-availability.p.rapidapi.com/shows/search/filters', store.header, {
    'country': 'it',
    'order_by': 'popularity_1week',
    'show_type': 'series'
  });

}
},
        
    }
    
</script>

<style lang="scss" scoped>

</style>