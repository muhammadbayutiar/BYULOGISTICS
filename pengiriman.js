
/**
 * BYULOGISTICS - Pengiriman Page JavaScript
 */

// Sample shipment data
const shipmentsData = [
    {
        id: 1,
        resi: 'BYU-2024-001234',
        date: '2024-01-08',
        customer: 'PT Maju Jaya',
        sender: 'Budi Santoso',
        senderPhone: '081234567890',
        senderAddress: 'Jl. Sudirman No. 123, Jakarta',
        recipient: 'Ahmad Wijaya',
        recipientPhone: '081234567891',
        recipientAddress: 'Jl. Ahmad Yani No. 45, Surabaya',
        destination: 'Surabaya',
        service: 'Express',
        weight: 25,
        status: 'delivered',
        price: 350000
    },
    {
        id: 2,
        resi: 'BYU-2024-001235',
        date: '2024-01-08',
        customer: 'CV Berkah Logistik',
        sender: 'Siti Aminah',
        senderPhone: '081234567892',
        senderAddress: 'Jl. Thamrin No. 78, Jakarta',
        recipient: 'Budi Hermawan',
        recipientPhone: '081234567893',
        recipientAddress: 'Jl. Gatot Subroto No. 12, Jakarta',
        destination: 'Jakarta',
        service: 'Regular',
        weight: 15,
        status: 'shipping',
        price: 180000
    },
    {
        id: 3,
        resi: 'BYU-2024-001236',
        date: '2024-01-07',
        customer: 'Toko Online Sejahtera',
        sender: 'Toko Sejahtera',
        senderPhone: '081234567894',
        senderAddress: 'Jl. Braga No. 56, Bandung',
        recipient: 'Deni Kurniawan',
        recipientPhone: '081234567895',
        recipientAddress: 'Jl. Asia Afrika No. 23, Bandung',
        destination: 'Bandung',
        service: 'Express',
        weight: 8,
        status: 'pending',
        price: 120000
    },
    {
        id: 4,
        resi: 'BYU-2024-001237',
        date: '2024-01-07',
        customer: 'PT Indo Cargo',
        sender: 'PT Indo Cargo',
        senderPhone: '081234567896',
        senderAddress: 'Jl. Pemuda No. 34, Medan',
        recipient: 'Rina Susilowati',
        recipientPhone: '081234567897',
        recipientAddress: 'Jl. Diponegoro No. 78, Medan',
        destination: 'Medan',
        service: 'Cargo',
        weight: 150,
        status: 'delivered',
        price: 2500000
    },
    {
        id: 5,
        resi: 'BYU-2024-001238',
        date: '2024-01-06',
        customer: 'UD Sumber Rejeki',
        sender: 'H. Ahmad',
        senderPhone: '081234567898',
        senderAddress: 'Jl. Pettarani No. 90, Makassar',
        recipient: 'Hj. Siti',
        recipientPhone: '081234567899',
        recipientAddress: 'Jl. Rappocini No. 45, Makassar',
        destination: 'Makassar',
        service: 'Regular',
        weight: 45,
        status: 'transit',
        price: 550000
    },
    {
        id: 6,
        resi: 'BYU-2024-001239',
        date: '2024-01-06',
        customer: 'CV Maju Bersama',
        sender: 'Pak Mahmud',
        senderPhone: '081234567800',
        senderAddress: 'Jl. MT Haryono No. 67, Semarang',
        recipient: 'Ibu Dewi',
        recipientPhone: '081234567801',
        recipientAddress: 'Jl. Pandanaran No. 34, Semarang',
        destination: 'Semarang',
        service: 'Express',
        weight: 12,
        status: 'pickup',
        price: 150000
    },
    {
        id: 7,
        resi: 'BYU-2024-001240',
        date: '2024-01-05',
        customer: 'PT Logistik Nusantara',
        sender: 'PT Logistik Nusantara',
        senderPhone: '081234567802',
        senderAddress: 'Jl. Senen No. 45, Jakarta',
        recipient: 'Pak Hadi',
        recipientPhone: '081234567803',
        recipientAddress: 'Jl. Pemuda No. 78, Surabaya',
        destination: 'Surabaya',
        service: 'Cargo',
        weight: 200,
        status: 'delivered',
        price: 3200000
    },
    {
        id: 8,
        resi: 'BYU-2024-001241',
        date: '2024-01-05',
        customer: 'Toko Bangunan Jaya',
        sender: 'Toko Jaya',
        senderPhone: '081234567804',
        senderAddress: 'Jl. Dago No. 12, Bandung',
        recipient: 'Pak Udin',
        recipientPhone: '081234567805',
        recipientAddress: 'Jl. Setiabudi No. 56, Bandung',
        destination: 'Bandung',
        service: 'Regular',
        weight: 80,
        status: 'cancelled',
        price: 950000
    }
];

// Pagination variables
let currentPage = 1;
const itemsPerPage = 5;
let filteredData = [...shipmentsData];

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
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            sidebar.classList.toggle('active');
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
            showNotification('Pengiriman berhasil dibuat!', 'success');
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
        tr.innerHTML = `
            <td><input type="checkbox" class="row-checkbox"></td>
            <td class="resi-number">${item.resi}</td>
            <td>${formatDate(item.date)}</td>
            <td>${item.customer}</td>
            <td>${item.sender}</td>
            <td>${item.recipient}</td>
            <td>${capitalizeFirst(item.destination)}</td>
            <td>${capitalizeFirst(item.service)}</td>
            <td>${item.weight} kg</td>
            <td><span class="status-badge ${item.status}">${getStatusText(item.status)}</span></td>
            <td>
                <div class="action-buttons">
                    <button class="btn-action view" onclick="viewDetail(${item.id})" title="Lihat Detail">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-action edit" onclick="editShipment(${item.id})" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-action delete" onclick="deleteShipment(${item.id})" title="Hapus">
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
    document.getElementById('totalCount').textContent = filteredData.length;
    document.getElementById('pendingCount').textContent = filteredData.filter(d => d.status === 'pending').length;
    document.getElementById('transitCount').textContent = filteredData.filter(d => d.status === 'transit' || d.status === 'shipping').length;
    document.getElementById('deliveredCount').textContent = filteredData.filter(d => d.status === 'delivered').length;
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
        filteredData = shipmentsData.filter(function(item) {
            const statusMatch = !statusFilter.value || item.status === statusFilter.value;
            const dateMatch = !dateFilter.value || item.date === dateFilter.value;
            const cityMatch = !cityFilter.value || item.destination === cityFilter.value;
            const serviceMatch = !serviceFilter.value || item.service === serviceFilter.value;
            
            return statusMatch && dateMatch && cityMatch && serviceMatch;
        });
        
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
            filteredData = [...shipmentsData];
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
                filteredData = [...shipmentsData];
            } else {
                filteredData = shipmentsData.filter(function(item) {
                    return item.resi.toLowerCase().includes(searchTerm) ||
                           item.customer.toLowerCase().includes(searchTerm) ||
                           item.sender.toLowerCase().includes(searchTerm) ||
                           item.recipient.toLowerCase().includes(searchTerm) ||
                           item.destination.toLowerCase().includes(searchTerm);
                });
            }
            
            currentPage = 1;
            renderTable();
            updateStats();
        });
    }
}

// View detail
window.viewDetail = function(id) {
    const shipment = shipmentsData.find(s => s.id === id);
    if (!shipment) return;
    
    const modal = document.getElementById('detailModal');
    const content = document.getElementById('detailContent');
    
    content.innerHTML = `
        <div class="detail-section">
            <h4>Informasi Pengiriman</h4>
            <div class="detail-grid">
                <div class="detail-item">
                    <span class="detail-label">No. Resi</span>
                    <span class="detail-value">${shipment.resi}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Tanggal</span>
                    <span class="detail-value">${formatDate(shipment.date)}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Status</span>
                    <span class="status-badge ${shipment.status}">${getStatusText(shipment.status)}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Layanan</span>
                    <span class="detail-value">${capitalizeFirst(shipment.service)}</span>
                </div>
            </div>
        </div>
        
        <div class="detail-section">
            <h4>Informasi Pengirim</h4>
            <div class="detail-grid">
                <div class="detail-item">
                    <span class="detail-label">Nama</span>
                    <span class="detail-value">${shipment.sender}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Telepon</span>
                    <span class="detail-value">${shipment.senderPhone}</span>
                </div>
                <div class="detail-item" style="grid-column: span 2;">
                    <span class="detail-label">Alamat</span>
                    <span class="detail-value">${shipment.senderAddress}</span>
                </div>
            </div>
        </div>
        
        <div class="detail-section">
            <h4>Informasi Penerima</h4>
            <div class="detail-grid">
                <div class="detail-item">
                    <span class="detail-label">Nama</span>
                    <span class="detail-value">${shipment.recipient}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Telepon</span>
                    <span class="detail-value">${shipment.recipientPhone}</span>
                </div>
                <div class="detail-item" style="grid-column: span 2;">
                    <span class="detail-label">Alamat</span>
                    <span class="detail-value">${shipment.recipientAddress}</span>
                </div>
            </div>
        </div>
        
        <div class="detail-section">
            <h4>Detail Barang</h4>
            <div class="detail-grid">
                <div class="detail-item">
                    <span class="detail-label">Berat</span>
                    <span class="detail-value">${shipment.weight} kg</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Biaya</span>
                    <span class="detail-value">Rp ${shipment.price.toLocaleString('id-ID')}</span>
                </div>
            </div>
        </div>
        
        <div class="detail-section">
            <h4>Tracking History</h4>
            <div class="timeline">
                <div class="timeline-item completed">
                    <div class="timeline-dot"></div>
                    <div class="timeline-content">
                        <h5>Pengiriman Dibuat</h5>
                        <p>Resi dicetak dan siap diambil</p>
                        <span class="timeline-time">${formatDate(shipment.date)} 08:00</span>
                    </div>
                </div>
                ${shipment.status !== 'pending' ? `
                <div class="timeline-item ${shipment.status === 'pickup' ? 'current' : 'completed'}">
                    <div class="timeline-dot"></div>
                    <div class="timeline-content">
                        <h5>Pickup</h5>
                        <p>Barang diambil dari pengirim</p>
                        <span class="timeline-time">${formatDate(shipment.date)} 10:30</span>
                    </div>
                </div>
                ` : ''}
                ${['transit', 'shipping', 'delivered'].includes(shipment.status) ? `
                <div class="timeline-item ${shipment.status === 'transit' || shipment.status === 'shipping' ? 'current' : 'completed'}">
                    <div class="timeline-dot"></div>
                    <div class="timeline-content">
                        <h5>Transit</h5>
                        <p>Barang dalam perjalanan</p>
                        <span class="timeline-time">${formatDate(shipment.date)} 14:00</span>
                    </div>
                </div>
                ` : ''}
                ${shipment.status === 'delivered' ? `
                <div class="timeline-item current">
                    <div class="timeline-dot"></div>
                    <div class="timeline-content">
                        <h5>Delivered</h5>
                        <p>Barang telah diterima</p>
                        <span class="timeline-time">${formatDate(shipment.date)} 16:45</span>
                    </div>
                </div>
                ` : ''}
            </div>
        </div>
    `;
    
    modal.classList.add('active');
    
    // Close modal
    const modalClose = modal.querySelector('.modal-close');
    const modalOverlay = modal.querySelector('.modal-overlay');
    
    modalClose.onclick = () => modal.classList.remove('active');
    modalOverlay.onclick = () => modal.classList.remove('active');
};

// Edit shipment
window.editShipment = function(id) {
    showNotification('Fitur edit akan segera tersedia!', 'success');
};

// Delete shipment
window.deleteShipment = function(id) {
    if (confirm('Apakah Anda yakin ingin menghapus pengiriman ini?')) {
        const index = shipmentsData.findIndex(s => s.id === id);
        if (index > -1) {
            shipmentsData.splice(index, 1);
            filteredData = [...shipmentsData];
            renderTable();
            updateStats();
            showNotification('Pengiriman berhasil dihapus!', 'success');
        }
    }
};

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

