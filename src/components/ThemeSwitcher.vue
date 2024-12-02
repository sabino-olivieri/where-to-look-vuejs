<template>
    <div class="theme-switcher" :style="{ backgroundColor: currentTheme === 'dark' ? '#ffc107' : '#1f1f1f' }"
        @click="toggleTheme">
        <i :class="currentTheme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon'"
            :style="{ color: currentTheme === 'dark' ? '#1f1f1f' : '#f2f2f2' }"></i>
    </div>
</template>

<script>
export default {
    data() {
        return {
            currentTheme: this.getInitialTheme(),
        };
    },
    methods: {
        getInitialTheme() {
            // Controlla prima il localStorage
            const savedTheme = localStorage.getItem('theme');
            if (savedTheme) return savedTheme;

            // Altrimenti usa la preferenza del browser
            return window.matchMedia('(prefers-color-scheme: dark)').matches
                ? 'dark'
                : 'light';
        },
        toggleTheme() {
            // Cambia il tema
            this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
            
            // Salva nel localStorage
            localStorage.setItem('theme', this.currentTheme);

            // Imposta l'attributo sul documento
            document.documentElement.setAttribute('data-theme', this.currentTheme);
        },
    },
    mounted() {
        // Imposta il tema iniziale
        document.documentElement.setAttribute('data-theme', this.currentTheme);
    },
};
</script>

<style scoped>
.theme-switcher {
    position: fixed;
    bottom: 10px;
    left: 10px;
    width: 38px;
    height: 38px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.3s ease;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.theme-switcher:hover {
    transform: scale(1.1);
}
</style>