<template>

        <div class="my-3 rounded-3 border border-2 ms_border p-3" id="details-container">
            <!-- genere -->
            <div class="row mb-3">
                <div class="col d-flex gap-3">
                    <span class="text-uppercase">Genere:</span>

                    <div class="d-flex gap-2 flex-wrap">

                        <span class="badge bg-ms_warning text-bg-warning d-flex align-items-center "
                            v-for="genre in store.italianDetails.genres" :key="genre">
                            {{ genre.name }}
                        </span>
                    </div>
                </div>
            </div>

            <!-- durata -->
            <div class="row mb-3">
                <div class="col d-flex gap-3">
                    <span class="text-uppercase">Durata {{ store.italianDetails.episode_run_time &&
                        store.italianDetails.episode_run_time[0] ? ' episodio' : '' }}:</span>

                    <div class="d-flex gap-2 flex-wrap">

                        <span class="" v-if="store.italianDetails.runtime || store.italianDetails.episode_run_time">
                            {{ formatTime(store.italianDetails.runtime ?? (store.italianDetails.episode_run_time[0] > 0
                                ? store.italianDetails.episode_run_time[0] : 0 )) }}
                        </span>
                    </div>
                </div>
            </div>

            <!-- cast -->
            <div class="row gap-2 flex-nowrap overflow-x-scroll py-2 px-3" v-if="actors && actors.length > 0">

                <div class="text-center p-0 rounded-3 ms_actors" v-for="actor, index in actors" :key="actor">
                    <img :src="getImagePath(actor.profile_path)" class="rounded-top-3 mb-1 ms_img" alt=""
                        v-show="actorsIndex[index]" @load="actorsIndex[index] = true">
                    <div class="ms_img mb-1 d-flex justify-content-center align-items-center"
                        v-if="!actorsIndex[index]">
                        <loader />
                    </div>
                    <div class="p-2">
                        <h6>{{ actor.name }}</h6>
                        <span>{{ actor.character }}</span>
                    </div>
                </div>
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
            actors: null,
            actorsIndex: []
        }
    },
    props: {
        id: String
    },
    async created() {


        const resp = await CallApi(`https://api.themoviedb.org/3/${this.id}/credits`, {}, store.objPramsMovieDB);

        if (resp && resp.cast) {

            this.actors = resp.cast.slice(0, 10);

            this.actors.forEach(element => {
                this.actorsIndex.push(false);
            });
        }


    },

    methods: {
        formatTime(minutes) {

            if (minutes === 0) return 'N/D'

            const hours = Math.floor(minutes / 60);
            const remainingMinutes = minutes % 60;


            if (hours === 0) {
                return `${remainingMinutes} minuti`;
            } else if (hours > 1) {
                return `${hours} ore e ${remainingMinutes} minuti`;
            }

            return `${hours} ora e ${remainingMinutes} minuti`;
        },
        getImagePath(img) {
            if (img) {

                return new URL("https://image.tmdb.org/t/p/w154" + img, import.meta.url).href;

            } else {

                return `https://placehold.co/92x138?text=N/D`;
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.ms_actors {
    background-color: var(--bg-card);
    max-width: 150px;

    .ms_img {
        width: 100%;
        height: 225px;
        object-fit: cover;
    }

    span {
        font-size: 12px;
    }
}
</style>