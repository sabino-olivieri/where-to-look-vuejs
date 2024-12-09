<template>
    <div class="search-container" :class="!isLarge ? 'hidden-container' : ''">
        <input type="text" v-model.trim="searchTerm" placeholder="Cerca un titolo" class="search-input" :class="!isLarge ? 'hidden-input' : 'p-1 ps-2'" @keypress.enter="submitSearch"  />
        <button @click="submitSearch" class="search-button bg-ms_warning">
            <i class="fas fa-search"></i>
        </button>
    </div>
</template>

<script>
export default {
    data() {
        return {
            searchTerm: '',
            isLarge: false
        };
    },
    methods: {
        submitSearch() {
            if(this.searchTerm.length > 2) {

                this.$emit('search');
                this.$router.push({
                    name: 'search',
                    query: {title: this.searchTerm}
                })
                this.searchTerm = '';
                this.isLarge = false;
            } else if(this.searchTerm === '') {
                
                this.isLarge = !this.isLarge;
            }
        },
    },
};
</script>

<style lang="scss" scoped>
.search-container {
    position: absolute;
    transform: translateY(-50%);
    top: 33px;

    // top:50%;
    right: 55px;
    display: flex;
    align-items: center;
    background-color: transparent;
    backdrop-filter: blur(4px);

    border: 2px solid #f1f1f1;
    border-radius: 20px;
    max-width: 100%;
    transition: all 0.5s;
}

.search-input {
    border: none;
    outline: none;
    background-color: transparent;
    max-width: 250px;
    transition: all 0.5s;
    padding: 0;
    &::placeholder {
        color: #f1f1f1;
    }
}



.hidden-container {
    border: 0px;
    // padding: 0px;
    border: 2px solid transparent;
}
.search-button {
    border: none;
    border-radius: 50%;
    color: #1f1f1f;
    width: 38px;
    height: 38px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.search-button:hover {
    background-color: rgb(188, 141, 0);

}

.search-button i {
    font-size: 15px;
}

@media screen and (min-width: 992px) {
    .search-container {

    right: 12px;
}
}

@media screen and (max-width: 576px) {
    .search-input {
        max-width: calc(100vw - 180px);
    }
}

.hidden-input {
    max-width: 0px;
}
</style>