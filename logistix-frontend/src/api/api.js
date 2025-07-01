// src/api/api.js

/* ------------------------------------------------------------------------- */
/*      ⚠️ Ces fonctions renvoient des données factices.
         Remplacez l’implémentation par de vrais appels axios.               */
/* ------------------------------------------------------------------------- */

export async function getStockCount(userId) {
    console.log(`Fetching stock count for user ${userId}`);
    // const { data } = await axios.get(`/api/products/count/${userId}`);
    return 2376;
}

export async function getMonthlySales(userId) {
    console.log(`Fetching stock count for user ${userId}`);
    // const { data } = await axios.get(`/api/sales/lastMonth/${userId}`);
    return 677;
}

export async function getTransitCount(userId) {
    console.log(`Fetching stock count for user ${userId}`);
    // const { data } = await axios.get(`/api/commands/transit_in/${userId}`);
    return 200;
}

export async function getRevenueChart(userId) {
    console.log(`Fetching stock count for user ${userId}`);
    /* Exemple de structure :
       [{ month: 'Jan', revenue: 12000, receipts: 18 }, … ]
    */
    // const { data } = await axios.get(`/api/revenue/chart/${userId}`);
    return [
        { month: 'Jan', revenue: 8000, receipts: 10 },
        { month: 'Fév', revenue: 9200, receipts: 12 },
        { month: 'Mar', revenue: 10100, receipts: 14 },
        { month: 'Avr', revenue: 9800, receipts: 13 },
        { month: 'Mai', revenue: 11200, receipts: 16 },
    ];
}

export async function getProductsInStock(userId) {
    // const { data } = await axios.get(`/api/products/stock/${userId}`);
    return [
        { id: 1, name: 'Produit 1', qty: 1000 },
        { id: 2, name: 'Produit 2', qty: 786 },
        { id: 3, name: 'Produit 3', qty: 355 },
        { id: 4, name: 'Produit 4', qty: 100 },
        { id: 5, name: 'Produit 5', qty: 64 },
    ];
}

export async function getProductsPending(userId) {
    // const { data } = await axios.get(`/api/products/pending/${userId}`);
    return [
        { id: 101, name: 'Produit_commandé 1', qty: 200 },
        { id: 102, name: 'Produit_commandé 2', qty: 50 },
    ];
}

export async function getSalesStats(userId) {
    // const { data } = await axios.get(`/api/stats/sales/${userId}`);
    return [
        { month: 'Novembre', revenue: 200, receipts: 0 },
        { month: 'Décembre', revenue: 800, receipts: 5 },
        { month: 'Janvier', revenue: 5600, receipts: 20 },
        { month: 'Février', revenue: 7200, receipts: 18 },
        { month: 'Mars', revenue: 8200, receipts: 15 },
    ];
}

/**
 * Renvoie les 3 produits les plus vendus.
 * Format : [{ rank: 1, name: 'Produit X', qty: 995 }, …]
 */
export async function getTopSellingProducts(userId) {
    // const { data } = await axios.get(`/api/stats/top-sellers/${userId}`);
    return [
        { rank: 1, name: 'Produit 1', qty: 995 },
        { rank: 2, name: 'Produit 2', qty: 823 },
        { rank: 3, name: 'Produit 3', qty: 355 },
    ];
}

export async function getOrderHistory(userId) {
    // return (await axios.get(`/api/orders/history/${userId}`)).data;
    return [
        { id: 1, name: 'Produit 1', qty: 1000, status: 'in_progress' },
        { id: 2, name: 'Produit 2', qty: 786, status: 'pending' },
        { id: 3, name: 'Produit 3', qty: 355, status: 'delivered' },
        { id: 4, name: 'Produit 4', qty: 100, status: 'cancelled' },
        { id: 5, name: 'Produit 5', qty: 64, status: 'delivered' },
        { id: 6, name: 'Produit 6', qty: 55, status: 'delivered' },
        { id: 7, name: 'Produit 7', qty: 3, status: 'delivered' },
    ];
}

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

export async function fetchAccountInfo() {
    await delay(500);
    // données factices
    return {
        displayName: "Alice Dupont",
        companyName: "Logistix SA",
        role: "Admin",
        avatar: "/path/to/avatar.jpg",
    };
}

export async function performLogout() {
    await delay(200);
    // ici on « détruirait » le token
    return;
}

export async function fetchSettings() {
    await delay(300);
    return {
        isDarkMode: false,
        notificationsEnabled: true,
    };
}

export async function saveSettings(settings) {
    await delay(300);
    // renvoie ce qu'on a sauvegardé
    return settings;
}

export async function fetchExistingProducts() {
    await new Promise((r) => setTimeout(r, 300));
    return [
        { id: "1", name: "Produit 1" },
        { id: "2", name: "Produit 2" },
        { id: "3", name: "Produit 3" },
    ];
}

export async function fetchProviders() {
    await new Promise((r) => setTimeout(r, 300));
    return [
        { id: "a", name: "Fournisseur A" },
        { id: "b", name: "Fournisseur B" },
    ];
}


export async function reorderProduct({ productId, qty }) {
    console.log("API reorderProduct", productId, qty);
    await new Promise((r) => setTimeout(r, 500));
    return { success: true };
}

// src/api.js
export async function fetchProducts() {
    // simule un appel long
    await new Promise((r) => setTimeout(r, 300));
    return [
        { id: "1", name: "Produit 1" },
        { id: "2", name: "Produit 2" },
        { id: "3", name: "Produit 3" },
    ];
}

export async function createProduct(payload) {
    console.log("createProduct", payload);
    await new Promise((r) => setTimeout(r, 300));
    return { success: true, id: Date.now().toString() };
}

export async function restockProduct({ productId, number }) {
    console.log("restockProduct", productId, number);
    await new Promise((r) => setTimeout(r, 300));
    return { success: true };
}


export async function fetchZones() {
    await new Promise((r) => setTimeout(r, 200));
    return [
        { id: "zone-nord", name: "Zone Nord" },
        { id: "zone-sud", name: "Zone Sud" },
        { id: "zone-est", name: "Zone Est" },
    ];
}

export async function placeOrder({ productId, zoneId, quantity, unitPrice }) {
    console.log("placeOrder", { productId, zoneId, quantity, unitPrice });
    await new Promise((r) => setTimeout(r, 300));
    return { success: true, orderId: Date.now().toString() };
}