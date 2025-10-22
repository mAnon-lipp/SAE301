import { getRequest, jsonpostRequest, patchRequest } from "../lib/api-request";

let UserData = {};

/**
 * Créer un nouvel utilisateur (inscription)
 * @param {object} userInfo - Informations de l'utilisateur (email, password)
 * @returns {Promise<object|boolean>} - Réponse de l'API ou false
 */
UserData.create = async function(userInfo) {
    const response = await jsonpostRequest('users', userInfo);
    return response;
};

/**
 * Connexion d'un utilisateur
 * @param {string} email - Email de l'utilisateur
 * @param {string} password - Mot de passe de l'utilisateur
 * @returns {Promise<object|boolean>} - Réponse de l'API avec les données utilisateur ou false
 */
UserData.login = async function(email, password) {
    const response = await jsonpostRequest('auth', { email, password });
    return response;
};

/**
 * Récupérer les informations de l'utilisateur connecté
 * @returns {Promise<object|boolean>} - Données utilisateur ou false
 */
UserData.get = async function() {
    const response = await getRequest('user');
    return response;
};

/**
 * Mettre à jour les informations de l'utilisateur
 * @param {object} updates - Données à mettre à jour (name, email, old_password, new_password)
 * @returns {Promise<object|boolean>} - Réponse de l'API ou false
 */
UserData.update = async function(updates) {
    const response = await patchRequest('user', updates);
    return response;
};

export { UserData };