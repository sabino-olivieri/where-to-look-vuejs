<template>
  <NavbarHeader />

    <router-view></router-view>
  <ThemeSwitcher/>

</template>

<script>
import NavbarHeader from './components/NavbarHeader.vue'
import ThemeSwitcher from './components/ThemeSwitcher.vue'

export default {
  components: { NavbarHeader, ThemeSwitcher },
  data() {
    return {
      
    }
  },



}
</script>

<style lang="scss" scoped></style>