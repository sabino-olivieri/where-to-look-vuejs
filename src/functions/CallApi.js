import axios from "axios";

/**
 * Description
 * @param {string} link link per la chiamata
 * @param {Object} objHeader oggetto con chiave api
 * @param {Object} objParams oggetto con i parametri
 * @returns {array}
 */
export default async function CallApi(link, objHeader, objParams) {
    let data = [];
    
    const maxRetries = 1;
    let attempts = 0;

    

    while (attempts < maxRetries) {
        if (link) {
            try {
                const response = await axios.get(link, {
                    headers: objHeader,
                    params: objParams 
                });
                
                data = response.data;
                return data;
            } catch (err) {
                attempts += 1;
                // console.log(`Tentativo ${attempts} fallito:`, err);

                if (attempts >= maxRetries) {
                    // console.log("Numero massimo di tentativi raggiunto. Chiamata fallita.");
                }
            }
        } else {
            console.log("Nessun link fornito.");
            break;
        }
    }

    return data;
}