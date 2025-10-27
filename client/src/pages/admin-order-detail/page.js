import template from "./template.html?raw";
import { htmlToFragment } from "../../lib/utils.js";
import "./style.css";
import { getRequest, patchRequest } from "../../lib/api-request.js";

let M = {
    order: null
};

let C = {};

C.init = async function(params) {
    const orderId = params.id;
    const pageFragment = htmlToFragment(template);

    try {
        // Appelle GET /api/admin/{id}?resource=orders
        M.order = await getRequest(`admin/${orderId}?resource=orders`); 

        V.renderOrder(pageFragment);
        V.attachEvents(pageFragment, orderId);

    } catch (error) {
        console.error("Erreur chargement détail commande:", error);
        pageFragment.innerHTML = `<p class="admin-order-detail__error">Erreur: Commande introuvable.</p><a href="/admin/orders" data-link>&larr; Retour</a>`;
    }

    return pageFragment;
};

C.saveStatus = async function(orderId, newStatus, msgElement) {
    // Reset message element classes
    msgElement.classList.remove('admin-order-detail__msg--success', 'admin-order-detail__msg--error');
    msgElement.classList.add('admin-order-detail__msg');

    try {
        // Appelle PATCH /api/admin/{id}
        const updatedOrder = await patchRequest(`admin/${orderId}`, {
            statut: newStatus
        });

        if (updatedOrder && !updatedOrder.error) {
            M.order.statut = updatedOrder.statut; // Mettre à jour le modèle local
            msgElement.textContent = "Statut mis à jour !";
            msgElement.classList.remove('admin-order-detail__msg--error');
            msgElement.classList.add('admin-order-detail__msg--success');
            
            // Afficher une alerte de confirmation
            alert(`✓ Le statut de la commande #${orderId} a été modifié avec succès !\n\nNouveau statut : ${newStatus}`);
        } else {
            throw new Error(updatedOrder.error || "Erreur inconnue");
        }
    } catch (error) {
        console.error("Erreur sauvegarde statut:", error);
        msgElement.textContent = `Erreur: ${error.message}`;
        msgElement.classList.remove('admin-order-detail__msg--success');
        msgElement.classList.add('admin-order-detail__msg--error');
    }
};

let V = {};

V.renderOrder = function(fragment) {
    const order = M.order;

    fragment.querySelector('#order-title').textContent = `Commande #${order.id}`;

    fragment.querySelector('#order-details').innerHTML = `
        <p><strong>Date :</strong> ${new Date(order.date_commande).toLocaleString('fr-FR')}</p>
        <p><strong>Montant :</strong> ${order.montant_total} €</p>
        <p><strong>Statut actuel :</strong> ${order.statut}</p>
    `;

    fragment.querySelector('#status-select').value = order.statut;

    const itemsBody = fragment.querySelector('#order-items-body');
    itemsBody.innerHTML = order.items.map(item => `
        <tr>
            <td class="admin-order-detail__td">${item.product_details?.name || 'Produit inconnu'}</td>
            <td class="admin-order-detail__td">${item.product_details?.sku || 'N/A'}</td>
            <td class="admin-order-detail__td">${item.quantite}</td>
            <td class="admin-order-detail__td">${item.prix_unitaire} €</td>
        </tr>
    `).join('');
};

V.attachEvents = function(fragment, orderId) {
    const saveBtn = fragment.querySelector('#save-status-btn');
    const statusSelect = fragment.querySelector('#status-select');
    const msgElement = fragment.querySelector('#save-status-msg');

    saveBtn.addEventListener('click', () => {
        const newStatus = statusSelect.value;
        C.saveStatus(orderId, newStatus, msgElement);
    });
};

export async function AdminOrderDetailPage(params, router) {
    return C.init(params);
}
