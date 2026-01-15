/**
 * FRANK AUTO DEALS - Brands Showroom v3.0
 * Complete integration with admin dashboard
 * Supports both local and cloud image storage
 */

class BrandsShowroom {
    constructor() {
        // Data
        this.cars = [];
        this.brands = [];
        this.filteredCars = [];
        this.filteredBrands = [];
        this.compareList = [];
        this.activeFilters = {};
        this.currentView = 'brands';
        this.currentBrand = null;
        this.currentLayout = 'grid';
        
        // Image storage configuration
        this.imageConfig = {
            useCloudStorage: false, // Set to true when using cloud storage
            cloudBaseUrl: 'https://your-cloud-storage.com/cars/',
            maxImagesPerCar: 5
        };
        
        // Initialize
        this.init();
    }
    
    async init() {
        console.log('🚀 Initializing Brands Showroom...');
        
        // Load data
        await this.loadData();
        
        // Setup UI
        this.setupEventListeners();
        this.setupNavigation();
        this.updateStats();
        this.renderBrands();
        
        // Show UI
        this.hidePreloader();
        
        console.log('✅ Brands Showroom initialized');
        console.log(`📊 Loaded: ${this.cars.length} cars, ${this.brands.length} brands`);
    }
    
    // ===== DATA LOADING =====
    async loadData() {
        try {
            // Load from localStorage (admin data)
            this.cars = JSON.parse(localStorage.getItem('frankCars')) || [];
            this.brands = JSON.parse(localStorage.getItem('frankBrands')) || this.getDefaultBrands();
            
            // If no brands in localStorage, create from default
            if (this.brands.length === 0 || !this.brands[0].cars) {
                this.brands = this.getDefaultBrands();
                this.organizeCarsByBrand();
            }
            
            // Process image data
            this.processCarImages();
            
            // Filter only available cars by default
            this.filteredCars = this.cars.filter(car => car.status === 'available');
            this.filteredBrands = [...this.brands];
            
            // Update localStorage timestamp
            localStorage.setItem('showroomLastUpdate', new Date().toISOString());
            
        } catch (error) {
            console.error('❌ Error loading data:', error);
            this.showError('Failed to load car data. Please refresh.');
        }
    }
    
    getDefaultBrands() {
        return [
            { 
                id: 'bmw', 
                name: 'BMW', 
                tagline: 'The Ultimate Driving Machine', 
                logo: 'bmwlogo.jpg',
                color: '#0066B3',
                categories: ['premium', 'german', 'luxury'],
                cars: [],
                stats: { total: 0, available: 0, minPrice: 0, maxPrice: 0 }
            },
            { 
                id: 'toyota', 
                name: 'Toyota', 
                tagline: 'Reliability Redefined', 
                logo: 'toyotalogo.jpg',
                color: '#EB0A1E',
                categories: ['japanese', 'budget', 'suv'],
                cars: [],
                stats: { total: 0, available: 0, minPrice: 0, maxPrice: 0 }
            },
            { 
                id: 'mercedes', 
                name: 'Mercedes-Benz', 
                tagline: 'The Best or Nothing', 
                logo: 'mercedezlogo.jpg',
                color: '#00A0E3',
                categories: ['luxury', 'german', 'premium'],
                cars: [],
                stats: { total: 0, available: 0, minPrice: 0, maxPrice: 0 }
            },
            { 
                id: 'porsche', 
                name: 'Porsche', 
                tagline: 'There is No Substitute', 
                logo: 'porschelogo.jpg',
                color: '#CC0000',
                categories: ['luxury', 'german', 'sports'],
                cars: [],
                stats: { total: 0, available: 0, minPrice: 0, maxPrice: 0 }
            },
            { 
                id: 'range-rover', 
                name: 'Range Rover', 
                tagline: 'Above and Beyond', 
                logo: 'range-roverlogo.jpg',
                color: '#004225',
                categories: ['luxury', 'suv', 'british'],
                cars: [],
                stats: { total: 0, available: 0, minPrice: 0, maxPrice: 0 }
            },
            { 
                id: 'ford', 
                name: 'Ford', 
                tagline: 'Built Ford Tough', 
                logo: 'fordlogo.jpg',
                color: '#003478',
                categories: ['american', 'budget', 'suv'],
                cars: [],
                stats: { total: 0, available: 0, minPrice: 0, maxPrice: 0 }
            },
            { 
                id: 'nissan', 
                name: 'Nissan', 
                tagline: 'Innovation that excites', 
                logo: 'nissanlogo.jpg',
                color: '#C3002F',
                categories: ['japanese', 'budget', 'suv'],
                cars: [],
                stats: { total: 0, available: 0, minPrice: 0, maxPrice: 0 }
            },
            { 
                id: 'lexus', 
                name: 'Lexus', 
                tagline: 'The Pursuit of Perfection', 
                logo: 'lexuslogo.jpg',
                color: '#000000',
                categories: ['luxury', 'japanese'],
                cars: [],
                stats: { total: 0, available: 0, minPrice: 0, maxPrice: 0 }
            },
            { 
                id: 'audi', 
                name: 'Audi', 
                tagline: 'Vorsprung durch Technik', 
                logo: 'audilogo.jpg',
                color: '#000000',
                categories: ['premium', 'german', 'luxury'],
                cars: [],
                stats: { total: 0, available: 0, minPrice: 0, maxPrice: 0 }
            },
            { 
                id: 'mitsubishi', 
                name: 'Mitsubishi', 
                tagline: 'Drive your Ambition', 
                logo: 'mitsubishilogo.jpg',
                color: '#E60012',
                categories: ['japanese', 'suv', 'budget'],
                cars: [],
                stats: { total: 0, available: 0, minPrice: 0, maxPrice: 0 }
            },
            { 
                id: 'subaru', 
                name: 'Subaru', 
                tagline: 'Confidence in Motion', 
                logo: 'subarulogo.jpg',
                color: '#003DA5',
                categories: ['japanese', 'suv'],
                cars: [],
                stats: { total: 0, available: 0, minPrice: 0, maxPrice: 0 }
            },
            { 
                id: 'jeep', 
                name: 'Jeep', 
                tagline: 'Go Anywhere, Do Anything', 
                logo: 'jeeplogo.jpg',
                color: '#000000',
                categories: ['american', 'suv'],
                cars: [],
                stats: { total: 0, available: 0, minPrice: 0, maxPrice: 0 }
            }
        ];
    }
    
    organizeCarsByBrand() {
        // Reset brand cars
        this.brands.forEach(brand => {
            brand.cars = [];
            brand.stats = { total: 0, available: 0, minPrice: Infinity, maxPrice: 0 };
        });
        
        // Organize cars by brand
        this.cars.forEach(car => {
            const brand = this.brands.find(b => b.id === car.brand);
            if (brand) {
                brand.cars.push(car);
                
                // Update brand stats
                brand.stats.total++;
                if (car.status === 'available') brand.stats.available++;
                
                const price = parseInt(car.price) || 0;
                if (price < brand.stats.minPrice) brand.stats.minPrice = price;
                if (price > brand.stats.maxPrice) brand.stats.maxPrice = price;
            }
        });
        
        // Update localStorage
        localStorage.setItem('frankBrands', JSON.stringify(this.brands));
    }
    
    processCarImages() {
        // Convert image data to usable format
        this.cars.forEach(car => {
            if (car.images && Array.isArray(car.images)) {
                // Ensure images array has proper structure
                car.processedImages = car.images.map(img => {
                    if (typeof img === 'string') {
                        // Base64 or URL string
                        if (img.startsWith('data:')) {
                            return { type: 'base64', data: img };
                        } else if (img.startsWith('http')) {
                            return { type: 'url', url: img };
                        } else {
                            // Assume it's a cloud storage path
                            return { 
                                type: 'url', 
                                url: `${this.imageConfig.cloudBaseUrl}${img}` 
                            };
                        }
                    } else if (typeof img === 'object') {
                        // Already in correct format
                        return img;
                    }
                    return null;
                }).filter(img => img !== null);
            } else {
                car.processedImages = [];
            }
            
            // Set primary image for thumbnail
            car.primaryImage = this.getPrimaryImage(car);
        });
    }
    
    getPrimaryImage(car) {
        if (!car.processedImages || car.processedImages.length === 0) {
            return 'https://via.placeholder.com/400x300/2a2a3a/8a8f98?text=No+Image';
        }
        
        // Try to get first image of any type
        const firstImage = car.processedImages[0];
        if (firstImage.type === 'url') {
            return firstImage.url;
        } else if (firstImage.type === 'base64') {
            return firstImage.data;
        }
        
        return 'https://via.placeholder.com/400x300/2a2a3a/8a8f98?text=Image+Error';
    }
    
    // ===== UI UPDATES =====
    updateStats() {
        const totalCars = this.cars.length;
        const availableCars = this.cars.filter(car => car.status === 'available').length;
        const totalBrands = this.brands.length;
        const totalValue = this.cars.reduce((sum, car) => sum + (parseInt(car.price) || 0), 0);
        
        document.getElementById('totalCars').textContent = totalCars.toLocaleString();
        document.getElementById('availableCars').textContent = availableCars.toLocaleString();
        document.getElementById('totalBrands').textContent = totalBrands.toLocaleString();
        document.getElementById('totalValue').textContent = `KSh ${(totalValue / 1000000).toFixed(1)}M`;
        
        // Update last updated time
        const lastUpdate = localStorage.getItem('showroomLastUpdate');
        if (lastUpdate) {
            const time = new Date(lastUpdate).toLocaleTimeString();
            document.getElementById('lastUpdated').textContent = time;
        }
    }
    
    renderBrands() {
        const container = document.getElementById('brandsGrid');
        if (!container) return;
        
        container.innerHTML = '';
        
        this.filteredBrands.forEach(brand => {
            const brandCard = this.createBrandCard(brand);
            container.appendChild(brandCard);
        });
    }
    
    createBrandCard(brand) {
        const card = document.createElement('div');
        card.className = 'brand-card';
        card.dataset.brandId = brand.id;
        
        // Determine badge type
        let badgeClass = '';
        let badgeText = '';
        if (brand.categories.includes('luxury')) {
            badgeClass = 'luxury';
            badgeText = 'LUXURY';
        } else if (brand.categories.includes('premium')) {
            badgeClass = 'premium';
            badgeText = 'PREMIUM';
        } else if (brand.stats.available > 10) {
            badgeClass = 'popular';
            badgeText = 'POPULAR';
        }
        
        card.innerHTML = `
            <div class="brand-header" style="border-color: ${brand.color}">
                <div class="brand-logo">
                    <img src="${brand.logo}" alt="${brand.name}" 
                         onerror="this.src='https://via.placeholder.com/80/2a2a3a/ffffff?text=${brand.name.charAt(0)}'">
                </div>
                ${badgeText ? `<div class="brand-badge ${badgeClass}">${badgeText}</div>` : ''}
            </div>
            
            <div class="brand-content">
                <h3 class="brand-name">${brand.name}</h3>
                <p class="brand-tagline">${brand.tagline}</p>
                
                <div class="brand-stats">
                    <div class="brand-stat">
                        <i class="fas fa-car"></i>
                        <div class="brand-stat-value">${brand.stats.total}</div>
                        <div class="brand-stat-label">Models</div>
                    </div>
                    <div class="brand-stat">
                        <i class="fas fa-check-circle"></i>
                        <div class="brand-stat-value">${brand.stats.available}</div>
                        <div class="brand-stat-label">Available</div>
                    </div>
                </div>
                
                <div class="price-range">
                    <i class="fas fa-tag"></i>
                    <span>KSh ${brand.stats.minPrice.toLocaleString()} - ${brand.stats.maxPrice.toLocaleString()}</span>
                </div>
                
                <div class="brand-features">
                    ${brand.categories.slice(0, 3).map(cat => 
                        `<span class="feature-tag">${cat.toUpperCase()}</span>`
                    ).join('')}
                </div>
            </div>
            
            <div class="brand-actions">
                <button class="btn-view" onclick="showroom.viewBrand('${brand.id}')">
                    <i class="fas fa-eye"></i> View Cars (${brand.stats.available})
                </button>
                <button class="btn-compare" onclick="showroom.addToCompare('${brand.id}')">
                    <i class="fas fa-balance-scale"></i> Compare
                </button>
            </div>
        `;
        
        return card;
    }
    
    renderBrandCars(brandId) {
        const brand = this.brands.find(b => b.id === brandId);
        if (!brand) return;
        
        this.currentBrand = brand;
        
        // Update UI
        document.getElementById('brandTitle').innerHTML = `
            <img src="${brand.logo}" alt="${brand.name}" style="height: 40px; margin-right: 15px;">
            ${brand.name} Cars
        `;
        
        document.getElementById('brandStats').innerHTML = `
            <div class="brand-stat-item">
                <div class="brand-stat-value">${brand.cars.length}</div>
                <div class="brand-stat-label">Total</div>
            </div>
            <div class="brand-stat-item">
                <div class="brand-stat-value">${brand.stats.available}</div>
                <div class="brand-stat-label">Available</div>
            </div>
            <div class="brand-stat-item">
                <div class="brand-stat-value">KSh ${brand.stats.minPrice.toLocaleString()}</div>
                <div class="brand-stat-label">From</div>
            </div>
        `;
        
        // Render cars
        this.renderCarsGrid(brand.cars, 'brandCarsGrid');
    }
    
    renderCarsGrid(cars, containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        container.innerHTML = '';
        
        if (cars.length === 0) {
            container.innerHTML = `
                <div class="no-cars" style="grid-column: 1 / -1; text-align: center; padding: 60px;">
                    <i class="fas fa-car" style="font-size: 4rem; opacity: 0.3; margin-bottom: 20px;"></i>
                    <h3 style="color: var(--gray); margin-bottom: 10px;">No cars found</h3>
                    <p style="color: var(--gray);">Try adjusting your filters or check back later.</p>
                </div>
            `;
            return;
        }
        
        cars.forEach(car => {
            const carCard = this.createCarCard(car);
            container.appendChild(carCard);
        });
    }
    
    createCarCard(car) {
        const card = document.createElement('div');
        card.className = `car-card ${this.currentLayout}`;
        
        // Format price
        const price = parseInt(car.price) || 0;
        const formattedPrice = price >= 1000000 
            ? `KSh ${(price / 1000000).toFixed(1)}M` 
            : `KSh ${price.toLocaleString()}`;
        
        // Status badge
        let statusClass = '';
        let statusText = '';
        switch(car.status) {
            case 'available':
                statusClass = 'status-available';
                statusText = 'Available';
                break;
            case 'reserved':
                statusClass = 'status-reserved';
                statusText = 'Reserved';
                break;
            case 'sold':
                statusClass = 'status-sold';
                statusText = 'Sold';
                break;
        }
        
        card.innerHTML = `
            <div class="car-images">
                <img src="${car.primaryImage}" alt="${car.model}" class="car-image"
                     onerror="this.src='https://via.placeholder.com/400x300/2a2a3a/8a8f98?text=No+Image'">
                <div class="car-status ${statusClass}">${statusText}</div>
            </div>
            
            <div class="car-content">
                <div class="car-header">
                    <div class="car-title">
                        <h3>${car.model}</h3>
                        <div class="car-year">${car.year} • ${car.brand}</div>
                    </div>
                    <div class="car-price">${formattedPrice}</div>
                </div>
                
                <div class="car-specs">
                    <div class="car-spec">
                        <span class="spec-label">Engine</span>
                        <span class="spec-value">${car.engine || 'N/A'}</span>
                    </div>
                    <div class="car-spec">
                        <span class="spec-label">Transmission</span>
                        <span class="spec-value">${car.transmission || 'N/A'}</span>
                    </div>
                    <div class="car-spec">
                        <span class="spec-label">Fuel</span>
                        <span class="spec-value">${car.fuel || 'N/A'}</span>
                    </div>
                    <div class="car-spec">
                        <span class="spec-label">Color</span>
                        <span class="spec-value">${car.color || 'N/A'}</span>
                    </div>
                </div>
                
                <p class="car-description">${car.description || 'No description available.'}</p>
                
                <div class="car-actions">
                    <button class="btn-details" onclick="showroom.showCarDetails('${car.id}')">
                        <i class="fas fa-info-circle"></i> Details
                    </button>
                    <button class="btn-inquire" onclick="showroom.inquireCar('${car.id}')">
                        <i class="fab fa-whatsapp"></i> Inquire
                    </button>
                    ${car.processedImages.length > 0 ? `
                        <button class="btn-gallery" onclick="showroom.showCarGallery('${car.id}')">
                            <i class="fas fa-images"></i> Gallery (${car.processedImages.length})
                        </button>
                    ` : ''}
                </div>
            </div>
        `;
        
        return card;
    }
    
    // ===== VIEW MANAGEMENT =====
    showBrandsView() {
        this.currentView = 'brands';
        this.updateView();
        this.renderBrands();
    }
    
    showAllCars() {
        this.currentView = 'all-cars';
        this.updateView();
        this.renderCarsGrid(this.filteredCars, 'carsContent');
    }
    
    viewBrand(brandId) {
        this.currentView = 'brand-cars';
        this.updateView();
        this.renderBrandCars(brandId);
    }
    
    updateView() {
        // Hide all views
        document.getElementById('brandsView').classList.add('hidden');
        document.getElementById('carsView').classList.add('hidden');
        document.getElementById('brandCarsView').classList.add('hidden');
        
        // Show active view
        switch(this.currentView) {
            case 'brands':
                document.getElementById('brandsView').classList.remove('hidden');
                document.title = 'Brands Showroom | Frank Auto Deals';
                break;
            case 'all-cars':
                document.getElementById('carsView').classList.remove('hidden');
                document.title = 'All Cars | Frank Auto Deals';
                break;
            case 'brand-cars':
                document.getElementById('brandCarsView').classList.remove('hidden');
                document.title = `${this.currentBrand.name} Cars | Frank Auto Deals`;
                break;
        }
        
        // Update navigation
        this.updateNavigation();
    }
    
    // ===== MODAL FUNCTIONS =====
    showCarDetails(carId) {
        const car = this.cars.find(c => c.id === carId);
        if (!car) return;
        
        const modalBody = document.getElementById('carModalBody');
        modalBody.innerHTML = this.createCarDetailsHTML(car);
        
        document.getElementById('carModal').classList.remove('hidden');
    }
    
    createCarDetailsHTML(car) {
        const price = parseInt(car.price) || 0;
        const formattedPrice = price >= 1000000 
            ? `KSh ${(price / 1000000).toFixed(1)} Million` 
            : `KSh ${price.toLocaleString()}`;
        
        return `
            <div class="car-details">
                <div class="car-details-header">
                    <h2>${car.year} ${car.brand} ${car.model}</h2>
                    <div class="car-price-large">${formattedPrice}</div>
                </div>
                
                <div class="car-details-gallery">
                    ${car.processedImages.map((img, index) => `
                        <a href="${img.type === 'url' ? img.url : img.data}" 
                           data-lightbox="car-${car.id}" 
                           data-title="${car.model} - Image ${index + 1}">
                            <img src="${img.type === 'url' ? img.url : img.data}" 
                                 alt="${car.model} ${index + 1}"
                                 onerror="this.src='https://via.placeholder.com/300x200/2a2a3a/8a8f98?text=Image+Error'">
                        </a>
                    `).join('')}
                </div>
                
                <div class="car-details-specs">
                    <h3>Specifications</h3>
                    <div class="specs-grid">
                        <div class="spec-item">
                            <span class="spec-label">Color:</span>
                            <span class="spec-value">${car.color || 'N/A'}</span>
                        </div>
                        <div class="spec-item">
                            <span class="spec-label">Mileage:</span>
                            <span class="spec-value">${car.mileage ? car.mileage + ' km' : 'N/A'}</span>
                        </div>
                        <div class="spec-item">
                            <span class="spec-label">Engine:</span>
                            <span class="spec-value">${car.engine || 'N/A'}</span>
                        </div>
                        <div class="spec-item">
                            <span class="spec-label">Transmission:</span>
                            <span class="spec-value">${car.transmission || 'N/A'}</span>
                        </div>
                        <div class="spec-item">
                            <span class="spec-label">Fuel Type:</span>
                            <span class="spec-value">${car.fuel || 'N/A'}</span>
                        </div>
                        <div class="spec-item">
                            <span class="spec-label">Seats:</span>
                            <span class="spec-value">${car.seats || 'N/A'}</span>
                        </div>
                    </div>
                </div>
                
                <div class="car-details-description">
                    <h3>Description</h3>
                    <p>${car.description || 'No description available for this vehicle.'}</p>
                </div>
                
                <div class="car-details-actions">
                    <button class="btn-whatsapp" onclick="showroom.inquireCar('${car.id}')">
                        <i class="fab fa-whatsapp"></i> Inquire on WhatsApp
                    </button>
                    <button class="btn-close" onclick="showroom.closeCarModal()">
                        Close
                    </button>
                </div>
            </div>
        `;
    }
    
    showCarGallery(carId) {
        const car = this.cars.find(c => c.id === carId);
        if (!car || !car.processedImages || car.processedImages.length === 0) return;
        
        // Open first image in lightbox
        const firstImage = car.processedImages[0];
        const imageUrl = firstImage.type === 'url' ? firstImage.url : firstImage.data;
        
        // Trigger lightbox
        const link = document.createElement('a');
        link.href = imageUrl;
        link.setAttribute('data-lightbox', `car-gallery-${carId}`);
        link.click();
    }
    
    // ===== COMPARE FUNCTIONS =====
    addToCompare(brandId) {
        if (this.compareList.includes(brandId)) {
            this.showMessage('Brand already in compare list', 'warning');
            return;
        }
        
        this.compareList.push(brandId);
        this.updateCompareUI();
        this.showMessage('Brand added to compare list', 'success');
    }
    
    removeFromCompare(brandId) {
        this.compareList = this.compareList.filter(id => id !== brandId);
        this.updateCompareUI();
    }
    
    clearCompare() {
        this.compareList = [];
        this.updateCompareUI();
        this.showMessage('Compare list cleared', 'info');
    }
    
    updateCompareUI() {
        const count = this.compareList.length;
        document.getElementById('compareCount').textContent = count;
        
        const content = document.getElementById('compareContent');
        if (count === 0) {
            content.innerHTML = `
                <div class="compare-empty">
                    <i class="fas fa-balance-scale"></i>
                    <p>Select brands to compare</p>
                </div>
            `;
        } else {
            content.innerHTML = this.compareList.map(brandId => {
                const brand = this.brands.find(b => b.id === brandId);
                if (!brand) return '';
                
                return `
                    <div class="compare-item">
                        <img src="${brand.logo}" alt="${brand.name}" 
                             onerror="this.src='https://via.placeholder.com/40/2a2a3a/ffffff?text=${brand.name.charAt(0)}'">
                        <div class="compare-item-info">
                            <div class="compare-item-name">${brand.name}</div>
                            <div class="compare-item-stats">
                                ${brand.stats.total} cars • From KSh ${brand.stats.minPrice.toLocaleString()}
                            </div>
                        </div>
                        <button class="remove-compare" onclick="showroom.removeFromCompare('${brandId}')">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                `;
            }).join('');
        }
        
        localStorage.setItem('brandsCompareList', JSON.stringify(this.compareList));
    }
    
    showComparison() {
        if (this.compareList.length < 2) {
            this.showMessage('Select at least 2 brands to compare', 'warning');
            return;
        }
        
        const brands = this.compareList.map(id => this.brands.find(b => b.id === id)).filter(b => b);
        
        const modalBody = document.getElementById('comparisonModalBody');
        modalBody.innerHTML = this.createComparisonHTML(brands);
        
        document.getElementById('comparisonModal').classList.remove('hidden');
    }
    
    createComparisonHTML(brands) {
        return `
            <div class="comparison">
                <h2>Brand Comparison</h2>
                
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
                                <td>Total Cars</td>
                                ${brands.map(brand => `<td>${brand.stats.total}</td>`).join('')}
                            </tr>
                            <tr>
                                <td>Available Cars</td>
                                ${brands.map(brand => `<td>${brand.stats.available}</td>`).join('')}
                            </tr>
                            <tr>
                                <td>Price Range</td>
                                ${brands.map(brand => `
                                    <td>KSh ${brand.stats.minPrice.toLocaleString()} - ${brand.stats.maxPrice.toLocaleString()}</td>
                                `).join('')}
                            </tr>
                            <tr>
                                <td>Categories</td>
                                ${brands.map(brand => `
                                    <td>${brand.categories.map(c => c.toUpperCase()).join(', ')}</td>
                                `).join('')}
                            </tr>
                            <tr>
                                <td>Popular Models</td>
                                ${brands.map(brand => `
                                    <td>
                                        ${brand.cars.slice(0, 3).map(car => car.model).join(', ')}
                                    </td>
                                `).join('')}
                            </tr>
                        </tbody>
                    </table>
                </div>
                
                <div class="comparison-actions">
                    <button class="btn-whatsapp" onclick="showroom.shareComparison()">
                        <i class="fab fa-whatsapp"></i> Share Comparison
                    </button>
                    <button class="btn-close" onclick="showroom.closeComparisonModal()">
                        Close
                    </button>
                </div>
            </div>
        `;
    }
    
    // ===== UTILITY FUNCTIONS =====
    hidePreloader() {
        setTimeout(() => {
            const preloader = document.querySelector('.preloader');
            if (preloader) {
                preloader.classList.add('loaded');
                setTimeout(() => {
                    preloader.style.display = 'none';
                }, 500);
            }
        }, 1000);
    }
    
    setupEventListeners() {
        // Search
        const searchInput = document.getElementById('globalSearch');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchBrands(e.target.value);
            });
        }
        
        // Category tabs
        document.querySelectorAll('.category-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const category = e.target.dataset.category;
                this.filterByCategory(category);
            });
        });
        
        // Layout toggle
        document.querySelectorAll('.layout-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const layout = e.target.dataset.layout;
                this.setLayout(layout);
            });
        });
        
        // Sort select
        const sortSelect = document.getElementById('sortCars');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.sortCars(e.target.value);
            });
        }
        
        // Brand search
        const brandSearch = document.getElementById('searchBrandCars');
        if (brandSearch) {
            brandSearch.addEventListener('input', (e) => {
                this.searchBrandCars(e.target.value);
            });
        }
        
        // View toggle
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const view = e.target.dataset.view;
                this.setView(view);
            });
        });
    }
    
    setupNavigation() {
        // Load saved compare list
        const savedCompare = localStorage.getItem('brandsCompareList');
        if (savedCompare) {
            this.compareList = JSON.parse(savedCompare);
            this.updateCompareUI();
        }
    }
    
    updateNavigation() {
        // Update view buttons
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.view === this.currentView);
        });
        
        // Update layout buttons
        document.querySelectorAll('.layout-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.layout === this.currentLayout);
        });
    }
    
    searchBrands(query) {
        const searchTerm = query.toLowerCase().trim();
        
        if (!searchTerm) {
            this.filteredBrands = [...this.brands];
            this.renderBrands();
            return;
        }
        
        this.filteredBrands = this.brands.filter(brand => {
            return brand.name.toLowerCase().includes(searchTerm) ||
                   brand.tagline.toLowerCase().includes(searchTerm) ||
                   brand.categories.some(cat => cat.toLowerCase().includes(searchTerm));
        });
        
        this.renderBrands();
    }
    
    filterByCategory(category) {
        // Update active tab
        document.querySelectorAll('.category-tab').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.category === category);
        });
        
        if (category === 'all') {
            this.filteredBrands = [...this.brands];
        } else {
            this.filteredBrands = this.brands.filter(brand => 
                brand.categories.includes(category)
            );
        }
        
        this.renderBrands();
    }
    
    setLayout(layout) {
        this.currentLayout = layout;
        this.updateNavigation();
        
        // Update car cards
        const carCards = document.querySelectorAll('.car-card');
        carCards.forEach(card => {
            card.classList.remove('grid', 'list');
            card.classList.add(layout);
        });
    }
    
    sortCars(sortBy) {
        let sortedCars = [...this.filteredCars];
        
        switch(sortBy) {
            case 'price_low':
                sortedCars.sort((a, b) => (parseInt(a.price) || 0) - (parseInt(b.price) || 0));
                break;
            case 'price_high':
                sortedCars.sort((a, b) => (parseInt(b.price) || 0) - (parseInt(a.price) || 0));
                break;
            case 'newest':
                sortedCars.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
                break;
            case 'oldest':
                sortedCars.sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0));
                break;
        }
        
        this.filteredCars = sortedCars;
        this.renderCarsGrid(this.filteredCars, 'carsContent');
    }
    
    searchBrandCars(query) {
        if (!this.currentBrand) return;
        
        const searchTerm = query.toLowerCase().trim();
        
        if (!searchTerm) {
            this.renderBrandCars(this.currentBrand.id);
            return;
        }
        
        const filteredCars = this.currentBrand.cars.filter(car => 
            car.model.toLowerCase().includes(searchTerm) ||
            car.description?.toLowerCase().includes(searchTerm) ||
            car.color?.toLowerCase().includes(searchTerm) ||
            car.engine?.toLowerCase().includes(searchTerm)
        );
        
        this.renderCarsGrid(filteredCars, 'brandCarsGrid');
    }
    
    setView(view) {
        if (view === 'brands') {
            this.showBrandsView();
        } else if (view === 'all-cars') {
            this.showAllCars();
        }
    }
    
    // ===== WHATSAPP INTEGRATION =====
    inquireCar(carId) {
        const car = this.cars.find(c => c.id === carId);
        if (!car) return;
        
        const phone = '254742436155';
        const message = encodeURIComponent(
            `🚗 *CAR ENQUIRY - Frank Auto Deals*\n\n` +
            `*Car:* ${car.year} ${car.brand} ${car.model}\n` +
            `*Price:* KSh ${parseInt(car.price).toLocaleString()}\n` +
            `*Status:* ${car.status}\n\n` +
            `Hello, I'm interested in this car. Please provide:\n` +
            `• More details and specifications\n` +
            `• Additional photos\n` +
            `• Available colors\n` +
            `• Test drive availability\n` +
            `• Financing options`
        );
        
        window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
    }
    
    contactWhatsApp() {
        const phone = '254742436155';
        const message = encodeURIComponent(
            `🏎️ *SHOWROOM ENQUIRY - Frank Auto Deals*\n\n` +
            `Hello, I'm interested in vehicles from your showroom. Please assist me with:\n` +
            `• Available models\n` +
            `• Pricing information\n` +
            `• Test drive bookings\n` +
            `• Financing options\n` +
            `• Trade-in possibilities`
        );
        
        window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
    }
    
    shareComparison() {
        const phone = '254742436155';
        const brands = this.compareList.map(id => {
            const brand = this.brands.find(b => b.id === id);
            return brand ? brand.name : '';
        }).filter(name => name);
        
        const message = encodeURIComponent(
            `⚖️ *BRAND COMPARISON REQUEST - Frank Auto Deals*\n\n` +
            `*Brands to Compare:* ${brands.join(', ')}\n\n` +
            `Please help me compare these brands:\n` +
            `• Price differences and value\n` +
            `• Features and specifications\n` +
            `• Maintenance costs\n` +
            `• Resale value\n` +
            `• Best models for my needs\n` +
            `• Financing options for each`
        );
        
        window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
        this.closeComparisonModal();
    }
    
    // ===== MODAL CONTROLS =====
    closeCarModal() {
        document.getElementById('carModal').classList.add('hidden');
    }
    
    closeComparisonModal() {
        document.getElementById('comparisonModal').classList.add('hidden');
    }
    
    toggleCompare() {
        const panel = document.getElementById('comparePanel');
        panel.classList.toggle('hidden');
    }
    
    toggleFilters() {
        const panel = document.getElementById('filterPanel');
        panel.classList.toggle('hidden');
    }
    
    // ===== MESSAGES =====
    showMessage(text, type = 'info') {
        // Remove existing message
        const existing = document.querySelector('.showroom-message');
        if (existing) existing.remove();
        
        // Create message element
        const message = document.createElement('div');
        message.className = `showroom-message ${type}`;
        message.textContent = text;
        message.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 25px;
            background: ${type === 'success' ? 'var(--primary)' : 
                         type === 'warning' ? '#FFD700' : 
                         type === 'error' ? 'var(--accent)' : 'var(--secondary)'};
            color: #000;
            border-radius: var(--radius-md);
            font-weight: 600;
            z-index: 10000;
            animation: slideInRight 0.3s ease;
            box-shadow: 0 5px 20px rgba(0,0,0,0.3);
        `;
        
        document.body.appendChild(message);
        
        // Auto remove
        setTimeout(() => {
            message.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => message.remove(), 300);
        }, 3000);
    }
    
    showError(message) {
        this.showMessage(message, 'error');
    }
    
    // ===== PUBLIC METHODS =====
    goHome() {
        this.showBrandsView();
    }
    
    refreshData() {
        this.showMessage('Refreshing data...', 'info');
        setTimeout(async () => {
            await this.loadData();
            this.updateStats();
            if (this.currentView === 'brands') {
                this.renderBrands();
            } else if (this.currentView === 'brand-cars' && this.currentBrand) {
                this.renderBrandCars(this.currentBrand.id);
            }
            this.showMessage('Data refreshed successfully', 'success');
        }, 500);
    }
    
    // For cloud storage integration
    setCloudStorage(enabled, baseUrl) {
        this.imageConfig.useCloudStorage = enabled;
        if (baseUrl) this.imageConfig.cloudBaseUrl = baseUrl;
        this.processCarImages();
        
        if (enabled) {
            this.showMessage('Cloud storage enabled', 'success');
        }
    }
}

// Initialize Showroom
let showroom;

document.addEventListener('DOMContentLoaded', () => {
    showroom = new BrandsShowroom();
    window.showroom = showroom;
    
    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slideOutRight {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
        
        .car-details-gallery {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
            gap: 10px;
            margin: 20px 0;
        }
        
        .car-details-gallery a {
            border-radius: 8px;
            overflow: hidden;
            border: 2px solid transparent;
            transition: all 0.3s ease;
        }
        
        .car-details-gallery a:hover {
            border-color: var(--primary);
            transform: translateY(-3px);
        }
        
        .car-details-gallery img {
            width: 100%;
            height: 100px;
            object-fit: cover;
        }
        
        .specs-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 15px;
            margin: 20px 0;
        }
        
        .spec-item {
            padding: 15px;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 8px;
            border-left: 3px solid var(--primary);
        }
        
        .spec-label {
            display: block;
            font-size: 0.9rem;
            color: var(--gray);
            margin-bottom: 5px;
        }
        
        .spec-value {
            font-weight: 600;
            font-size: 1.1rem;
        }
        
        .price-range {
            display: flex;
            align-items: center;
            gap: 10px;
            margin: 15px 0;
            color: var(--primary);
            font-weight: 600;
        }
    `;
    document.head.appendChild(style);
});
