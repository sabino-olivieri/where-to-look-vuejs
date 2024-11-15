import {reactive} from "vue";

export const store = reactive ({
    // contenuto del file reattivo
    // dove ci serve 
    // import {store} from "./store";
    // e in data mettiamo store
    show: null,
    movies: null,
    series: null,
    details: null,
    italianDetails: null,
    header: {
        'x-rapidapi-host': 'streaming-availability.p.rapidapi.com',
        'x-rapidapi-key': import.meta.env.VITE_KEY_PPROVIDER
    },
    season: null

    
})