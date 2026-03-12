/**
 * BYULOGISTICS - Shared Data Module (Mock API)
 * LocalStorage-based data management for shipments
 */

class LogisticsData {
    constructor() {
        this.STORAGE_KEY = 'byulogistics_shipments';
        this.initData();
    }

    // Initialize with mock data if empty
    initData() {
        if (!localStorage.getItem(this.STORAGE_KEY)) {
            this.shipments = [
                {
                    id: 'BYU-2024-001234',
                    date: '2024-01-08',
                    customer: 'PT Maju Jaya',
                    sender: 'Budi Santoso',
                    senderPhone: '08123456789',
                    senderAddress: 'Jl. Merdeka 123, Jakarta',
                    receiver: 'Sari Wijaya',
                    receiverPhone: '08987654321',
                    receiverAddress: 'Jl. Sudirman 456, Surabaya',
                    city: 'Surabaya',
                    service: 'Express',
                    weight: 15,
                    itemType: 'Elektronik',
                    status: 'delivered',
                    notes: '',
                    createdAt: new Date().toISOString()
                },
                {
                    id: 'BYU-2024-001235',
                    date: '2024-01-08',
                    customer: 'CV Berkah Logistik',
                    sender: 'Ahmad Kurniawan',
                    senderPhone: '08765432109',
                    senderAddress: 'Jl. Gatot Subroto 789, Jakarta',
                    receiver: 'Dewi Lestari',
                    receiverPhone: '08567891234',
                    receiverAddress: 'Jl. Pasteur 321, Bandung',
                    city: 'Bandung',
                    service: 'Regular',
                    weight: 25,
                    itemType: 'Pakaian',
                    status: 'shipping',
                    notes: 'Fragile',
                    createdAt: new Date().toISOString()
                },
                {
                    id: 'BYU-2024-001236',
                    date: '2024-01-07',
                    customer: 'Toko Online Sejahtera',
                    sender: 'Rina Permata',
                    senderPhone: '08234567890',
                    senderAddress: 'Jl. Thamrin 456, Jakarta',
                    receiver: 'Eko Prasetyo',
                    receiverPhone: '08891234567',
                    receiverAddress: 'Jl. Sisingamangaraja 789, Medan',
                    city: 'Medan',
                    service: 'Cargo',
                    weight: 150,
                    itemType: 'Furniture',
                    status: 'pending',
                    notes: '',
                    createdAt: new Date().toISOString()
                }
                // Add more mock data...
            ];
            this.save();
        } else {
            this.load();
        }
    }

    load() {
        const data = localStorage.getItem(this.STORAGE_KEY);
        this.shipments = JSON.parse(data) || [];
    }

    save() {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.shipments));
    }

    getAll() {
        return this.shipments;
    }

    getById(id) {
        return this.shipments.find(s => s.id === id);
    }

    getFiltered(filters = {}) {
        let result = this.shipments;

        if (filters.status) {
            result = result.filter(s => s.status === filters.status);
        }
        if (filters.city) {
            result = result.filter(s => s.city.toLowerCase() === filters.city.toLowerCase());
        }
        if (filters.service) {
            result = result.filter(s => s.service === filters.service);
        }
        if (filters.date) {
            result = result.filter(s => s.date === filters.date);
        }

        return result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    create(shipment) {
        shipment.id = 'BYU-2024-' + String(Date.now()).slice(-6);
        shipment.createdAt = new Date().toISOString();
        shipment.status = 'pending';
        this.shipments.unshift(shipment);
        this.save();
        return shipment;
    }

    update(id, updates) {
        const index = this.shipments.findIndex(s => s.id === id);
        if (index !== -1) {
            this.shipments[index] = { ...this.shipments[index], ...updates };
            this.save();
            return true;
        }
        return false;
    }

    delete(id) {
        this.shipments = this.shipments.filter(s => s.id !== id);
        this.save();
    }

    getStats() {
        const data = this.getAll();
        return {
            total: data.length,
            pending: data.filter(s => s.status === 'pending').length,
            shipping: data.filter(s => s.status === 'shipping').length,
            delivered: data.filter(s => s.status === 'delivered').length,
            cities: [...new Set(data.map(s => s.city))].length
        };
    }
}

// Global instance
const Data = new LogisticsData();

console.log('BYULOGISTICS Data module loaded. Initial shipments:', Data.getAll().length);

