<template>
    <div class="container p-0 my-3 rounded-3 border border-2 border-warning" id="seasons" :class="{ expanded: isExpanded }" :style="{maxHeight: `${maxH}px`}">
        
        <div class="accordion" id="accordionSeason">
            <div class="accordion-item border-1 border-top-0 border-start-0 border-end-0 border-warning" v-for="(season, index) in store.italianDetails.seasons" :key="index">
                <h2 class="accordion-header" @click="HandleClickSeason(store.italianDetails.id, season.season_number)">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                        :data-bs-target="'#collapseSeason' + index" aria-expanded="true"
                        :aria-controls="'collapseSeason' + index">
                        {{ season.name }}
                    </button>
                </h2>
                <div :id="'collapseSeason' + index" class="accordion-collapse collapse"
                    data-bs-parent="#accordionSeason">
                    <div class="accordion-body">
                        <div class="accordion" :id="'accordionEpisode' + index" v-if="store.season">
                            <div class="accordion-item" v-for="episode in store.season.episodes"
                                :key="episode.episode_number">
                                <h2 class="accordion-header">
                                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                                        :data-bs-target="'#collapseEpisode' + episode.episode_number"
                                        aria-expanded="true"
                                        :aria-controls="'collapseEpisode' + episode.episode_number">
                                        Episodio: {{ episode.episode_number }} - {{ episode.name }}
                                    </button>
                                </h2>   
                                <div :id="'collapseEpisode' + episode.episode_number"
                                    class="accordion-collapse collapse" :data-bs-parent="'#accordionEpisode' + index">
                                    <div class="accordion-body">
                                        {{ episode.overview != '' ? episode.overview : 'Nessuna descrizione disponibile' }}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="d-flex h-100 w-100 justify-content-center align-items-center text-black p-3" v-else>
                            <Loader />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- Bottone "Mostra Altro / Riduci" -->
        <button class="btn btn-warning toggle-button" @click="toggleContainer" v-if="hasMaxHeight">
            {{ isExpanded ? 'Riduci' : 'Mostra altro' }}
        </button>
    </div>
</template>

<script>
import CallApi from '../functions/CallApi';
import { store } from '../store';
import Loader from './Loader.vue';

export default {
    components: { Loader },
    data() {
        return {
            store,
            isExpanded: false,
            hasMaxHeight: false,
            maxH: 200,
            accordionH: 0,
            resizeObserver: null,
        };
    },
    methods: {
        async HandleClickSeason(id, numSeason) {
            if (!store.season) {
                this.isExpanded = true;
                store.season = await CallApi(`https://api.themoviedb.org/3/tv/${id}/season/${numSeason}`, {}, {
                    language: 'it-IT',
                    api_key: import.meta.env.VITE_KEY_MOVIEDB,
                });
            } else if (store.season.season_number !== numSeason) {
                store.season = null;
                this.isExpanded = true;
                store.season = await CallApi(`https://api.themoviedb.org/3/tv/${id}/season/${numSeason}`, {}, {
                    language: 'it-IT',
                    api_key: import.meta.env.VITE_KEY_MOVIEDB,
                });
            }
        },
        toggleContainer() {
            this.isExpanded = !this.isExpanded;

            if (!this.isExpanded) {
                
                // Chiude tutti gli accordion
                const accordions = document.querySelectorAll('.accordion-collapse');
                accordions.forEach(accordion => {
                    accordion.classList.remove('show');
                });

                const buttons = document.querySelectorAll('.accordion-button');
                buttons.forEach(accordion => {
                    accordion.classList.add('collapsed');
                });
                this.maxH = 200;
            } else {
                this.maxH = this.accordionH;
            }
        },
        observeAccordion() {
            const accordionElem = document.getElementById('accordionSeason');
            if (!accordionElem) return;

            this.resizeObserver = new ResizeObserver(entries => {
                for (const entry of entries) {
                    if (this.isExpanded) {
                        this.maxH = entry.contentRect.height;
                    }
                }
            });

            this.resizeObserver.observe(accordionElem);
        },
        stopObserving() {
            if (this.resizeObserver) {
                this.resizeObserver.disconnect();
            }
        },
    },
    mounted() {
        const seasonElem = document.getElementById('seasons');
        if (seasonElem.offsetHeight === 200) {
            this.hasMaxHeight = true;
        }

        const accordionElem = document.getElementById('accordionSeason');
        if (accordionElem) {
            this.accordionH = accordionElem.offsetHeight;
        }

        this.observeAccordion();
    },
    beforeUnmount() {
        this.stopObserving();
        store.season = null;
        this.isExpanded = false;
        this.hasMaxHeight = false;
    },
};
</script>

<style lang="scss" scoped>
.container {

    transition: all 0.5s ease;
    overflow: hidden;
    position: relative;


    .toggle-button {
        position: absolute;
        bottom: 10px;
        right: 10px;
        z-index: 10;
    }

    .accordion {
        --bs-accordion-bg: transparent;
        --bs-accordion-color: var(--color-body);
        --bs-accordion-btn-color: var(--color-body);

        .accordion-button {
            transition: all 0.5s ease;

            &::after {
                background-image: unset; 
                font: var(--fa-font-solid);
                content: '\f078';
            }

            &:focus {
                box-shadow: unset;
            }
        }
        .accordion-button:not(.collapsed) {
            background-color: var(--color-border);
            color: #1f1f1f;
            box-shadow: unset;
        }
    }
}
</style>
