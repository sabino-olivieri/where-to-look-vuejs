# Where to Look?

## Descrizione del Progetto

**Where to Look?** è un sito web ispirato a JustWatch, progettato per aiutare gli utenti a cercare su quale piattaforma di streaming è disponibile un film o una serie TV. Grazie a un'interfaccia intuitiva e a un sistema avanzato di ricerca, il sito offre informazioni dettagliate e precise per rendere più semplice la scelta del servizio di streaming adatto alle proprie esigenze.

---

## Tecnologie Utilizzate

- **Vite**: per una configurazione leggera e una build rapida del progetto.
- **Vue.js**: per la creazione di un'interfaccia utente dinamica e scalabile.
- **Bootstrap**: per garantire uno stile moderno, elegante e completamente responsivo.

---

## Integrazione delle API

Il progetto utilizza due API principali:

1. **MovieOfTheNight**
   - API estremamente precisa e completa, utilizzata per fornire informazioni sui servizi di streaming che offrono il contenuto cercato.
   - Limite di 1000 chiamate, che ha richiesto l'implementazione di un sistema adattivo per garantire il funzionamento continuo del sito una volta raggiunto il limite.

2. **TheMovieDB**
   - Utilizzata per recuperare informazioni dettagliate sui film e le serie TV, come descrizioni, cast e dettagli tecnici.
   - Supporto per dati localizzati in italiano, migliorando l'esperienza utente.

---

## Funzionalità Principali

- **Ricerca Contenuti**: trova rapidamente il film o la serie desiderata e scopri su quali piattaforme di streaming è disponibile.
- **Informazioni Dettagliate**: accedi a descrizioni, cast, trailer e altro ancora grazie all'integrazione con TheMovieDB.
- **Gestione Intelligente delle API**: utilizza MovieOfTheNight come fonte principale e passa automaticamente a TheMovieDB in caso di superamento del limite di chiamate.
- **Interfaccia Responsive**: progettata per funzionare perfettamente su dispositivi desktop, tablet e mobile.

