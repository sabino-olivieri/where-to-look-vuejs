<template>

  <main :class="!store.isPageReady ? 'hidden-animation' : ''">

    <BigCarousel :slides="store.show" v-if="store.show.shows" class="animate" />
    <MovieCarousel title="Film" :slides="store.movies.shows" v-if="store.movies.shows" class="animate" />
    <MovieCarousel title="Serie TV" :slides="store.series.shows" v-if="store.series.shows" class="animate" />

  </main>

</template>

<script>
import BigCarousel from '../components/BigCarousel.vue';
import MovieCarousel from '../components/MovieCarousel.vue';
import CallApi from '../functions/CallApi';
import TransformObject from '../functions/TransformObject';
import { store } from '../store';
import AnimateOnScroll from '../functions/AnimateOnScroll';
import ScrollTop from '../functions/ScrollTop';

export default {
  data() {
    return {
      store
    }
  },
  components: { BigCarousel, MovieCarousel },

  async created() {

    ScrollTop();

    const params = {
      'country': 'it',
      'order_by': 'popularity_1week',
    };

    if (!store.show.shows) {

      const resp = await CallApi('https://streaming-availability.p.rapidapi.com/shows/search/filters', store.header, params);
      if (resp) {
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

      if (resp) {
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

      if (resp) {
        store.series = resp;
      } else if (!store.series.shows) {
        await this.CallDefault('tv', store.series)

      }

    }
  },

  methods: {
    async CallDefault(search, storeArray) {
      const resp = await CallApi(`https://api.themoviedb.org/3/trending/${search}/week`, {}, store.objPramsMovieDB);

      const array = await Promise.all(
        resp.results.map(async (elem) => {
          return await TransformObject(elem);
        })
      );

      storeArray.shows = array;

    }
  },
  mounted() {
    AnimateOnScroll();
    store.isPageReady = true;
  },
  beforeRouteLeave(to, from, next) {
        store.isPageReady = false;
        setTimeout(() => {
            next();
        },500);
    },

}

</script>

<style lang="scss" scoped>
main {
  transition: transform 0.5s ease;
}
</style>