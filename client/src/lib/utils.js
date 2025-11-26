


/**
 * Renders a template string by replacing placeholders with corresponding data values.
 *
 * @param {string} template - The template string containing placeholders in the format {{key}}.
 * @param {Object} data - An object containing key-value pairs where the key corresponds to the placeholder in the template.
 * @returns {string} - The rendered HTML string with placeholders replaced by data values.
 */
let genericRenderer = function(template, data){
    let html = template;
    for(let key in data){
        html = html.replaceAll(new RegExp("{{"+key+"}}", "g"), data[key]);
    }
    return html;
}

/**
 * Converts an HTML string into a DocumentFragment.
 *
 * @param {string} htmlString - The HTML string to convert.
 * @returns {DocumentFragment} - A DocumentFragment containing the parsed HTML elements.
 */
function htmlToFragment(htmlString) {
    const template = document.createElement('template');
    template.innerHTML = htmlString.trim(); // trim supprime les espaces inutiles
    return template.content;
}

/**
 * Returns the correct asset path with base URL for GitHub Pages compatibility.
 * 
 * @param {string} path - The path to the asset (e.g., '/logo.svg', '/images/product.jpg')
 * @returns {string} - The full path with base URL (e.g., '/SAE301/logo.svg')
 */
function getAssetPath(path) {
    // Si le chemin commence déjà par le base URL, le retourner tel quel
    const baseUrl = import.meta.env.BASE_URL || '/';
    if (path.startsWith(baseUrl)) {
        return path;
    }
    
    // Si le chemin commence par '/', retirer le '/' et ajouter le base URL
    if (path.startsWith('/')) {
        path = path.substring(1);
    }
    
    // Retourner le chemin avec le base URL
    return baseUrl + path;
}

/**
 * Processes a template string to replace all asset paths with base URL.
 * Replaces src="/..." and url('/...') with the correct base URL.
 * 
 * @param {string} template - The template HTML string
 * @returns {string} - The processed template with corrected asset paths
 */
function processTemplate(template) {
    const baseUrl = import.meta.env.BASE_URL || '/';
    
    // Si on est en dev (baseUrl === '/'), pas besoin de traiter
    if (baseUrl === '/') {
        return template;
    }
    
    // Remplacer src="/xxx" par src="/SAE301/xxx"
    template = template.replace(/src="\/([^"]+)"/g, (match, path) => {
        return `src="${baseUrl}${path}"`;
    });
    
    // Remplacer url('/xxx') par url('/SAE301/xxx') dans les styles inline
    template = template.replace(/url\('\/([^']+)'\)/g, (match, path) => {
        return `url('${baseUrl}${path}')`;
    });
    
    return template;
}

export { genericRenderer, htmlToFragment, getAssetPath, processTemplate };