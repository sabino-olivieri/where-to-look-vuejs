<template>
    <nav class="navbar navbar-expand-lg fixed-top" :class="{ 'navbar-scrolled': isScrolled || isMenuOpen }">
        <div class="container-fluid">
            <router-link :to="{ name: 'home' }">
                <img src="../assets/wheretolook.png" class="logo" alt="">
            </router-link>
            <!-- <div class="d-flex gap-2"> -->


            <span class="d-flex justify-content-center align-items-center border border-2 navbar-toggler d-lg-none" type="button"
                data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false"
                aria-label="Toggle navigation" @click="toggleMenu">
                <i class="fa-solid fa-bars">
                </i>
            </span>
            <div class="collapse navbar-collapse" id="navbarNav">
                <div class="d-lg-flex gap-3 w-100 justify-content-between py-2 py-lg-0">
                    <ul class="navbar-nav mb-3 mb-lg-0">
                        <li class="nav-item" @click="closeMenu()">
                            <router-link :to="{ name: 'home' }" class="nav-link active"
                                aria-current="page">Home</router-link>
                        </li>
                    </ul>
                </div>
            </div>
            <!-- </div> -->
        </div>
        <SearchBar @search="closeMenu" />
    </nav>
</template>

<script>
import SearchBar from './SearchBar.vue';
export default {
    components: { SearchBar },
    data() {
        return {
            isScrolled: false,
            isMenuOpen: false,
        };
    },
    mounted() {
        window.addEventListener('scroll', this.handleScroll);
    },
    beforeUnmount() {
        window.removeEventListener('scroll', this.handleScroll);

    },
    methods: {
        handleScroll() {
            this.isScrolled = window.scrollY > 0;

            // Chiudi il menu se si scorre la pagina
            if (this.isMenuOpen) {

                this.closeMenu();
            }
        },
        toggleMenu() {

            this.isMenuOpen = !this.isMenuOpen;
        },
        closeMenu() {
            this.isMenuOpen = false;

            // Rimuovi la classe di Bootstrap per chiudere il menu
            const navbarCollapse = document.getElementById('navbarNav');
            navbarCollapse.classList.remove('show');
        },
    },
};
</script>

<style lang="scss" scoped>
.logo {
    width: 50px;
    filter: drop-shadow(1px 1px 0px white);
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

.navbar-toggler {
    color: unset;
    width: 38px;
    height: 38px;
    // padding: 0px;
    border-radius: 50%;
}
</style>
