<template>
    <div class="container p-0 my-3 border rounded-3 border-2 ms_border">

        <div :style="{ maxHeight: `${maxH}px` }" id="seasons">

            <div class="accordion" id="accordionSeason">
                <div class="accordion-item border-0"
                    v-for="(season, index) in store.italianDetails.seasons" :key="index">
                    <div v-if="season.name != 'Speciali'">
                    <h2 class="accordion-header"
                        @click="HandleClickSeason(store.italianDetails.id, season.season_number)">
                        <button class="accordion-button collapsed main-accordion" :class="index < store.italianDetails.seasons.length - 1 ? ' border-bottom-2 border border-top-0 border-start-0 border-end-0 ms_border' : ''" type="button" data-bs-toggle="collapse"
                            :data-bs-target="'#collapseSeason' + index" aria-expanded="true"
                            :aria-controls="'collapseSeason' + index">
                            {{ season.name }}
                        </button>
                    </h2>
                    <div :id="'collapseSeason' + index" class="accordion-collapse collapse"
                        data-bs-parent="#accordionSeason">
                        <div class="accordion-body p-0 py-3">
                            <div class="accordion" :id="'accordionEpisode' + index" v-if="store.season">
                                <div class="accordion-item rounded-0 border-top-0 border-start-0 border-end-0" v-for="episode in store.season.episodes"
                                    :key="episode.episode_number">
                                    <h2 class="accordion-header">
                                        <button class="accordion-button rounded-0 collapsed" type="button"
                                            data-bs-toggle="collapse"
                                            :data-bs-target="'#collapseEpisode' + episode.episode_number"
                                            aria-expanded="true"
                                            :aria-controls="'collapseEpisode' + episode.episode_number">
                                            Episodio: {{ episode.episode_number }} - {{ episode.name }}
                                        </button>
                                    </h2>
                                    <div :id="'collapseEpisode' + episode.episode_number"
                                        class="accordion-collapse collapse"
                                        :data-bs-parent="'#accordionEpisode' + index">
                                        <div class="accordion-body">
                                            {{ episode.overview != '' ? episode.overview : 'Nessuna descrizione disponibile' }}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="d-flex h-100 w-100 justify-content-center align-items-center text-black p-3"
                                v-else>
                                <Loader />
                            </div>
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
            seasonTopPosition: null
        };
    },
    methods: {
        async HandleClickSeason(id, numSeason) {
            this.isExpanded = true;
            if (!store.season) {
                store.season = await CallApi(`https://api.themoviedb.org/3/tv/${id}/season/${numSeason}`, {}, store.objPramsMovieDB);
            } else if (store.season.season_number !== numSeason) {
                store.season = null;
                store.season = await CallApi(`https://api.themoviedb.org/3/tv/${id}/season/${numSeason}`, {}, store.objPramsMovieDB);
            }
        },
        toggleContainer() {
            this.isExpanded = !this.isExpanded;
            
            if (!this.isExpanded) {

                const seasonElem = document.querySelector('#seasons');                       
                this.seasonTopPosition = seasonElem.getBoundingClientRect().top + window.scrollY - 100;

                window.scrollTo({
                    top: this.seasonTopPosition,
                    behavoir: 'smooth'
                })

                // Chiude tutti gli accordion
                setTimeout(()=> {
                    
                    const button = document.querySelector('.main-accordion:not(.collapsed)');
                    
                    if(button) {
                        
                        button.click();
                    }
                    
                    this.maxH = 200;

                        const seasonAccordionElem = document.getElementById('accordionSeason');
    
                        if (seasonAccordionElem && seasonAccordionElem.offsetHeight > 200) {
                            
                            this.hasMaxHeight = true;
                        } else {
                            this.hasMaxHeight = false;
                        }
                },500);



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
                        this.maxH > 200 ? this.hasMaxHeight = true : this.hasMaxHeight = false;
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

        if (seasonElem && seasonElem.offsetHeight === 200) {
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


    overflow: hidden;
    position: relative;

    #seasons {
        transition: all 0.5s ease;
    }

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
            background-color: var(--ms-warning);
            color: #1f1f1f;
            box-shadow: unset;
        }
    }
}
</style>
