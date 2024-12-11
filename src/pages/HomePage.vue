<template>
  <!-- se la pagina non è pronta la nasconde -->
  <main :class="!store.isPageReady ? 'hidden-animation' : ''">

    <BigCarousel :slides="store.show" v-if="store.show.shows" class="animate" />
    <MovieCarousel title="Film" :slides="store.movies.shows" v-if="store.movies.shows" class="animate" />
    <MovieCarousel title="Serie TV" :slides="store.series.shows" v-if="store.series.shows" class="animate" />

  </main>

  <div class=" vh-100 d-flex justify-content-center align-items-center" v-if="!store.isPageReady && !store.show.shows">
    <Loader/>
  </div>
  

</template>

<script>
import BigCarousel from '../components/BigCarousel.vue';
import MovieCarousel from '../components/MovieCarousel.vue';
import CallApi from '../functions/CallApi';
import TransformObject from '../functions/TransformObject';
import { store } from '../store';
import AnimateOnScroll from '../functions/AnimateOnScroll';
import ScrollTop from '../functions/ScrollTop';
import Loader from '../components/Loader.vue';

export default {
  data() {
    return {
      store
    }
  },
  components: { BigCarousel, MovieCarousel, Loader },

  async created() {

    ScrollTop();

    // Parametri standard per streaming-availability
    const params = {
      'country': 'it',
      'order_by': 'popularity_1week',
    };

    // Se non ci sono già gli show fa la chiamata 
    if (!store.show.shows) {

      await this.CallStreamingAvailability(params, store.show);

    }

    // Se non ci sono già i film fa la chiamata 
    if (!store.movies.shows) {

      await this.CallStreamingAvailability({ ...params, 'show_type': 'movie' }, store.movies, 'movie');

    }

    // Se non ci sono già le serie fa la chiamata 
    if (!store.series.shows) {

      await this.CallStreamingAvailability({ ...params, 'show_type': 'series' }, store.series, 'tv');

    }

    // dopo aver fatto tutto la pagina è pronta 
    store.isPageReady = true;
  },
  watch: {
    // Quando isPageReady diventa true, chiama AnimateOnScroll
    'store.isPageReady': function (newValue) {
      if (newValue) {
        AnimateOnScroll();
      }
    }
  },

  methods: {
    async CallStreamingAvailability(params, storeArray, showType = 'all') {

      const resp = await CallApi('https://streaming-availability.p.rapidapi.com/shows/search/filters', store.header, params);

      if (resp && resp.shows) {
        // Aggiorna direttamente la proprietà shows di storeArray
        storeArray.shows = resp.shows;
      } // Se la chiamata ha avuto errori e quindi non ci sono gli shows fa la chiama di default a themoviedb
      else if (!storeArray.shows) {

        await this.CallDefault(showType, storeArray)

      }

    },

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
  beforeRouteLeave(to, from, next) {
    // prima di cambiare rotta nasconde la pagina per l'animazione
    store.isPageReady = false;
    setTimeout(() => {
      next();
    }, 500);
  },

}

</script>

<style lang="scss" scoped>
main {
  transition: transform 0.5s ease;
}
</style>