import template from "./template.html?raw";
import "./style.css";
import { htmlToFragment } from "../../lib/utils.js";
import { getRequest } from "../../lib/api-request.js";

export async function AdminDashboardPage(params, router) {
    const pageFragment = htmlToFragment(template);
    const metricsContainer = pageFragment.querySelector('#dashboard-metrics');

    try {
        // Appelle l'API admin pour obtenir les stats
        const stats = await getRequest('admin'); // Route /api/admin

        if (stats && !stats.error) {
            // Affiche les stats (DoD: Dashboard informatif)
            metricsContainer.innerHTML = `
                <ul>
                    <li>Nombre d'utilisateurs : ${stats.userCount ?? 'N/A'}</li>
                    <li>Nombre de commandes : ${stats.orderCount ?? 'N/A'}</li>
                    <li>Nombre de produits : ${stats.productCount ?? 'N/A'}</li>
                </ul>
                <p><em>(${stats.message ?? ''})</em></p>
            `;
        } else {
            metricsContainer.innerHTML = `<p class="admin-dashboard__error">Erreur lors du chargement des statistiques: ${stats.error || 'Erreur inconnue'}</p>`;
        }
    } catch (error) {
        console.error("Erreur fetch dashboard stats:", error);
        metricsContainer.innerHTML = '<p class="admin-dashboard__error">Impossible de charger les statistiques.</p>';
    }

    return pageFragment;
}
