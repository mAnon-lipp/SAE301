/**
 *  Besoin de comprendre comment fonctionne fetch ?
 *  C'est ici : https://fr.javascript.info/fetch
 */


// URL de votre API locale
let API_URL = "https://mmi.unilim.fr/~lippler1/SAE301/api/";


/**
 *  getRequest
 * 
 *  Requête en GET l'URI uri. 
 *  Une requête en GET correspond à une demande de "lecture" de la ressource d'URI uri.
 * 
 *  Par exemple "http://.../products" pour lire tous les produits
 *  Ou "http://.../products/3" pour lire le produit d'identifiant 3
 * 
 *  Le serveur renverra les données au format JSON.
 *  La fonction les retourne après conversion en objet Javascript (ou false si la requête a échoué)
 * 
 *  ATTENTION : La fonction est asynchrone, donc quand on l'appelle il ne faut pas oublier "await".
 *  Exemple : let data = await getRequest(http://.../api/products);
 */
let getRequest = async function(uri){

    let options = {
        method: "GET",
        credentials: 'include' // inclure les cookies dans la requête
    };

    try{
        var response = await fetch(API_URL+uri, options); // exécution (asynchrone) de la requête et attente de la réponse
    }
    catch(e){
        console.error("Echec de la requête : "+e); // affichage de l'erreur dans la console
        return false;
    }
    if (response.status != 200){
        console.error("Erreur de requête : " + response.status); // affichage de l'erreur dans la console
        return false; // si le serveur a renvoyé une erreur, on retourne false
    }  // si le serveur a renvoyé une erreur, on retourne false
    let $obj = await response.json(); // extraction du json retourné par le serveur (opération asynchrone aussi)
    return $obj; // et on retourne le tout (response.json() a déjà converti le json en objet Javscript)
}


/**
 *  postRequest
 * 
 *  Requête en POST l'URI uri. Par exemple "http://.../products"
 * 
 *  Une requête en POST correspond à une demande de création d'une ressource (dans l'exemple, création d'un produit)
 *  Pour créer la ressource, on fournit les données utiles via le paramètre data.
 * 
 *  Le serveur retourne en JSON la nouvelle ressource créée en base avec son identifiant.
 *  La fonction retourne les données après conversion en objet Javascript (ou false si la requête a échoué)
 */

let postRequest = async function(uri, data){
    // Défition des options de la requêtes
    let options = {
        credentials: 'include', // inclure les cookies dans la requête
        method: 'POST',
        headers: {
            'Content-Type': 'multipart/form-data' // type de données envoyées en JSON
        },
        body: JSON.stringify(data) // Convertir l'objet JavaScript en JSON
    }

    try{
        var response = await fetch(API_URL+uri, options); // exécution (asynchrone) de la requête et attente de la réponse
    }
    catch(e){
        console.error("Echec de la requête : " + e); // affichage de l'erreur dans la console
        return false;
    }
    // Accepter 200 (OK) et 201 (Created) comme succès
    if (response.status != 200 && response.status != 201){
        console.error("Erreur de requête : " + response.status); // affichage de l'erreur dans la console
        
        // Essayer de lire le message d'erreur du serveur
        try {
            const errorData = await response.json();
            console.error("Détails de l'erreur:", errorData);
        } catch (e) {
            console.error("Impossible de lire les détails de l'erreur");
        }
        
        return false; // si le serveur a renvoyé une erreur, on retourne false
    }
    let $obj = await response.json(); // extraction du json retourné par le serveur (opération asynchrone aussi)
    return $obj; // et on retourne le tout (response.json() a déjà converti le json en objet Javscript)
}

let jsonpostRequest = async function(uri, data){
    // Défition des options de la requêtes
    let options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json' // type de données envoyées en JSON
        },
        credentials: 'include', // inclure les cookies dans la requête
        body: JSON.stringify(data) // Convertir l'objet JavaScript en JSON
    }

    try{
        var response = await fetch(API_URL+uri, options); // exécution (asynchrone) de la requête et attente de la réponse
    }
    catch(e){
        console.error("Echec de la requête : " + e); // affichage de l'erreur dans la console
        return false;
    }
    // Accepter 200 (OK) et 201 (Created) comme succès
    if (response.status != 200 && response.status != 201){
        console.error("Erreur de requête : " + response.status); // affichage de l'erreur dans la console
        
        // Essayer de lire le message d'erreur du serveur
        try {
            const errorData = await response.json();
            console.error("Détails de l'erreur:", errorData);
        } catch (e) {
            console.error("Impossible de lire les détails de l'erreur");
        }
        
        return false; // si le serveur a renvoyé une erreur, on retourne false
    }
    let $obj = await response.json(); // extraction du json retourné par le serveur (opération asynchrone aussi)
    return $obj; // et on retourne le tout (response.json() a déjà converti le json en objet Javscript)
}

/**
 *  deleteRequest
 * 
 *  Requête en DELETE l'URI uri. Par exemple "http://.../products/3"
 * 
 *  Une requête en DELETE correspond à une demande de suppression d'une ressource.
 *  Par exemple : deleteRequest("http://.../products/3") pour supprimer le produit d'identifiant 3
 * 
 *  La fonction retourne true ou false selon le succès de l'opération
 */
let deleteRequest = async function(uri){
    // Définition des options de la requête
    let options = {
        method: 'DELETE',
        credentials: 'include' // inclure les cookies dans la requête
    };

    try{
        var response = await fetch(API_URL+uri, options); // exécution (asynchrone) de la requête et attente de la réponse
    }
    catch(e){
        console.error("Echec de la requête : " + e); // affichage de l'erreur dans la console
        return false;
    }
    
    // Accepter 200 (OK) et 204 (No Content) comme succès
    if (response.status != 200 && response.status != 204){
        console.error("Erreur de requête : " + response.status); // affichage de l'erreur dans la console
        
        // Essayer de lire le message d'erreur du serveur
        try {
            const errorData = await response.json();
            console.error("Détails de l'erreur:", errorData);
        } catch (e) {
            console.error("Impossible de lire les détails de l'erreur");
        }
        
        return false;
    }
    
    // Si la réponse contient du contenu, le parser
    if (response.status === 200) {
        try {
            let $obj = await response.json();
            return $obj;
        } catch (e) {
            // Pas de contenu JSON, retourner true
            return true;
        }
    }
    
    return true; // Succès pour 204 No Content
}


/** 
 *  patchRequest
 * 
 *  Requête en PATCH l'URI uri. Par exemple "http://.../products/3"
 * 
 *  Une requête en PATCH correspond à une demande de modification/mise à jour d'une ressource.
 *  Pour modifier la ressource, on fournit les données utiles via le paramètre data.
 *  Par exemple : patchRequest("http://.../products/3", {category:1} ) pour modifier la catégorie du produit d'identifiant 3
 * 
 *  La fonction retourne les données mises à jour ou false selon le succès de l'opération
 */
let patchRequest = async function(uri, data){
    // Définition des options de la requête
    let options = {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include', // inclure les cookies dans la requête
        body: JSON.stringify(data)
    };

    try{
        var response = await fetch(API_URL+uri, options); // exécution (asynchrone) de la requête et attente de la réponse
    }
    catch(e){
        console.error("Echec de la requête : " + e); // affichage de l'erreur dans la console
        return false;
    }
    
    // Accepter 200 (OK) comme succès
    if (response.status != 200){
        console.error("Erreur de requête : " + response.status); // affichage de l'erreur dans la console
        
        // Essayer de lire le message d'erreur du serveur
        try {
            const errorData = await response.json();
            console.error("Détails de l'erreur:", errorData);
            // Retourner l'erreur structurée pour que l'appelant puisse la gérer
            return { success: false, error: errorData.error || 'Erreur inconnue' };
        } catch (e) {
            console.error("Impossible de lire les détails de l'erreur");
            return false;
        }
    }
    
    let $obj = await response.json(); // extraction du json retourné par le serveur (opération asynchrone aussi)
    return $obj; // et on retourne le tout (response.json() a déjà converti le json en objet Javascript)
}


export {getRequest, postRequest, jsonpostRequest, patchRequest, deleteRequest }