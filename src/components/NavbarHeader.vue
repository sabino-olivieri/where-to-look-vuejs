<template>
    <nav class="navbar navbar-expand-lg fixed-top" :class="{ 'navbar-scrolled': isScrolled }">
        <div class="container-fluid">
            <img src="../assets/wheretolook.png" class="logo" alt="">
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
                aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <div class="d-flex w-100 justify-content-between">

                    <ul class="navbar-nav">
                        <li class="nav-item">
                            <router-link :to="{ name: 'home' }" class="nav-link active" aria-current="page"
                                href="#">Home</router-link>
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

                    <SearchBar />
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
.logo {
    width: 50px;
    filter: drop-shadow(1px 1px 0px white)
}

.nav-item {
    position: relative;

    &::after {
        position: absolute;

        content: '';
        display: inline-block;
        width: 0%;
        height: 2px;
        background-color: yellow;
        transition: all 0.5s ease;
    }

    &:hover {
        &::after {
            width: 100%;
        }
    }

}
</style>