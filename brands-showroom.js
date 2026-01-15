/**
 * BRANDS SHOWROOM - JavaScript
 * Unified brand showroom functionality
 */

class BrandsShowroom {
    constructor() {
        this.compareList = [];
        this.brandData = {};
        this.selectedCategory = 'all';
        this.init();
    }

    init() {
        this.loadBrandData();
        this.setupEventListeners();
        this.setupCategoryFiltering();
        this.setupSearch();
        this.setupPreloader();
        this.loadCompareList();
    }

    // Load brand data
    loadBrandData() {
        this.brandData = {
            bmw: {
                name: 'BMW',
                logo: 'assets/images/logos/bmw.png',
                color: '#0066B3',
                tagline: 'The Ultimate Driving Machine',
                description: 'German luxury automotive brand known for performance, luxury, and innovative technology.',
                models: 28,
                priceRange: 'KSh 3.5M - 45M',
                features: ['Performance', 'Luxury', 'Technology', 'Driving Dynamics'],
                categories: ['premium', 'german', 'luxury'],
                popularModels: ['3 Series', '5 Series', 'X5', 'M3', 'M5']
            },
            toyota: {
                name: 'Toyota',
                logo: 'assets/images/logos/toyota.png',
                color: '#EB0A1E',
                tagline: 'Reliability Redefined',
                description: 'Japanese automotive manufacturer known for reliability, fuel efficiency, and durability.',
                models: 45,
                priceRange: 'KSh 1.2M - 25M',
                features: ['Reliable', 'Fuel Efficient', 'Durable', 'Low Maintenance'],
                categories: ['japanese', 'budget', 'suv'],
                popularModels: ['Land Cruiser', 'Prado', 'Hilux', 'RAV4', 'Corolla']
            },
            mercedes: {
                name: 'Mercedes-Benz',
                logo: 'assets/images/logos/mercedes.png',
                color: '#00A0E3',
                tagline: 'The Best or Nothing',
                description: 'German luxury vehicle brand known for premium quality, comfort, and advanced technology.',
                models: 32,
                priceRange: 'KSh 4.2M - 60M',
                features: ['Luxury', 'Comfort', 'Prestige', 'Safety'],
                categories: ['luxury', 'german', 'premium'],
                popularModels: ['C-Class', 'E-Class', 'S-Class', 'GLE', 'G-Wagon']
            },
            // Add other brands similarly...
        };
    }

    // Setup event listeners
    setupEventListeners() {
        // Category tabs
        document.querySelectorAll('.category-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const category = e.target.dataset.category;
                this.filterByCategory(category);
            });
        });

        // Brand view buttons
        document.addEventListener('click', (e) => {
            if (e.target.closest('.btn-view')) {
                const brandCard = e.target.closest('.brand-card');
                if (brandCard) {
                    const brandClass = Array.from(brandCard.classList)
                        .find(cls => cls !== 'brand-card');
                    this.showBrandModal(brandClass);
                }
            }

            if (e.target.closest('.btn-compare')) {
                const brandCard = e.target.closest('.brand-card');
                if (brandCard) {
                    const brandClass = Array.from(brandCard.classList)
                        .find(cls => cls !== 'brand-card');
                    this.addToCompare(brandClass);
                }
            }

            if (e.target.closest('.other-brand')) {
                const brandName = e.target.closest('.other-brand').onclick
                    .toString().match(/viewBrand\('(.*?)'\)/)[1];
                this.showBrandModal(brandName);
            }
        });
    }

    // Setup category filtering
    setupCategoryFiltering() {
        this.filterByCategory('all');
    }

    // Filter brands by category
    filterByCategory(category) {
        this.selectedCategory = category;
        
        // Update active tab
        document.querySelectorAll('.category-tab').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.category === category);
        });

        // Filter brand cards
        document.querySelectorAll('.brand-card').forEach(card => {
            const categories = card.dataset.category.split(',');
            
            if (category === 'all' || categories.includes(category)) {
                card.style.display = 'block';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 100);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
    }

    // Setup search functionality
    setupSearch() {
        const searchInput = document.getElementById('brandSearch');
        if (!searchInput) return;

        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase().trim();
            this.searchBrands(searchTerm);
        });
    }

    // Search brands
    searchBrands(searchTerm) {
        if (!searchTerm) {
            // Show all if search is empty
            document.querySelectorAll('.brand-card, .other-brand').forEach(element => {
                element.style.display = 'block';
            });
            return;
        }

        document.querySelectorAll('.brand-card').forEach(card => {
            const brandName = card.querySelector('.brand-name').textContent.toLowerCase();
            const brandTagline = card.querySelector('.brand-tagline').textContent.toLowerCase();
            const brandFeatures = Array.from(card.querySelectorAll('.feature'))
                .map(f => f.textContent.toLowerCase())
                .join(' ');

            if (brandName.includes(searchTerm) || 
                brandTagline.includes(searchTerm) || 
                brandFeatures.includes(searchTerm)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });

        document.querySelectorAll('.other-brand').forEach(brand => {
            const brandName = brand.querySelector('.other-brand-name').textContent.toLowerCase();
            
            if (brandName.includes(searchTerm)) {
                brand.style.display = 'block';
            } else {
                brand.style.display = 'none';
            }
        });
    }

    // Setup preloader
    setupPreloader() {
        window.addEventListener('load', () => {
            setTimeout(() => {
                document.querySelector('.brands-preloader').classList.add('loaded');
                setTimeout(() => {
                    document.querySelector('.brands-preloader').style.display = 'none';
                }, 500);
            }, 1000);
        });
    }

    // Show brand modal
    showBrandModal(brandId) {
        const brand = this.brandData[brandId] || this.getDefaultBrandData(brandId);
        
        const modal = document.getElementById('brandModal');
        const modalTitle = document.getElementById('modalTitle');
        const modalBody = document.getElementById('modalBody');

        if (!modal || !modalTitle || !modalBody) return;

        modalTitle.textContent = `${brand.name} Details`;
        
        modalBody.innerHTML = `
            <div class="modal-brand-header" style="border-left-color: ${brand.color}">
                <div class="modal-brand-logo">
                    <img src="${brand.logo}" alt="${brand.name}">
                </div>
                <div class="modal-brand-info">
                    <h4>${brand.name}</h4>
                    <p class="modal-brand-tagline">${brand.tagline}</p>
                </div>
            </div>

            <div class="modal-brand-content">
                <p class="modal-brand-description">${brand.description}</p>
                
                <div class="modal-brand-stats">
                    <div class="modal-stat">
                        <i class="fas fa-car"></i>
                        <div class="modal-stat-value">${brand.models}</div>
                        <div class="modal-stat-label">Models Available</div>
                    </div>
                    <div class="modal-stat">
                        <i class="fas fa-tag"></i>
                        <div class="modal-stat-value">${brand.priceRange}</div>
                        <div class="modal-stat-label">Price Range</div>
                    </div>
                </div>

                <div class="modal-brand-features">
                    <h5>Key Features:</h5>
                    <div class="modal-features-list">
                        ${brand.features.map(feature => `
                            <span class="modal-feature">${feature}</span>
                        `).join('')}
                    </div>
                </div>

                <div class="modal-popular-models">
                    <h5>Popular Models:</h5>
                    <div class="modal-models-list">
                        ${brand.popularModels.map(model => `
                            <div class="modal-model">${model}</div>
                        `).join('')}
                    </div>
                </div>

                <div class="modal-actions">
                    <button class="modal-btn whatsapp-btn" onclick="sendWhatsAppEnquiry('${brand.name}')">
                        <i class="fab fa-whatsapp"></i>
                        Enquire on WhatsApp
                    </button>
                    <button class="modal-btn compare-btn" onclick="addToCompare('${brandId}')">
                        <i class="fas fa-balance-scale"></i>
                        Add to Compare
                    </button>
                </div>
            </div>
        `;

        modal.classList.add('active');
    }

    // Get default brand data
    getDefaultBrandData(brandId) {
        const brandNames = {
            'volvo': 'Volvo',
            'mazda': 'Mazda',
            'suzuki': 'Suzuki',
            'hyundai': 'Hyundai',
            'kia': 'Kia',
            'honda': 'Honda',
            'isuzu': 'Isuzu',
            'land-rover': 'Land Rover',
            'mini': 'MINI',
            'tesla': 'Tesla',
            'volkswagen': 'Volkswagen',
            'chevrolet': 'Chevrolet'
        };

        return {
            name: brandNames[brandId] || brandId,
            logo: `assets/images/logos/${brandId}.png`,
            color: '#0066B3',
            tagline: 'Premium Automotive Brand',
            description: `Explore ${brandNames[brandId] || brandId} vehicles at Frank Auto Deals. Premium quality and exceptional performance.`,
            models: 12,
            priceRange: 'KSh 2.5M - 25M',
            features: ['Quality', 'Performance', 'Reliability', 'Value'],
            categories: ['premium'],
            popularModels: ['Model A', 'Model B', 'Model C', 'Model D']
        };
    }

    // Close modal
    closeModal() {
        document.getElementById('brandModal').classList.remove('active');
    }

    // Add brand to compare list
    addToCompare(brandId) {
        if (this.compareList.includes(brandId)) {
            this.showMessage(`${this.brandData[brandId]?.name || brandId} is already in compare list`, 'warning');
            return;
        }

        this.compareList.push(brandId);
        this.saveCompareList();
        this.updateCompareUI();
        this.showMessage(`${this.brandData[brandId]?.name || brandId} added to compare list`, 'success');
    }

    // Remove brand from compare list
    removeFromCompare(brandId) {
        this.compareList = this.compareList.filter(id => id !== brandId);
        this.saveCompareList();
        this.updateCompareUI();
    }

    // Save compare list to localStorage
    saveCompareList() {
        localStorage.setItem('brandsCompareList', JSON.stringify(this.compareList));
    }

    // Load compare list from localStorage
    loadCompareList() {
        const saved = localStorage.getItem('brandsCompareList');
        if (saved) {
            this.compareList = JSON.parse(saved);
            this.updateCompareUI();
        }
    }

    // Update compare UI
    updateCompareUI() {
        const compareContainer = document.getElementById('compareContainer');
        if (!compareContainer) return;

        if (this.compareList.length === 0) {
            compareContainer.innerHTML = `
                <div class="compare-empty">
                    <i class="fas fa-balance-scale"></i>
                    <h3>No Brands Selected</h3>
                    <p>Click "COMPARE" on brand cards to add them here</p>
                </div>
            `;
            return;
        }

        compareContainer.innerHTML = `
            <div class="compare-items">
                ${this.compareList.map(brandId => {
                    const brand = this.brandData[brandId] || this.getDefaultBrandData(brandId);
                    return `
                        <div class="compare-item">
                            <div class="compare-item-header">
                                <img src="${brand.logo}" alt="${brand.name}" class="compare-logo">
                                <h4>${brand.name}</h4>
                                <button class="compare-remove" onclick="removeFromCompare('${brandId}')">
                                    <i class="fas fa-times"></i>
                                </button>
                            </div>
                            <div class="compare-item-details">
                                <div class="compare-detail">
                                    <span>Models:</span>
                                    <strong>${brand.models}</strong>
                                </div>
                                <div class="compare-detail">
                                    <span>Price:</span>
                                    <strong>${brand.priceRange}</strong>
                                </div>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    }

    // Show comparison
    showComparison() {
        if (this.compareList.length < 2) {
            this.showMessage('Please select at least 2 brands to compare', 'warning');
            return;
        }

        const brands = this.compareList.map(id => this.brandData[id] || this.getDefaultBrandData(id));
        
        const modal = document.getElementById('brandModal');
        const modalTitle = document.getElementById('modalTitle');
        const modalBody = document.getElementById('modalBody');

        modalTitle.textContent = 'Brand Comparison';
        modalBody.innerHTML = `
            <div class="comparison-table">
                <table>
                    <thead>
                        <tr>
                            <th>Feature</th>
                            ${brands.map(brand => `<th>${brand.name}</th>`).join('')}
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Tagline</td>
                            ${brands.map(brand => `<td>${brand.tagline}</td>`).join('')}
                        </tr>
                        <tr>
                            <td>Models Available</td>
                            ${brands.map(brand => `<td>${brand.models}</td>`).join('')}
                        </tr>
                        <tr>
                            <td>Price Range</td>
                            ${brands.map(brand => `<td>${brand.priceRange}</td>`).join('')}
                        </tr>
                        <tr>
                            <td>Key Features</td>
                            ${brands.map(brand => `
                                <td>
                                    ${brand.features.map(f => `<span class="feature-chip">${f}</span>`).join('')}
                                </td>
                            `).join('')}
                        </tr>
                        <tr>
                            <td>Popular Models</td>
                            ${brands.map(brand => `
                                <td>
                                    ${brand.popularModels.slice(0, 3).map(m => `<div class="model-name">${m}</div>`).join('')}
                                </td>
                            `).join('')}
                        </tr>
                    </tbody>
                </table>
            </div>
            
            <div class="comparison-actions">
                <button class="modal-btn" onclick="clearCompare()">
                    <i class="fas fa-trash"></i>
                    Clear Comparison
                </button>
                <button class="modal-btn whatsapp-btn" onclick="sendWhatsAppComparison(${JSON.stringify(brands.map(b => b.name))})">
                    <i class="fab fa-whatsapp"></i>
                    Share Comparison
                </button>
            </div>
        `;

        modal.classList.add('active');
    }

    // Clear compare list
    clearCompare() {
        this.compareList = [];
        this.saveCompareList();
        this.updateCompareUI();
        this.showMessage('Comparison cleared', 'info');
        this.closeModal();
    }

    // Show message
    showMessage(text, type = 'info') {
        const message = document.createElement('div');
        message.className = `brand-message ${type}`;
        message.textContent = text;
        message.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 25px;
            background: ${type === 'success' ? '#00FF9D' : type === 'warning' ? '#FFD700' : type === 'error' ? '#FF003C' : '#00F3FF'};
            color: #000;
            border-radius: 10px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.2);
            z-index: 1000;
            animation: slideInRight 0.3s ease;
        `;

        document.body.appendChild(message);

        setTimeout(() => {
            message.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => message.remove(), 300);
        }, 3000);
    }

    // Send WhatsApp enquiry
    sendWhatsAppEnquiry(brandName) {
        const phone = '254742436155';
        const message = encodeURIComponent(
            `🚗 *BRAND ENQUIRY - Frank Auto Deals*\n\n` +
            `*Brand:* ${brandName}\n` +
            `*Interested In:* Vehicles from ${brandName}\n\n` +
            `Hello, I'm interested in ${brandName} vehicles. Please send me:\n` +
            `• Available models\n` +
            `• Prices\n` +
            `• Specifications\n` +
            `• Test drive options`
        );
        
        window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
        this.closeModal();
    }

    // Send WhatsApp comparison
    sendWhatsAppComparison(brandNames) {
        const phone = '254742436155';
        const message = encodeURIComponent(
            `⚖️ *BRAND COMPARISON REQUEST - Frank Auto Deals*\n\n` +
            `*Brands to Compare:* ${brandNames.join(', ')}\n\n` +
            `Please help me compare these brands:\n` +
            `• Price differences\n` +
            `• Features comparison\n` +
            `• Maintenance costs\n` +
            `• Resale value\n` +
            `• Best models for my needs`
        );
        
        window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
        this.closeModal();
    }
}

// Initialize Brands Showroom
document.addEventListener('DOMContentLoaded', () => {
    const brandsShowroom = new BrandsShowroom();
    window.BrandsShowroom = brandsShowroom;
    
    // Global functions for onclick handlers
    window.viewBrand = (brandId) => brandsShowroom.showBrandModal(brandId);
    window.addToCompare = (brandId) => brandsShowroom.addToCompare(brandId);
    window.removeFromCompare = (brandId) => brandsShowroom.removeFromCompare(brandId);
    window.clearCompare = () => brandsShowroom.clearCompare();
    window.showComparison = () => brandsShowroom.showComparison();
    window.closeModal = () => brandsShowroom.closeModal();
    window.sendWhatsAppEnquiry = (brandName) => brandsShowroom.sendWhatsAppEnquiry(brandName);
    window.sendWhatsAppComparison = (brandNames) => brandsShowroom.sendWhatsAppComparison(brandNames);
});

// Add CSS animations
const brandsStyles = document.createElement('style');
brandsStyles.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    .modal-brand-header {
        display: flex;
        align-items: center;
        gap: 20px;
        padding-bottom: 20px;
        margin-bottom: 20px;
        border-bottom: 1px solid rgba(255,255,255,0.1);
        border-left: 4px solid #0066B3;
        padding-left: 15px;
    }
    
    .modal-brand-logo {
        width: 80px;
        height: 80px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(255,255,255,0.1);
        border-radius: 10px;
        padding: 15px;
    }
    
    .modal-brand-logo img {
        max-width: 100%;
        max-height: 100%;
    }
    
    .modal-brand-tagline {
        font-style: italic;
        opacity: 0.8;
        margin-top: 5px;
    }
    
    .modal-brand-stats {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 20px;
        margin: 25px 0;
    }
    
    .modal-stat {
        background: rgba(255,255,255,0.05);
        padding: 20px;
        border-radius: 10px;
        text-align: center;
    }
    
    .modal-stat i {
        font-size: 24px;
        color: #00F3FF;
        margin-bottom: 10px;
    }
    
    .modal-stat-value {
        font-size: 24px;
        font-weight: bold;
        margin: 5px 0;
    }
    
    .modal-stat-label {
        font-size: 12px;
        opacity: 0.8;
        text-transform: uppercase;
        letter-spacing: 1px;
    }
    
    .modal-brand-features,
    .modal-popular-models {
        margin: 25px 0;
    }
    
    .modal-brand-features h5,
    .modal-popular-models h5 {
        margin-bottom: 15px;
        color: #00F3FF;
    }
    
    .modal-features-list {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
    }
    
    .modal-feature {
        padding: 8px 15px;
        background: rgba(0, 243, 255, 0.1);
        border: 1px solid #00F3FF;
        border-radius: 20px;
        font-size: 14px;
    }
    
    .modal-models-list {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
        gap: 10px;
    }
    
    .modal-model {
        padding: 12px;
        background: rgba(255,255,255,0.05);
        border-radius: 8px;
        text-align: center;
        font-size: 14px;
    }
    
    .modal-actions {
        display: flex;
        gap: 15px;
        margin-top: 30px;
    }
    
    .modal-btn {
        flex: 1;
        padding: 15px;
        border: none;
        border-radius: 8px;
        font-weight: 600;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        transition: all 0.3s ease;
    }
    
    .modal-btn.whatsapp-btn {
        background: #25D366;
        color: white;
    }
    
    .modal-btn.whatsapp-btn:hover {
        background: #1da851;
    }
    
    .modal-btn.compare-btn {
        background: rgba(255,255,255,0.1);
        color: white;
        border: 1px solid rgba(255,255,255,0.3);
    }
    
    .modal-btn.compare-btn:hover {
        background: rgba(255,255,255,0.2);
        border-color: #00F3FF;
    }
    
    .compare-items {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 20px;
        width: 100%;
    }
    
    .compare-item {
        background: rgba(255,255,255,0.05);
        border-radius: 10px;
        padding: 20px;
        border: 1px solid rgba(0, 243, 255, 0.2);
    }
    
    .compare-item-header {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 15px;
        position: relative;
    }
    
    .compare-logo {
        width: 40px;
        height: 40px;
        object-fit: contain;
    }
    
    .compare-item-header h4 {
        flex: 1;
        font-size: 16px;
    }
    
    .compare-remove {
        background: rgba(255,0,60,0.2);
        border: 1px solid #FF003C;
        color: #FF003C;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .compare-remove:hover {
        background: rgba(255,0,60,0.3);
        transform: scale(1.1);
    }
    
    .compare-item-details {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }
    
    .compare-detail {
        display: flex;
        justify-content: space-between;
        font-size: 14px;
    }
    
    .comparison-table {
        overflow-x: auto;
    }
    
    .comparison-table table {
        width: 100%;
        border-collapse: collapse;
    }
    
    .comparison-table th {
        background: rgba(0, 243, 255, 0.1);
        padding: 15px;
        text-align: left;
        border-bottom: 2px solid #00F3FF;
    }
    
    .comparison-table td {
        padding: 15px;
        border-bottom: 1px solid rgba(255,255,255,0.1);
    }
    
    .comparison-table tr:hover {
        background: rgba(255,255,255,0.05);
    }
    
    .feature-chip {
        display: inline-block;
        padding: 4px 8px;
        background: rgba(0, 243, 255, 0.1);
        border-radius: 4px;
        margin: 2px;
        font-size: 12px;
    }
    
    .model-name {
        font-size: 14px;
        margin: 2px 0;
    }
    
    .comparison-actions {
        display: flex;
        gap: 15px;
        margin-top: 30px;
    }
`;
document.head.appendChild(brandsStyles);