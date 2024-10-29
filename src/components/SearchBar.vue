<template>
    <div class="search-container">
        <input type="text" v-model="searchTerm" placeholder="Cerca..." class="search-input" @keypress.enter="submitSearch" />
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
        };
    },
    methods: {
        submitSearch() {
            
            console.log('Searching for:', this.searchTerm);
            this.searchTerm = '';
        },
    },
};
</script>

<style lang="scss" scoped>
.search-container {
    display: flex;
    align-items: center;
    background-color: transparent;
    border: 2px solid #f1f1f1;
    border-radius: 20px;
    padding: 5px 12px;
}

.search-input {
    border: none;
    outline: none;
    background-color: transparent;

    &::placeholder {
        color: #f1f1f1;
    }
}

.search-button {
    background-color: #7b68ee;
    color: #fff;
    border: none;
    border-radius: 50%;
    width: 26px;
    height: 26px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.search-button:hover {
    background-color: #6a51d1;
}

.search-button i {
    font-size: 15px;
}
</style>