<template>
    <div class="search-container" :class="!isLarge ? 'hidden-container' : ''">
        <input type="text" v-model.trim="searchTerm" placeholder="Cerca..." class="search-input" :class="!isLarge ? 'hidden-input' : ''" @keypress.enter="submitSearch"  />
        <button @click="submitSearch" class="search-button">
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
    // transform: translateY(-50%);
    top: 12px;
    right: 55px;
    display: flex;
    align-items: center;
    background-color: transparent;
    border: 2px solid #f1f1f1;
    border-radius: 20px;
    // padding: 5px 12px;
    // padding-right: 0px;
    padding-left: 5px;
    max-width: 100%;
    transition: max-width 0.5s;
}

.search-input {
    border: none;
    outline: none;
    background-color: transparent;
    max-width: 250px;
    transition: max-width 0.5s;

    &::placeholder {
        color: #f1f1f1;
    }
}

.hidden-input {
    max-width: 0px;
}

.hidden-container {
    border: 0px;
    // padding: 0px;
    border: 2px solid transparent;
}
.search-button {
    background-color: rgb(255 193 7);
    border: none;
    border-radius: 50%;
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
</style>