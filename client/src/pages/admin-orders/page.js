import template from "./template.html?raw";
import { htmlToFragment } from "../../lib/utils.js";
import "./style.css";
import { getRequest, jsonpostRequest } from "../../lib/api-request.js";

// Modèle local pour stocker les commandes et l'état de l'UI
let M = {
    orders: [],
    filteredOrders: [],
    sortBy: 'date_desc',
    filterStatus: 'all'
};

// Contrôleur pour la logique
let C = {};

C.init = async function() {
    const pageFragment = htmlToFragment(template);
    M.container = pageFragment;

    // Charger les données
    try {
        // Appelle GET /api/admin?resource=orders
        M.orders = await getRequest('admin?resource=orders'); 
        if (!Array.isArray(M.orders)) {
            throw new Error("Réponse invalide de l'API");
        }
        M.filteredOrders = M.orders;
        C.sortAndFilterOrders();
        V.renderTable();
        V.attachEvents();
    } catch (error) {
        console.error("Erreur chargement commandes admin:", error);
        M.container.querySelector('#orders-table-body').innerHTML = 
            '<tr><td colspan="7" class="admin-orders__error">Erreur de chargement.</td></tr>';
    }

    return pageFragment;
};

C.sortAndFilterOrders = function() {
    // 1. Filtrer (créer une copie pour ne pas modifier l'original)
    if (M.filterStatus === 'all') {
        M.filteredOrders = [...M.orders];
    } else {
        M.filteredOrders = M.orders.filter(o => o.statut === M.filterStatus);
    }

    // 2. Trier
    const sortFn = {
        'date_desc': (a, b) => new Date(b.date_commande) - new Date(a.date_commande),
        'date_asc': (a, b) => new Date(a.date_commande) - new Date(b.date_commande),
        'montant_desc': (a, b) => parseFloat(b.montant_total) - parseFloat(a.montant_total),
        'montant_asc': (a, b) => parseFloat(a.montant_total) - parseFloat(b.montant_total),
        'statut_asc': (a, b) => a.statut.localeCompare(b.statut),
    };
    M.filteredOrders.sort(sortFn[M.sortBy] || sortFn['date_desc']);
};

// Actions en lot
C.handleBatchUpdate = async function() {
    const statusSelect = document.querySelector('#batch-action-status') || M.container.querySelector('#batch-action-status');
    const newStatus = statusSelect.value;
    if (!newStatus) {
        alert('⚠️ Veuillez sélectionner un statut à appliquer.');
        return;
    }

    const checkboxes = (document.querySelector('#orders-table-body') || M.container.querySelector('#orders-table-body')).querySelectorAll('.order-checkbox:checked');
    const orderIds = Array.from(checkboxes).map(cb => parseInt(cb.dataset.id, 10));

    if (orderIds.length === 0) {
        alert('⚠️ Veuillez sélectionner au moins une commande.');
        return;
    }

    if (!confirm(`❓ Confirmer le changement de statut vers "${newStatus}" pour ${orderIds.length} commande(s) ?\n\nCommandes concernées : #${orderIds.join(', #')}`)) {
        return;
    }

    try {
        // Appelle POST /api/admin?action=batch-update-status
        const response = await jsonpostRequest('admin?action=batch-update-status', {
            orderIds: orderIds,
            newStatus: newStatus
        });

        alert(`✅ Mise à jour en lot terminée !\n\n✓ ${response.updated} commande(s) mise(s) à jour\n✗ ${response.errors.length} erreur(s)`);

        // Recharger les données pour voir les changements
        M.orders = await getRequest('admin?resource=orders');
        C.sortAndFilterOrders();
        V.renderTable();
        
        // Réinitialiser la sélection
        const selectAll = document.querySelector('#select-all-orders') || M.container.querySelector('#select-all-orders');
        if (selectAll) selectAll.checked = false;
        C.updateBatchActionsVisibility();

    } catch (error) {
        console.error("Erreur action en lot:", error);
        alert("❌ Erreur lors de l'action en lot : " + error.message);
    }
};

C.updateBatchActionsVisibility = function() {
    const batchActionsDiv = document.querySelector('#batch-actions-container') || M.container.querySelector('#batch-actions-container');
    const countElement = document.querySelector('#batch-selection-count') || M.container.querySelector('#batch-selection-count');
    const tableBody = document.querySelector('#orders-table-body') || M.container.querySelector('#orders-table-body');
    
    if (!tableBody) {
        console.warn('Table body not found in updateBatchActionsVisibility');
        return;
    }
    
    const checkboxes = tableBody.querySelectorAll('.order-checkbox:checked');
    const count = checkboxes.length;
    
    console.log('Updating batch actions visibility. Checked count:', count);
    
    if (count > 0) {
        batchActionsDiv.style.display = 'block';
        countElement.textContent = `${count} commande(s) sélectionnée(s)`;
    } else {
        batchActionsDiv.style.display = 'none';
    }
};

// Vue pour le rendu et les événements
let V = {};

V.renderTable = function() {
    // Essayer d'abord dans le DOM, sinon dans le container initial
    const tableBody = document.querySelector('#orders-table-body') || M.container.querySelector('#orders-table-body');
    if (!tableBody) {
        console.error('Table body not found');
        return;
    }
    if (M.filteredOrders.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="7" class="admin-orders__no-results">Aucune commande trouvée.</td></tr>';
        return;
    }

    tableBody.innerHTML = M.filteredOrders.map(order => `
        <tr data-order-id="${order.id}">
            <td class="admin-orders__td_center">
                <input type="checkbox" class="order-checkbox" data-id="${order.id}">
            </td>
            <td class="admin-orders__td">#${order.id}</td>
            <td class="admin-orders__td">${new Date(order.date_commande).toLocaleDateString('fr-FR')}</td>
            <td class="admin-orders__td">${order.client_name || order.client_email}</td>
            <td class="admin-orders__td">${order.montant_total} €</td>
            <td class="admin-orders__td">
                <span class="status-${order.statut.replace(' ', '-')}">${order.statut}</span>
            </td>
            <td class="admin-orders__td">
                <a href="/admin/orders/${order.id}" data-link>Voir / Modifier</a>
            </td>
        </tr>
    `).join('');
};

V.attachEvents = function() {
    // Utiliser le container initial car le fragment n'est pas encore dans le DOM
    const sortSelect = M.container.querySelector('#sort-by');
    const filterSelect = M.container.querySelector('#filter-status');
    const selectAll = M.container.querySelector('#select-all-orders');
    const batchApplyBtn = M.container.querySelector('#batch-action-apply');

    // Tris et filtres
    sortSelect.addEventListener('change', () => {
        console.log('Sort changed to:', sortSelect.value);
        M.sortBy = sortSelect.value;
        C.sortAndFilterOrders();
        console.log('Filtered orders:', M.filteredOrders);
        V.renderTable();
    });

    filterSelect.addEventListener('change', () => {
        console.log('Filter changed to:', filterSelect.value);
        M.filterStatus = filterSelect.value;
        C.sortAndFilterOrders();
        console.log('Filtered orders:', M.filteredOrders);
        V.renderTable();
    });

    // Sélectionner tout
    selectAll.addEventListener('change', () => {
        const checkboxes = (document.querySelector('#orders-table-body') || M.container.querySelector('#orders-table-body')).querySelectorAll('.order-checkbox');
        checkboxes.forEach(cb => cb.checked = selectAll.checked);
        C.updateBatchActionsVisibility();
    });

    // Délégation d'événements pour les checkboxes individuelles
    // Attacher sur le container ET utiliser une approche plus robuste
    const handleCheckboxChange = (e) => {
        if (e.target.classList.contains('order-checkbox')) {
            console.log('Checkbox changed:', e.target.dataset.id, 'checked:', e.target.checked);
            C.updateBatchActionsVisibility();
        }
    };
    
    // Attacher l'événement sur le container
    M.container.addEventListener('change', handleCheckboxChange);
    
    // Aussi attacher au document pour gérer les cas où le contenu est dans le DOM
    document.addEventListener('change', (e) => {
        if (e.target.classList.contains('order-checkbox')) {
            const tableBody = document.querySelector('#orders-table-body');
            // Vérifier que la checkbox est bien dans notre tableau
            if (tableBody && tableBody.contains(e.target)) {
                console.log('Document checkbox changed:', e.target.dataset.id);
                C.updateBatchActionsVisibility();
            }
        }
    });

    // Bouton Appliquer (actions en lot)
    batchApplyBtn.addEventListener('click', () => C.handleBatchUpdate());
};


// Point d'entrée de la page
export async function AdminOrdersPage(params, router) {
    return C.init();
}
