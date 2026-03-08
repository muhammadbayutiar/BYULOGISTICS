
/**
 * BYULOGISTICS - Customer Dashboard JavaScript
 */

document.addEventListener('DOMContentLoaded', function() {
    initSidebar();
    initDate();
    initTracking();
    initMenuItems();
    initLogout();
    initKirimModal();
    checkAuth();
});

/**
 * Check if user is logged in
 */
function checkAuth() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const userRole = localStorage.getItem('userRole');
    
    if (!isLoggedIn || userRole !== 'customer') {
        // Not logged in as customer, redirect to login
        window.location.href = 'login.html';
    }
}

/**
 * Initialize sidebar toggle
 */
function initSidebar() {
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    
    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', function() {
            sidebar.classList.toggle('active');
        });
        
        // Close sidebar when clicking outside
        document.addEventListener('click', function(e) {
            if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
                sidebar.classList.remove('active');
            }
        });
    }
}

/**
 * Display current date
 */
function initDate() {
    const dateElement = document.getElementById('currentDate');
    if (dateElement) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const today = new Date();
        dateElement.textContent = today.toLocaleDateString('id-ID', options);
    }
}

/**
 * Initialize tracking functionality
 */
function initTracking() {
    const trackingInput = document.getElementById('trackingInput');
    const btnLacak = document.getElementById('btnLacak');
    const trackingResult = document.getElementById('trackingResult');
    
    if (btnLacak && trackingInput) {
        btnLacak.addEventListener('click', function() {
            const resi = trackingInput.value.trim();
            if (resi) {
                // Show loading
                trackingResult.style.display = 'block';
                trackingResult.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i> Mencari paket...</div>';
                
                // Simulate API call
                setTimeout(function() {
                    // Show result
                    trackingResult.innerHTML = `
                        <div class="package-info">
                            <div class="package-header">
                                <span class="resi-number">${resi}</span>
                                <span class="status-badge shipping">Dalam Pengiriman</span>
                            </div>
                            <div class="package-details">
                                <p><strong>Dikirim ke:</strong> Surabaya, Jawa Timur</p>
                                <p><strong>Tanggal:</strong> ${new Date().toLocaleDateString('id-ID')}</p>
                            </div>
                        </div>
                        <div class="tracking-timeline">
                            <div class="timeline-item completed">
                                <div class="timeline-dot"></div>
                                <div class="timeline-content">
                                    <h4>Paket Diterima Kurir</h4>
                                    <p>Jakarta, ${new Date().toLocaleDateString('id-ID')} - 08:00</p>
                                </div>
                            </div>
                            <div class="timeline-item completed">
                                <div class="timeline-dot"></div>
                                <div class="timeline-content">
                                    <h4>Paket Dikirim</h4>
                                    <p>Jakarta, ${new Date().toLocaleDateString('id-ID')} - 10:00</p>
                                </div>
                            </div>
                            <div class="timeline-item">
                                <div class="timeline-dot"></div>
                                <div class="timeline-content">
                                    <h4>Dalam Perjalanan</h4>
                                    <p>Estimasi tiba besok</p>
                                </div>
                            </div>
                        </div>
                    `;
                }, 1500);
            } else {
                alert('Masukkan nomor resi terlebih dahulu!');
            }
        });
        
        // Enter key to track
        trackingInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                btnLacak.click();
            }
        });
    }
}

/**
 * Initialize menu items
 */
function initMenuItems() {
    const menuItems = document.querySelectorAll('.menu-item');
    const quickLinks = document.querySelectorAll('[data-page]');
    
    menuItems.forEach(function(item) {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all
            menuItems.forEach(function(mi) {
                mi.classList.remove('active');
            });
            
            // Add active to clicked
            this.classList.add('active');
            
            // Get page name
            const page = this.getAttribute('data-page');
            showPage(page);
        });
    });
    
    quickLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const page = this.getAttribute('data-page');
            showPage(page);
        });
    });
}

/**
 * Show specific page/section
 */
function showPage(page) {
    // This would normally show/hide sections
    // For demo, we'll just show alerts
    console.log('Navigating to:', page);
    
    // In a full implementation, you would have:
    // - Dashboard section
    // - Lacak Paket section
    // - Riwayat Pengiriman section
    // - Kirim Paket section
    // - Alamat Favorit section
    // - Profil Saya section
}

/**
 * Initialize logout
 */
function initLogout() {
    const logoutBtn = document.getElementById('logoutBtn');
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Clear localStorage
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('userEmail');
            localStorage.removeItem('userRole');
            
            // Redirect to login
            window.location.href = 'login.html';
        });
    }
}

/**
 * Load shipment data
 */
function loadShipmentData() {
    // Simulated data - in real app, this would come from API
    const data = {
        total: 12,
        dalamPengiriman: 3,
        terkirim: 8
    };
    
    const totalEl = document.getElementById('totalPengiriman');
    const dalamEl = document.getElementById('dalamPengiriman');
    const terkirimEl = document.getElementById('terkirim');
    
    if (totalEl) totalEl.textContent = data.total;
    if (dalamEl) dalamEl.textContent = data.dalamPengiriman;
    if (terkirimEl) terkirimEl.textContent = data.terkirim;
}

// Load data on page load
loadShipmentData();

/**
 * Initialize Kirim Paket Modal
 */
function initKirimModal() {
    const modal = document.getElementById('kirimModal');
    const openButtons = document.querySelectorAll('[data-page="kirim"]');
    const closeBtn = document.getElementById('closeKirimModal');
    const overlay = document.querySelector('.modal-overlay');
    const cancelBtn = document.getElementById('batalKirim');
    const form = document.getElementById('kirimForm');
    const optionJemput = document.getElementById('optionJemput');
    const optionAntar = document.getElementById('optionAntar');
    
    // Open modal
    openButtons.forEach(function(btn) {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            if (modal) {
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });
    
    // Close modal functions
    function closeModal() {
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
            if (form) form.reset();
        }
    }
    
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }
    
    if (overlay) {
        overlay.addEventListener('click', closeModal);
    }
    
    if (cancelBtn) {
        cancelBtn.addEventListener('click', closeModal);
    }
    
    // Jenis pengiriman toggle
    if (optionJemput && optionAntar) {
        optionJemput.addEventListener('click', function() {
            optionJemput.classList.add('active');
            optionAntar.classList.remove('active');
        });
        
        optionAntar.addEventListener('click', function() {
            optionAntar.classList.add('active');
            optionJemput.classList.remove('active');
        });
    }
    
    // Form submit
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const jenisLayanan = document.getElementById('jenisLayanan').value;
            const beratBarang = document.getElementById('beratBarang').value;
            const namaBarang = document.getElementById('namaBarang').value;
            const namaPenerima = document.getElementById('namaPenerima').value;
            const teleponPenerima = document.getElementById('teleponPenerima').value;
            const alamatPenerima = document.getElementById('alamatPenerima').value;
            
            const jenisPengiriman = optionJemput.classList.contains('active') ? 'Jemput' : 'Antar ke Gudang';
            
            // Generate resi number
            const resi = 'BYU-' + Date.now();
            
            // Simpan ke localStorage
            const pengirimanBaru = {
                resi: resi,
                layanan: jenisLayanan,
                berat: beratBarang,
                barang: namaBarang,
                penerima: namaPenerima,
                telepon: teleponPenerima,
                alamat: alamatPenerima,
                jenis: jenisPengiriman,
                status: 'Menunggu Penjemputan',
                tanggal: new Date().toLocaleDateString('id-ID')
            };
            
            // Ambil data existing
            let allPengiriman = JSON.parse(localStorage.getItem('pengiriman') || '[]');
            allPengiriman.push(pengirimanBaru);
            localStorage.setItem('pengiriman', JSON.stringify(allPengiriman));
            
            // Show success
            alert('Permintaan pengiriman berhasil!\n\nNo. Resi: ' + resi + '\nJenis: ' + jenisPengiriman + '\n\nTim kami akan ' + (jenisPengiriman === 'Jemput' ? 'menjemput paket Anda' : 'mengunggu di gudang') + '. Terima kasih!');
            
            closeModal();
            
            // Refresh stats
            loadShipmentData();
        });
    }
}

console.log('BYULOGISTICS - Customer Dashboard initialized!');


