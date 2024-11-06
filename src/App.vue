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



}
</script>

<style lang="scss" scoped></style>