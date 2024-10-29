<template>
    <nav class="navbar navbar-expand-lg fixed-top" :class="{ 'navbar-scrolled': isScrolled }">
        <div class="container-fluid">
            <a class="navbar-brand" href="#">Navbar</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
                aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <div class="d-flex w-100 justify-content-between">

                    <ul class="navbar-nav">
                        <li class="nav-item">
                            <a class="nav-link active" aria-current="page" href="#">Home</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#">Features</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#">Pricing</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link disabled" aria-disabled="true">Disabled</a>
                        </li>
                    </ul>
    
                    <SearchBar/>
                </div>
                
                </div>
        </div>
        
    </nav>
</template>

<script>
import SearchBar from './SearchBar.vue';
export default {
  components: { SearchBar },
    data() {
        return {
            isScrolled: false
        }
    },
    mounted() {
        window.addEventListener('scroll', this.handleScroll);
    },
    unmounted() {
        window.removeEventListener('scroll', this.handleScroll);
    },
    methods: {
        handleScroll() {
            this.isScrolled = window.scrollY > 0;
        }
    }
}
</script>

<style lang="scss" scoped>

</style>