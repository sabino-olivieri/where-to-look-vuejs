import axios from "axios";

/**
 * Description
 * @param {string} link link per la chiamata
 * @param {Object} objHeader oggetto con chiave api
 * @param {Object} objParams oggetto con i parametri
 * @returns {Object}
 */
export default async function CallApi(link, objHeader, objParams) {
    let data = null;
    
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
                // console.log(data);
                
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