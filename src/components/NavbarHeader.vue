<template>
    <nav class="navbar navbar-expand-lg fixed-top" :class="{ 'navbar-scrolled': isScrolled || isMenuOpen }">
        <div class="container-fluid">
            <img src="../assets/wheretolook.png" class="logo" alt="">
            <i class="fa-solid fa-bars border border-2 p-2 rounded-2" type="button" 
                data-bs-toggle="collapse" data-bs-target="#navbarNav"
                aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation"
                @click="toggleMenu">
            </i>
            <div class="collapse navbar-collapse" id="navbarNav">
                <div class="d-lg-flex gap-3 w-100 justify-content-between py-2 py-lg-0">
                    <ul class="navbar-nav mb-3 mb-lg-0">
                        <li class="nav-item">
                            <router-link :to="{ name: 'home' }" class="nav-link active" aria-current="page">Home</router-link>
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

            console.log(this.isMenuOpen);
            // Chiudi il menu se si scorre la pagina
            if (this.isMenuOpen) {
                
                this.closeMenu();
            }
        },
        toggleMenu() {
            console.log(this.isMenuOpen);
            this.isMenuOpen = !this.isMenuOpen;
            console.log(this.isMenuOpen);
            
            // // Aggiorna manualmente la classe di Bootstrap per il collapse
            // const navbarCollapse = document.getElementById('navbarNav');
            // if (this.isMenuOpen) {
            //     navbarCollapse.classList.add('show');
            // } else {
            //     navbarCollapse.classList.remove('show');
            // }
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

</style>
