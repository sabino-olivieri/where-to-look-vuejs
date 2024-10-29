<template>
  <NavbarHeader />
  <router-view></router-view>

</template>

<script>
import NavbarHeader from './components/NavbarHeader.vue'
import CallApi from './functions/CallApi';
import { store } from './store';

  export default {
  components: { NavbarHeader },
    data() {
      return {

      }
    },

    async created() {
    
      const params = {
        'country' : 'it',
        'order_by': 'popularity_1week',
      };

      
      // const resp = await CallApi('https://streaming-availability.p.rapidapi.com/shows/search/filters', store.header, params);
      // console.log(resp);
      
      
    }

  }
</script>

<style lang="scss" scoped>

</style>