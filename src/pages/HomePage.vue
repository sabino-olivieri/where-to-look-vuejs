<template>

  <BigCarousel :slides="store.show" />
  <MovieCarousel title="Film" :slides="store.movies" />
  <MovieCarousel title="Serie" :slides="store.series" />

</template>

<script>
import BigCarousel from '../components/BigCarousel.vue';
import MovieCarousel from '../components/MovieCarousel.vue';
import CallApi from '../functions/CallApi';
import TransformObject from '../functions/TransformObject';
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


      if (store.show.length === 0) {
        await this.CallDefault('all',store.show)
        
      }


    }

    if (!store.movies) {

      store.movies = await CallApi('https://streaming-availability.p.rapidapi.com/shows/search/filters', store.header, {
        'country': 'it',
        'order_by': 'popularity_1week',
        'show_type': 'movie'
      });

      if (store.movies.length === 0) {
        await this.CallDefault('movie',store.movies)
        
      }
    }

    if (!store.series) {

      store.series = await CallApi('https://streaming-availability.p.rapidapi.com/shows/search/filters', store.header, {
        'country': 'it',
        'order_by': 'popularity_1week',
        'show_type': 'series'
      });

      if (store.series.length === 0) {
        await this.CallDefault('tv',store.series)
        
      }

    }
  },
  methods: {
    async CallDefault(search,storeArray) {
      const resp = await CallApi(`https://api.themoviedb.org/3/trending/${search}/week`, {}, {
    language: 'it-IT',
    api_key: import.meta.env.VITE_KEY_MOVIEDB
  });

  const array = await Promise.all(
    resp.results.map(async (elem) => {
      return await TransformObject(elem);
    })
  );

  storeArray.shows = array;
    }
  }

}

</script>

<style lang="scss" scoped></style>