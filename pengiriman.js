
/**
 * BYULOGISTICS - Pengiriman Page JavaScript
 */

// Use shared Data module (data.js)
let filteredData = Data.getAll();



// Pagination variables
let currentPage = 1;
const itemsPerPage = 5;
// Removed hardcoded data - using Data module


// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    initSidebar();
    initShipmentModal();
    initLogout();
    renderTable();
    updateStats();
    initFilters();
    initSearch();
});

// Check authentication
function checkAuth() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
        window.location.href = 'index.html';
    }
}

// Sidebar
function initSidebar() {
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.querySelector('.main-content');
    
    if (menuToggle && sidebar && mainContent) {
        menuToggle.addEventListener('click', function() {
            sidebar.classList.toggle('hide');
            mainContent.classList.toggle('full');
        });
    }
}

// Logout
function initLogout() {
    const logoutBtn = document.getElementById('logoutBtn');
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('userEmail');
            window.location.href = 'index.html';
        });
    }
}

// Shipment Modal
function initShipmentModal() {
    const newShipmentBtn = document.getElementById('newShipmentBtn');
    const shipmentModal = document.getElementById('shipmentModal');
    const modalClose = document.querySelector('.modal-close');
    const modalOverlay = document.querySelector('.modal-overlay');
    const modalCancel = document.querySelector('.modal-cancel');
    const shipmentForm = document.getElementById('shipmentForm');
    
    if (newShipmentBtn && shipmentModal) {
        newShipmentBtn.addEventListener('click', function(e) {
            e.preventDefault();
            shipmentModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }
    
    function closeModal() {
        if (shipmentModal) {
            shipmentModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
    
    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (modalCancel) modalCancel.addEventListener('click', closeModal);
    if (modalOverlay) modalOverlay.addEventListener('click', closeModal);
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && shipmentModal && shipmentModal.classList.contains('active')) {
            closeModal();
        }
    });
    
    if (shipmentForm) {
        shipmentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Collect form data
            const formData = {
                date: document.getElementById('shipDate').value,
                customer: 'Customer', // Default or from auth
                sender: shipmentForm.querySelector('input[placeholder="Nama pengirim"]').value,
                senderPhone: shipmentForm.querySelector('input[placeholder="08xxxxxxxxxx"]').value, // First phone
                senderAddress: shipmentForm.querySelector('textarea[placeholder="Alamat lengkap pengirim"]').value,
                receiver: shipmentForm.querySelectorAll('input[placeholder="Nama penerima"]')[0].value,
                receiverPhone: shipmentForm.querySelectorAll('input[placeholder="08xxxxxxxxxx"]')[1].value, // Second phone
                receiverAddress: shipmentForm.querySelectorAll('textarea[placeholder="Alamat lengkap penerima"]')[0].value,
                city: shipmentForm.querySelector('select').value || 'Jakarta',
                service: shipmentForm.querySelectorAll('select')[1].value,
                weight: parseInt(shipmentForm.querySelector('input[type="number"]').value),
                itemType: shipmentForm.querySelector('input[placeholder="Contoh: Elektronik"]').value,
                notes: shipmentForm.querySelector('textarea[placeholder="Catatan khusus (opsional)"]').value
            };
            
            Data.create(formData);
            filteredData = Data.getAll();
            renderTable();
            updateStats();
            showNotification('Pengiriman baru berhasil dibuat!', 'success');
            shipmentForm.reset();
            setTimeout(closeModal, 1000);
        });

    }
    
    // Set default date
    const shipDateInput = document.getElementById('shipDate');
    if (shipDateInput) {
        shipDateInput.value = new Date().toISOString().split('T')[0];
    }
}

// Render table
function renderTable() {
    const tbody = document.getElementById('shipmentsBody');
    if (!tbody) return;
    
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageData = filteredData.slice(start, end);
    
    tbody.innerHTML = '';
    
    if (pageData.length === 0) {
        tbody.innerHTML = '<tr><td colspan="11" style="text-align: center; padding: 2rem; color: var(--gray-500);">Tidak ada data</td></tr>';
        return;
    }
    
    pageData.forEach(function(item) {
        const tr = document.createElement('tr');
        tr.dataset.id = item.id;
        tr.dataset.customer = item.customer || '';
        tr.dataset.sender = item.sender;
        tr.dataset.receiver = item.receiver;
        tr.dataset.city = item.city;
        tr.dataset.service = item.service;
        tr.dataset.weight = item.weight;
        tr.dataset.status = item.status;
        tr.innerHTML = `
            <td><input type="checkbox" class="row-checkbox"></td>
            <td>${item.id}</td>
            <td>${formatDate(item.date)}</td>
            <td>${item.customer || ''}</td>
            <td>${item.sender}</td>
            <td>${item.receiver}</td>
            <td>${capitalizeFirst(item.city)}</td>
            <td>${capitalizeFirst(item.service)}</td>
            <td>${item.weight} kg</td>
            <td><span class="status ${item.status}">${getStatusText(item.status)}</span></td>
            <td>
                <div class="action-buttons">
                    <button class="btn-action btn-detail" title="Detail">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-action btn-edit" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-action btn-delete" title="Hapus">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
    
    updatePagination();
    document.getElementById('showingCount').textContent = filteredData.length;
}


// Update stats
function updateStats() {
    const stats = Data.getStats();
    document.getElementById('totalCount').textContent = stats.total;
    document.getElementById('pendingCount').textContent = stats.pending;
    document.getElementById('transitCount').textContent = stats.shipping;
    document.getElementById('deliveredCount').textContent = stats.delivered;
}


// Pagination
function updatePagination() {
    const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;
    
    document.getElementById('currentPage').textContent = currentPage;
    document.getElementById('totalPages').textContent = totalPages;
    
    document.getElementById('prevPage').disabled = currentPage === 1;
    document.getElementById('nextPage').disabled = currentPage === totalPages || totalPages === 0;
}

document.getElementById('prevPage').addEventListener('click', function() {
    if (currentPage > 1) {
        currentPage--;
        renderTable();
    }
});

document.getElementById('nextPage').addEventListener('click', function() {
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        renderTable();
    }
});

// Filters
function initFilters() {
    const statusFilter = document.getElementById('statusFilter');
    const dateFilter = document.getElementById('dateFilter');
    const cityFilter = document.getElementById('cityFilter');
    const serviceFilter = document.getElementById('serviceFilter');
    const resetFilter = document.getElementById('resetFilter');
    
    function applyFilters() {
        const filters = {
            status: statusFilter.value,
            date: dateFilter.value,
            city: cityFilter.value,
            service: serviceFilter.value
        };
        filteredData = Data.getFiltered(filters);
        
        currentPage = 1;
        renderTable();
        updateStats();
    }
    
    if (statusFilter) statusFilter.addEventListener('change', applyFilters);
    if (dateFilter) dateFilter.addEventListener('change', applyFilters);
    if (cityFilter) cityFilter.addEventListener('change', applyFilters);
    if (serviceFilter) serviceFilter.addEventListener('change', applyFilters);
    
    if (resetFilter) {
        resetFilter.addEventListener('click', function() {
            statusFilter.value = '';
            dateFilter.value = '';
            cityFilter.value = '';
            serviceFilter.value = '';
            filteredData = Data.getAll();
            currentPage = 1;
            renderTable();
            updateStats();
        });
    }
}


// Search
function initSearch() {
    const searchInput = document.getElementById('searchInput');
    
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            if (searchTerm === '') {
                filteredData = Data.getAll();
            } else {
                // Simple search - filter locally
                filteredData = Data.getAll().filter(function(item) {
                    const term = searchTerm;
                    return item.id.toLowerCase().includes(term) ||
                           (item.customer || '').toLowerCase().includes(term) ||
                           item.sender.toLowerCase().includes(term) ||
                           item.receiver.toLowerCase().includes(term) ||
                           item.city.toLowerCase().includes(term);
                });
            }
            currentPage = 1;
            renderTable();
            updateStats();
        });
    }
}


// Event delegation for action buttons
document.addEventListener('click', function(e) {
    if (e.target.closest('.btn-detail')) {
        const row = e.target.closest('tr');
        showDetailModal(row);
    } else if (e.target.closest('.btn-edit')) {
        const row = e.target.closest('tr');
        showEditModal(row);
    } else if (e.target.closest('.btn-delete')) {
        const id = e.target.closest('tr').dataset.id;
        if (confirm('Apakah anda yakin ingin menghapus data ini?')) {
            Data.delete(id);
            filteredData = Data.getAll();
            currentPage = 1;
            renderTable();
            updateStats();
            showNotification('Data berhasil dihapus!', 'success');
        }
    }
});

function showDetailModal(row) {
    const data = {
        resi: row.dataset.id || row.cells[1].textContent.trim(),
        tanggal: row.cells[2].textContent.trim(),
        pelanggan: row.dataset.customer || row.cells[3].textContent.trim(),
        pengirim: row.dataset.sender || row.cells[4].textContent.trim(),
        penerima: row.dataset.receiver || row.cells[5].textContent.trim(),
        tujuan: row.dataset.city || row.cells[6].textContent.trim(),
        layanan: row.dataset.service || row.cells[7].textContent.trim(),
        berat: row.dataset.weight || row.cells[8].textContent.trim(),
        status: row.dataset.status || row.cells[9].querySelector('.status').textContent.trim()
    };
    
    const modal = document.getElementById('detailModal');
    const content = document.getElementById('detailContent');
    
    content.innerHTML = `
        <div class="detail-section">
            <h4><i class="fas fa-info-circle"></i> Informasi Pengiriman</h4>
            <div class="detail-grid">
                <div class="detail-item">
                    <span class="detail-label">No. Resi:</span>
                    <span class="detail-value">${data.resi}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Tanggal:</span>
                    <span class="detail-value">${data.tanggal}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Status:</span>
                    <span class="status ${data.status}">${data.status}</span>
                </div>
            </div>
        </div>
        <div class="detail-section">
            <h4><i class="fas fa-user"></i> Pelanggan & Pengirim</h4>
            <div class="detail-grid">
                <div class="detail-item">
                    <span class="detail-label">Pelanggan:</span>
                    <span class="detail-value">${data.pelanggan}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Pengirim:</span>
                    <span class="detail-value">${data.pengirim}</span>
                </div>
            </div>
        </div>
        <div class="detail-section">
            <h4><i class="fas fa-map-marker-alt"></i> Penerima & Tujuan</h4>
            <div class="detail-grid">
                <div class="detail-item">
                    <span class="detail-label">Penerima:</span>
                    <span class="detail-value">${data.penerima}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Tujuan:</span>
                    <span class="detail-value">${data.tujuan}</span>
                </div>
            </div>
        </div>
        <div class="detail-section">
            <h4><i class="fas fa-box"></i> Detail Pengiriman</h4>
            <div class="detail-grid">
                <div class="detail-item">
                    <span class="detail-label">Layanan:</span>
                    <span class="detail-value">${data.layanan}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Berat:</span>
                    <span class="detail-value">${data.berat}</span>
                </div>
            </div>
        </div>
    `;
    
    modal.style.opacity = '0';
    modal.style.transform = 'scale(0.8)';
    modal.classList.add('active');
    
    setTimeout(() => {
        modal.style.transition = 'all 0.3s ease';
        modal.style.opacity = '1';
        modal.style.transform = 'scale(1)';
    }, 10);
    
    // Close
    const closeBtn = modal.querySelector('.modal-close');
    const overlay = modal.querySelector('.modal-overlay');
    closeBtn.onclick = overlay.onclick = () => {
        modal.style.opacity = '0';
        modal.style.transform = 'scale(0.8)';
        setTimeout(() => modal.classList.remove('active'), 300);
    };
}

function showEditModal(row) {
    const data = {
        customer: row.dataset.customer || row.cells[3].textContent.trim(),
        sender: row.dataset.sender || row.cells[4].textContent.trim(),
        receiver: row.dataset.receiver || row.cells[5].textContent.trim(),
        city: row.dataset.city || row.cells[6].textContent.trim(),
        service: row.dataset.service || row.cells[7].textContent.trim(),
        weight: row.dataset.weight || row.cells[8].textContent.trim(),
        status: row.dataset.status || row.cells[9].textContent.trim()
    };
    
    let editModal = document.getElementById('editModal');
    if (!editModal) {
        editModal = createEditModal();
    }
    
    const form = editModal.querySelector('#editForm');
    form.customer.value = data.customer;
    form.sender.value = data.sender;
    form.receiver.value = data.receiver;
    form.city.value = data.city;
    form.service.value = data.service;
    form.weight.value = data.weight;
    form.status.value = data.status;
    
    editModal.style.opacity = '0';
    editModal.style.transform = 'scale(0.8)';
    editModal.classList.add('active');
    
    setTimeout(() => {
        editModal.style.transition = 'all 0.3s ease';
        editModal.style.opacity = '1';
        editModal.style.transform = 'scale(1)';
    }, 10);
    
    // Save
    const rowId = row.dataset.id || row.cells[1].textContent.trim();
    form.onsubmit = function(e) {
        e.preventDefault();
        
        // Simple validation
        if (!form.customer.value.trim()) {
            showNotification('Pelanggan harus diisi', 'error');
            return;
        }
        
        const updates = {
            customer: form.customer.value.trim(),
            sender: form.sender.value.trim(),
            receiver: form.receiver.value.trim(),
            city: form.city.value,
            service: form.service.value,
            weight: parseInt(form.weight.value),
            status: form.status.value
        };
        
        Data.update(rowId, updates);
        filteredData = Data.getAll();
        renderTable();
        updateStats();
        showNotification('Data berhasil diperbarui!', 'success');
        
        // Close
        editModal.style.opacity = '0';
        editModal.style.transform = 'scale(0.8)';
        setTimeout(() => editModal.classList.remove('active'), 300);
    };
    
    // Close
    const closeBtn = editModal.querySelector('.modal-close');
    const overlay = editModal.querySelector('.modal-overlay');
    closeBtn.onclick = overlay.onclick = () => {
        editModal.style.opacity = '0';
        editModal.style.transform = 'scale(0.8)';
        setTimeout(() => editModal.classList.remove('active'), 300);
    };
}

function createEditModal() {
    const modal = document.createElement('div');
    modal.id = 'editModal';
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-overlay"></div>
        <div class="modal-container">
            <div class="modal-header">
                <h2>Edit Pengiriman</h2>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <form id="editForm">
                    <div class="form-group">
                        <label>Pelanggan</label>
                        <input type="text" name="customer" required>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>Pengirim</label>
                            <input type="text" name="sender" required>
                        </div>
                        <div class="form-group">
                            <label>Penerima</label>
                            <input type="text" name="receiver" required>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>Tujuan</label>
                            <select name="city" required>
                                <option value="jakarta">Jakarta</option>
                                <option value="surabaya">Surabaya</option>
                                <option value="bandung">Bandung</option>
                                <option value="medan">Medan</option>
                                <option value="makassar">Makassar</option>
                                <option value="semarang">Semarang</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Layanan</label>
                            <select name="service" required>
                                <option value="regular">Regular</option>
                                <option value="express">Express</option>
                                <option value="cargo">Cargo</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>Berat (Kg)</label>
                            <input type="number" name="weight" min="1" required>
                        </div>
                        <div class="form-group">
                            <label>Status</label>
                            <select name="status" required>
                                <option value="pending">Pending</option>
                                <option value="shipping">Shipping</option>
                                <option value="delivered">Delivered</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn-secondary modal-cancel">Batal</button>
                <button type="submit" form="editForm" class="btn-primary">Simpan</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    return modal;
}



// Export button
document.getElementById('exportBtn').addEventListener('click', function() {
    showNotification('Data akan di-export ke Excel!', 'success');
});

// Helper functions
function formatDate(dateStr) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateStr).toLocaleDateString('id-ID', options);
}

function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function getStatusText(status) {
    const statusTexts = {
        'pending': 'Pending',
        'pickup': 'Pickup',
        'transit': 'Transit',
        'shipping': 'Shipping',
        'delivered': 'Delivered',
        'cancelled': 'Cancelled'
    };
    return statusTexts[status] || status;
}

// Notification
function showNotification(message, type) {
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();
    
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : '#ef4444'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        z-index: 10001;
        animation: slideInRight 0.3s ease;
    `;
    notification.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i> ${message}`;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease forwards';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight { from { opacity: 0; transform: translateX(100px); } to { opacity: 1; transform: translateX(0); } }
    @keyframes slideOutRight { from { opacity: 1; transform: translateX(0); } to { opacity: 0; transform: translateX(100px); } }
`;
document.head.appendChild(style);

console.log('BYULOGISTICS Pengiriman page loaded successfully!');

