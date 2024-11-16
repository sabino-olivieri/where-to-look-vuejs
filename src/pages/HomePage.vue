<template>

  <BigCarousel :slides="store.show" v-if="store.show.shows" />
  <MovieCarousel title="Film" :slides="store.movies"  v-if="store.movies.shows"/>
  <MovieCarousel title="Serie" :slides="store.series" v-if="store.series.shows"/>

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

    if (!store.show.shows) {

      const resp = await CallApi('https://streaming-availability.p.rapidapi.com/shows/search/filters', store.header, params);
      if(resp) {
        store.show = resp;
      } else if (!store.show.shows) {
        await this.CallDefault('all', store.show)
        
      }


    }

    if (!store.movies.shows) {

      const resp = await CallApi('https://streaming-availability.p.rapidapi.com/shows/search/filters', store.header, {
        'country': 'it',
        'order_by': 'popularity_1week',
        'show_type': 'movie'
      });

      if(resp) {
        store.movies = resp;
      } else if (!store.movies.shows) {
        await this.CallDefault('movie', store.movies)
        
      }
    }

    if (!store.series.shows) {

      const resp = await CallApi('https://streaming-availability.p.rapidapi.com/shows/search/filters', store.header, {
        'country': 'it',
        'order_by': 'popularity_1week',
        'show_type': 'series'
      });

      if(resp) {
        store.series = resp;
      } else if (!store.series.shows) {
        await this.CallDefault('tv',store.series)
        
      }

    }
  },
  methods: {
    async CallDefault(search, storeArray) {
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