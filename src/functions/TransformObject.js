export default async function TransformObject(original) {
    const {
        id,
        imdb_id,
        title,
        media_type,
        name,
        overview,
        release_date,
        genres,
        runtime,
        poster_path,
        backdrop_path
    } = original;

    // Crea l'oggetto trasformato
    const transformed = {
        itemType: "show",
        showType: media_type,
        id: media_type+'/'+id,
        // imdbId: imdb_id,
        tmdbId: media_type+'/'+id,
        title: title ?? name,
        overview: overview,
        originalTitle: title ?? name,
        // genres: genres.map(genre => ({
        //     id: genre.name.toLowerCase().replace(/\s+/g, ''),
        //     name: genre.name
        // })),
        // directors: [], // Non presenti nell'oggetto originale
        // cast: [], // Non presenti nell'oggetto originale
        // rating: Math.round(original.vote_average * 10),
        // runtime: runtime,
        imageSet: {
            horizontalPoster: {
                // w360: 'https://image.tmdb.org/t/p/w1280'+ backdrop_path ?? poster_path,
                // w480: 'https://image.tmdb.org/t/p/w1280'+ backdrop_path ?? poster_path,
                w720: 'https://image.tmdb.org/t/p/w1280'+ backdrop_path ?? poster_path,
                w1080: 'https://image.tmdb.org/t/p/w1280'+ backdrop_path ?? poster_path,
                w1440: 'https://image.tmdb.org/t/p/w1280'+ backdrop_path ?? poster_path
            },


        },
        streamingOptions: {
            it: []
        } // Non presenti nell'oggetto originale
    };

    
    return transformed;

}