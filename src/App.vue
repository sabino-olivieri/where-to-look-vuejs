<template>
  <NavbarHeader />

    <!-- <router-view></router-view> -->
    <router-view v-slot="{ Component }">
      <transition name="slide" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>

</template>

<script>
import NavbarHeader from './components/NavbarHeader.vue'
import CallApi from './functions/CallApi';
import { store } from './store';

export default {
  components: { NavbarHeader },
  data() {
    return {
      store
    }
  },



}
</script>

<style lang="scss" scoped></style>