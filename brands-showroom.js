/**
 * FRANK AUTO DEALS - Premium Brands Showroom
 * Connected to Admin Dashboard via localStorage
 * WhatsApp: +254 742 436 155
 */

class LuxuryShowroom {
    constructor() {
        this.cars = [];
        this.brands = [];
        this.filteredBrands = [];
        this.currentFilter = 'all';
        this.currentView = 'grid';
        this.selectedBrand = null;
        this.compareList = [];
        
        // WhatsApp number
        this.whatsappNumber = '254742436155';
        
        // Initialize
        this.init();
    }
    
    init() {
        console.log('🚀 Initializing Luxury Showroom...');
        
        // Load data from localStorage (connected to admin)
        this.loadData();
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Initialize Swiper for galleries
        this.initSwiper();
        
        // Render the showroom
        this.renderShowroom();
        
        // Update stats
        this.updateStats();
        
        // Hide loading state
        this.hideLoading();
        
        console.log('✅ Luxury Showroom ready!');
    }
    
    loadData() {
        try {
            // Load cars from admin dashboard (same localStorage key)
            this.cars = JSON.parse(localStorage.getItem('frankCars')) || [];
            
            // Load brands from admin dashboard or use defaults
            const savedBrands = JSON.parse(localStorage.getItem('frankBrands'));
            if (savedBrands && savedBrands.length > 0) {
                this.brands = savedBrands;
            } else {
                this.brands = this.getDefaultBrands();
            }
            
            console.log(`📊 Loaded: ${this.cars.length} cars, ${this.brands.length} brands`);
            
            // Organize cars by brand
            this.organizeCarsByBrand();
            
        } catch (error) {
            console.error('❌ Error loading data:', error);
            this.brands = this.getDefaultBrands();
            this.organizeCarsByBrand();
        }
    }
    
    getDefaultBrands() {
        return [
            { 
                id: 'bmw', 
                name: 'BMW', 
                tagline: 'The Ultimate Driving Machine', 
                logo: 'bmwlogo.jpg',
                categories: ['premium', 'german', 'luxury'],
                cars: [],
                stats: { total: 0, available: 0, minPrice: 0, maxPrice: 0 }
            },
            { 
                id: 'mercedes', 
                name: 'Mercedes-Benz', 
                tagline: 'The Best or Nothing', 
                logo: 'mercedezlogo.jpg',
                categories: ['luxury', 'german', 'premium'],
                cars: [],
                stats: { total: 0, available: 0, minPrice: 0, maxPrice: 0 }
            },
            { 
                id: 'porsche', 
                name: 'Porsche', 
                tagline: 'There is No Substitute', 
                logo: 'porschelogo.jpg',
                categories: ['luxury', 'german', 'sports'],
                cars: [],
                stats: { total: 0, available: 0, minPrice: 0, maxPrice: 0 }
            },
            { 
                id: 'audi', 
                name: 'Audi', 
                tagline: 'Vorsprung durch Technik', 
                logo: 'audilogo.jpg',
                categories: ['premium', 'german', 'luxury'],
                cars: [],
                stats: { total: 0, available: 0, minPrice: 0, maxPrice: 0 }
            },
            { 
                id: 'lexus', 
                name: 'Lexus', 
                tagline: 'The Pursuit of Perfection', 
                logo: 'lexuslogo.jpg',
                categories: ['luxury', 'japanese'],
                cars: [],
                stats: { total: 0, available: 0, minPrice: 0, maxPrice: 0 }
            },
            { 
                id: 'toyota', 
                name: 'Toyota', 
                tagline: 'Reliability Redefined', 
                logo: 'toyotalogo.jpg',
                categories: ['japanese', 'budget', 'suv'],
                cars: [],
                stats: { total: 0, available: 0, minPrice: 0, maxPrice: 0 }
            },
            { 
                id: 'range-rover', 
                name: 'Range Rover', 
                tagline: 'Above and Beyond', 
                logo: 'range-roverlogo.jpg',
                categories: ['luxury', 'suv', 'british'],
                cars: [],
                stats: { total: 0, available: 0, minPrice: 0, maxPrice: 0 }
            },
            { 
                id: 'ford', 
                name: 'Ford', 
                tagline: 'Built Ford Tough', 
                logo: 'fordlogo.jpg',
                categories: ['american', 'budget', 'suv'],
                cars: [],
                stats: { total: 0, available: 0, minPrice: 0, maxPrice: 0 }
            },
            { 
                id: 'nissan', 
                name: 'Nissan', 
                tagline: 'Innovation that excites', 
                logo: 'nissanlogo.jpg',
                categories: ['japanese', 'budget', 'suv'],
                cars: [],
                stats: { total: 0, available: 0, minPrice: 0, maxPrice: 0 }
            },
            { 
                id: 'mitsubishi', 
                name: 'Mitsubishi', 
                tagline: 'Drive your Ambition', 
                logo: 'mitsubishilogo.jpg',
                categories: ['japanese', 'suv', 'budget'],
                cars: [],
                stats: { total: 0, available: 0, minPrice: 0, maxPrice: 0 }
            },
            { 
                id: 'subaru', 
                name: 'Subaru', 
                tagline: 'Confidence in Motion', 
                logo: 'subarulogo.jpg',
                categories: ['japanese', 'suv'],
                cars: [],
                stats: { total: 0, available: 0, minPrice: 0, maxPrice: 0 }
            },
            { 
                id: 'jeep', 
                name: 'Jeep', 
                tagline: 'Go Anywhere, Do Anything', 
                logo: 'jeeplogo.jpg',
                categories: ['american', 'suv'],
                cars: [],
                stats: { total: 0, available: 0, minPrice: 0, maxPrice: 0 }
            }
        ];
    }
    
    organizeCarsByBrand() {
        // Reset brand cars
        this.brands.forEach(brand => {
            brand.cars = this.cars.filter(car => car.brand === brand.id);
            
            // Calculate brand statistics
            const availableCars = brand.cars.filter(c => c.status === 'available');
            brand.stats.total = brand.cars.length;
            brand.stats.available = availableCars.length;
            
            // Calculate price range
            if (availableCars.length > 0) {
                const prices = availableCars.map(c => parseInt(c.price) || 0).filter(p => p > 0);
                if (prices.length > 0) {
                    brand.stats.minPrice = Math.min(...prices);
                    brand.stats.maxPrice = Math.max(...prices);
                }
            }
        });
        
        // Filter out brands with no cars
        this.filteredBrands = this.brands.filter(brand => brand.cars.length > 0);
    }
    
    setupEventListeners() {
        // Brand filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const brand = e.currentTarget.dataset.brand;
                this.filterByBrand(brand);
            });
        });
        
        // View toggle buttons
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const view = e.currentTarget.dataset.view;
                this.setView(view);
            });
        });
        
        // Sort dropdown
        document.getElementById('sortBrands').addEventListener('change', (e) => {
            this.sortBrands(e.target.value);
        });
        
        // Search input
        document.getElementById('globalSearch').addEventListener('input', (e) => {
            this.searchCars(e.target.value);
        });
        
        // Clear search
        document.getElementById('clearSearch').addEventListener('click', () => {
            document.getElementById('globalSearch').value = '';
            this.searchCars('');
        });
        
        // Refresh data button
        document.getElementById('refreshData').addEventListener('click', () => {
            this.refreshData();
        });
        
        // WhatsApp contact
        document.getElementById('whatsappContact').addEventListener('click', () => {
            this.contactWhatsApp();
        });
        
        // Modal close
        document.getElementById('closeModal')?.addEventListener('click', () => {
            this.closeModal();
        });
        
        // Close modal on overlay click
        document.getElementById('carModal')?.addEventListener('click', (e) => {
            if (e.target === document.getElementById('carModal')) {
                this.closeModal();
            }
        });
        
        // Filter navigation
        document.querySelector('.prev-filter')?.addEventListener('click', () => {
            this.scrollFilter(-200);
        });
        
        document.querySelector('.next-filter')?.addEventListener('click', () => {
            this.scrollFilter(200);
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
            }
            if (e.key === 'r' && e.ctrlKey) {
                e.preventDefault();
                this.refreshData();
            }
        });
        
        // Window hash change (for direct brand links)
        window.addEventListener('hashchange', () => {
            this.handleHashChange();
        });
    }
    
    initSwiper() {
        this.gallerySwiper = new Swiper('.gallerySwiper', {
            slidesPerView: 1,
            spaceBetween: 20,
            navigation: {
                nextEl: '.gallery-next',
                prevEl: '.gallery-prev',
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            loop: true,
            effect: 'fade',
            fadeEffect: {
                crossFade: true
            }
        });
    }
    
    renderShowroom() {
        const gridContainer = document.getElementById('brandsGrid');
        const emptyState = document.getElementById('emptyState');
        
        if (!gridContainer) return;
        
        // Clear grid
        gridContainer.innerHTML = '';
        
        // Check if we have cars
        if (this.filteredBrands.length === 0) {
            emptyState.style.display = 'block';
            return;
        }
        
        emptyState.style.display = 'none';
        
        // Render brand cards
        this.filteredBrands.forEach(brand => {
            const card = this.createBrandCard(brand);
            gridContainer.appendChild(card);
        });
        
        // Update UI
        this.updateFilterButtons();
    }
    
    createBrandCard(brand) {
        const card = document.createElement('div');
        card.className = `brand-card brand-${brand.id}`;
        card.dataset.brandId = brand.id;
        
        // Format price
        const priceText = brand.stats.minPrice > 0 ? 
            `From KSh ${brand.stats.minPrice.toLocaleString()}` : 
            'Price on request';
        
        card.innerHTML = `
            <div class="card-header">
                <div class="brand-logo-container">
                    <img src="${brand.logo}" alt="${brand.name}" class="brand-logo"
                         onerror="this.src='https://via.placeholder.com/70/2a2a3a/ffffff?text=${brand.name.charAt(0)}'">
                    <div class="brand-info">
                        <h3 class="brand-name">${brand.name}</h3>
                        <p class="brand-tagline">${brand.tagline}</p>
                    </div>
                </div>
                <div class="car-count">${brand.cars.length} cars</div>
            </div>
            
            <div class="card-content">
                <div class="car-stats">
                    <div class="car-stat">
                        <div class="stat-value">${brand.stats.total}</div>
                        <div class="stat-label">Total</div>
                    </div>
                    <div class="car-stat">
                        <div class="stat-value">${brand.stats.available}</div>
                        <div class="stat-label">Available</div>
                    </div>
                    <div class="car-stat">
                        <div class="stat-value">${brand.cars.length > 0 ? brand.cars[0]?.year || 'N/A' : 'N/A'}</div>
                        <div class="stat-label">Latest</div>
                    </div>
                    <div class="car-stat">
                        <div class="stat-value">${brand.stats.maxPrice > 0 ? 'KSh ' + (brand.stats.maxPrice/1000000).toFixed(1) + 'M' : 'N/A'}</div>
                        <div class="stat-label">Top Price</div>
                    </div>
                </div>
                
                <div class="price-range">
                    <i class="fas fa-tag"></i>
                    <span>${priceText}</span>
                </div>
                
                <div class="brand-features">
                    ${brand.categories.slice(0, 3).map(cat => 
                        `<span class="feature-tag">${cat.toUpperCase()}</span>`
                    ).join('')}
                </div>
            </div>
            
            <div class="card-actions">
                <button class="btn-view" onclick="showroom.viewBrand('${brand.id}')">
                    <i class="fas fa-eye"></i> View ${brand.stats.total} Cars
                </button>
                <button class="btn-whatsapp" onclick="showroom.contactBrand('${brand.id}')">
                    <i class="fab fa-whatsapp"></i>
                </button>
            </div>
        `;
        
        // Add click event to whole card
        card.addEventListener('click', (e) => {
            if (!e.target.closest('button')) {
                this.viewBrand(brand.id);
            }
        });
        
        return card;
    }
    
    viewBrand(brandId) {
        const brand = this.brands.find(b => b.id === brandId);
        if (!brand || brand.cars.length === 0) {
            this.showNotification('No cars available for this brand', 'info');
            return;
        }
        
        this.selectedBrand = brand;
        
        // Update URL hash
        window.location.hash = brandId;
        
        // Show brand modal
        this.showBrandModal(brand);
    }
    
    showBrandModal(brand) {
        const modal = document.getElementById('carModal');
        const content = document.getElementById('carModalContent');
        
        if (!modal || !content) return;
        
        // Create modal content
        content.innerHTML = `
            <div class="brand-modal-header">
                <div class="modal-brand-info">
                    <img src="${brand.logo}" alt="${brand.name}" class="modal-brand-logo"
                         onerror="this.src='https://via.placeholder.com/80/2a2a3a/ffffff?text=${brand.name.charAt(0)}'">
                    <div>
                        <h4>${brand.name}</h4>
                        <p>${brand.tagline}</p>
                    </div>
                </div>
                <div class="modal-brand-stats">
                    <div class="modal-stat">
                        <div class="modal-stat-value">${brand.cars.length}</div>
                        <div class="modal-stat-label">Total Cars</div>
                    </div>
                    <div class="modal-stat">
                        <div class="modal-stat-value">${brand.stats.available}</div>
                        <div class="modal-stat-label">Available</div>
                    </div>
                </div>
            </div>
            
            <div class="cars-grid">
                ${brand.cars.map(car => this.createCarCard(car)).join('')}
            </div>
            
            <div class="modal-actions">
                <button class="btn-whatsapp-large" onclick="showroom.contactBrand('${brand.id}')">
                    <i class="fab fa-whatsapp"></i> Inquire About ${brand.name}
                </button>
            </div>
        `;
        
        // Show modal
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
    
    createCarCard(car) {
        const mainImage = car.images && car.images.length > 0 ? car.images[0] : '';
        const statusClass = car.status === 'available' ? 'available' : 
                          car.status === 'sold' ? 'sold' : 'reserved';
        
        return `
            <div class="car-card" data-car-id="${car.id}">
                <div class="car-images">
                    ${mainImage ? `<img src="${mainImage}" alt="${car.model}" class="car-main-image">` : ''}
                    <div class="car-image-count">${car.images?.length || 0} photos</div>
                    <div class="car-status ${statusClass}">${car.status.toUpperCase()}</div>
                </div>
                
                <div class="car-details">
                    <h4 class="car-title">${car.year} ${car.brand} ${car.model}</h4>
                    
                    <div class="car-specs">
                        ${car.engine ? `<div class="car-spec"><i class="fas fa-cogs"></i> ${car.engine}</div>` : ''}
                        ${car.transmission ? `<div class="car-spec"><i class="fas fa-exchange-alt"></i> ${car.transmission}</div>` : ''}
                        ${car.fuel ? `<div class="car-spec"><i class="fas fa-gas-pump"></i> ${car.fuel}</div>` : ''}
                        ${car.color ? `<div class="car-spec"><i class="fas fa-palette"></i> ${car.color}</div>` : ''}
                    </div>
                    
                    ${car.description ? `<p class="car-description">${car.description}</p>` : ''}
                    
                    <div class="car-price-section">
                        <div class="car-price">KSh ${parseInt(car.price).toLocaleString()}</div>
                        <div class="car-actions">
                            <button class="btn-view-images" onclick="showroom.viewCarImages('${car.id}')">
                                <i class="fas fa-images"></i> View Photos
                            </button>
                            <button class="btn-inquire" onclick="showroom.inquireCar('${car.id}')">
                                <i class="fab fa-whatsapp"></i> Inquire Now
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    viewCarImages(carId) {
        const car = this.cars.find(c => c.id === carId);
        if (!car || !car.images || car.images.length === 0) {
            this.showNotification('No images available for this car', 'info');
            return;
        }
        
        // Populate gallery
        const wrapper = document.getElementById('gallerySwiperWrapper');
        if (wrapper) {
            wrapper.innerHTML = car.images.map(img => `
                <div class="swiper-slide">
                    <img src="${img}" alt="Car Image" class="gallery-image">
                </div>
            `).join('');
            
            // Update swiper
            this.gallerySwiper.update();
            
            // Show gallery modal
            document.getElementById('galleryModal').style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
    }
    
    inquireCar(carId) {
        const car = this.cars.find(c => c.id === carId);
        if (!car) return;
        
        const message = encodeURIComponent(
            `🚗 *CAR INQUIRY - Frank Auto Deals*\n\n` +
            `I'm interested in this car:\n` +
            `*${car.year} ${car.brand} ${car.model}*\n` +
            `*Price:* KSh ${parseInt(car.price).toLocaleString()}\n` +
            `*Engine:* ${car.engine || 'N/A'}\n` +
            `*Color:* ${car.color || 'N/A'}\n\n` +
            `Please provide more details and availability.`
        );
        
        window.open(`https://wa.me/${this.whatsappNumber}?text=${message}`, '_blank');
    }
    
    contactBrand(brandId) {
        const brand = this.brands.find(b => b.id === brandId);
        const brandName = brand ? brand.name : '';
        
        const message = encodeURIComponent(
            `🏎️ *BRAND INQUIRY - Frank Auto Deals*\n\n` +
            `I'm interested in ${brandName} vehicles from your showroom.\n` +
            `Please send me available models and prices.`
        );
        
        window.open(`https://wa.me/${this.whatsappNumber}?text=${message}`, '_blank');
    }
    
    contactWhatsApp() {
        const message = encodeURIComponent(
            `👋 *GENERAL INQUIRY - Frank Auto Deals*\n\n` +
            `Hello, I'm interested in vehicles from your showroom.\n` +
            `Please assist me with available options.`
        );
        
        window.open(`https://wa.me/${this.whatsappNumber}?text=${message}`, '_blank');
    }
    
    filterByBrand(brandId) {
        this.currentFilter = brandId;
        
        if (brandId === 'all') {
            this.filteredBrands = this.brands.filter(brand => brand.cars.length > 0);
        } else if (brandId === 'other') {
            // Show brands with fewer than 3 cars
            this.filteredBrands = this.brands.filter(brand => 
                brand.cars.length > 0 && brand.cars.length < 3
            );
        } else {
            this.filteredBrands = this.brands.filter(brand => 
                brand.id === brandId && brand.cars.length > 0
            );
        }
        
        this.renderShowroom();
        this.updateFilterButtons();
        
        // Scroll to grid
        document.querySelector('.brands-grid-section').scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
    
    setView(view) {
        this.currentView = view;
        
        // Update active button
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.view === view);
        });
        
        // Update grid class
        const grid = document.getElementById('brandsGrid');
        if (grid) {
            grid.className = `brands-grid ${view}-view`;
        }
    }
    
    sortBrands(criteria) {
        switch(criteria) {
            case 'name':
                this.filteredBrands.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'cars':
                this.filteredBrands.sort((a, b) => b.cars.length - a.cars.length);
                break;
            case 'price':
                this.filteredBrands.sort((a, b) => b.stats.maxPrice - a.stats.maxPrice);
                break;
            case 'newest':
                // Sort by latest car year
                this.filteredBrands.sort((a, b) => {
                    const aYear = Math.max(...a.cars.map(c => parseInt(c.year) || 0));
                    const bYear = Math.max(...b.cars.map(c => parseInt(c.year) || 0));
                    return bYear - aYear;
                });
                break;
        }
        
        this.renderShowroom();
    }
    
    searchCars(query) {
        const searchTerm = query.toLowerCase().trim();
        
        if (!searchTerm) {
            this.filteredBrands = this.brands.filter(brand => brand.cars.length > 0);
            this.renderShowroom();
            return;
        }
        
        // Filter brands that have cars matching the search
        this.filteredBrands = this.brands.filter(brand => {
            return brand.cars.some(car => 
                car.model.toLowerCase().includes(searchTerm) ||
                car.description?.toLowerCase().includes(searchTerm) ||
                car.engine?.toLowerCase().includes(searchTerm) ||
                car.color?.toLowerCase().includes(searchTerm) ||
                car.year.toString().includes(searchTerm)
            );
        });
        
        this.renderShowroom();
        
        // Show notification if no results
        if (this.filteredBrands.length === 0) {
            this.showNotification('No cars found matching your search', 'info');
        }
    }
    
    updateStats() {
        const totalCars = this.cars.length;
        const availableCars = this.cars.filter(c => c.status === 'available').length;
        const totalBrands = this.filteredBrands.length;
        const totalValue = this.cars.reduce((sum, car) => sum + (parseInt(car.price) || 0), 0);
        
        // Update header stats
        document.getElementById('totalCars').textContent = totalCars;
        document.getElementById('availableCars').textContent = availableCars;
        document.getElementById('totalBrands').textContent = totalBrands;
        
        // Update hero stats
        document.getElementById('heroTotalCars').textContent = totalCars;
        document.getElementById('heroTotalBrands').textContent = totalBrands;
        document.getElementById('heroTotalValue').textContent = `KSh ${(totalValue / 1000000).toFixed(1)}M`;
        
        // Update last updated time
        document.getElementById('lastUpdated').textContent = new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
        });
    }
    
    updateFilterButtons() {
        document.querySelectorAll('.filter-btn').forEach(btn => {
            const brand = btn.dataset.brand;
            btn.classList.toggle('active', brand === this.currentFilter);
        });
    }
    
    scrollFilter(amount) {
        const scrollContainer = document.querySelector('.filter-scroll');
        if (scrollContainer) {
            scrollContainer.scrollBy({ left: amount, behavior: 'smooth' });
        }
    }
    
    refreshData() {
        this.showNotification('Refreshing data...', 'info');
        
        // Reload from localStorage
        this.loadData();
        
        // Re-render
        this.renderShowroom();
        this.updateStats();
        
        setTimeout(() => {
            this.showNotification('Data refreshed successfully', 'success');
        }, 500);
    }
    
    closeModal() {
        document.getElementById('carModal').style.display = 'none';
        document.getElementById('galleryModal').style.display = 'none';
        document.body.style.overflow = 'auto';
        
        // Clear URL hash
        window.location.hash = '';
    }
    
    hideLoading() {
        const loading = document.getElementById('loadingState');
        if (loading) {
            loading.style.display = 'none';
        }
    }
    
    handleHashChange() {
        const hash = window.location.hash.substring(1);
        if (hash && this.brands.some(b => b.id === hash)) {
            this.viewBrand(hash);
        }
    }
    
    showNotification(message, type = 'info') {
        const toast = document.getElementById('notificationToast');
        const messageEl = document.getElementById('toastMessage');
        const iconEl = document.getElementById('toastIcon');
        
        if (!toast || !messageEl) return;
        
        // Set message and icon
        messageEl.textContent = message;
        
        // Set icon based on type
        switch(type) {
            case 'success':
                iconEl.className = 'toast-icon fas fa-check-circle';
                break;
            case 'error':
                iconEl.className = 'toast-icon fas fa-exclamation-circle';
                break;
            case 'warning':
                iconEl.className = 'toast-icon fas fa-exclamation-triangle';
                break;
            default:
                iconEl.className = 'toast-icon fas fa-info-circle';
        }
        
        // Show toast
        toast.classList.add('show');
        
        // Auto hide after 3 seconds
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
}

// Initialize showroom when DOM is ready
let showroom;

document.addEventListener('DOMContentLoaded', function() {
    console.log('📱 DOM ready - starting luxury showroom');
    
    // Create and initialize showroom
    showroom = new LuxuryShowroom();
    window.showroom = showroom;
    
    // Add CSS for notification toast
    const toastStyle = document.createElement('style');
    toastStyle.textContent = `
        .notification-toast {
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--black-light);
            border: 1px solid var(--gold);
            border-radius: var(--border-radius);
            padding: 1rem 1.5rem;
            display: flex;
            align-items: center;
            gap: 1rem;
            z-index: 2001;
            transform: translateX(150%);
            transition: transform 0.3s ease;
            box-shadow: var(--shadow-heavy);
            max-width: 400px;
        }
        
        .notification-toast.show {
            transform: translateX(0);
        }
        
        .toast-content {
            display: flex;
            align-items: center;
            gap: 1rem;
        }
        
        .toast-icon {
            font-size: 1.5rem;
            color: var(--gold);
        }
        
        .toast-text p {
            color: var(--white);
            margin: 0;
        }
        
        .toast-progress {
            position: absolute;
            bottom: 0;
            left: 0;
            height: 3px;
            background: var(--gold);
            width: 100%;
            transform-origin: left;
            animation: progress 3s linear forwards;
        }
        
        @keyframes progress {
            from { transform: scaleX(1); }
            to { transform: scaleX(0); }
        }
        
        /* Modal car styles */
        .brand-modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 2rem;
            padding-bottom: 1.5rem;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .modal-brand-info {
            display: flex;
            align-items: center;
            gap: 1.5rem;
        }
        
        .modal-brand-logo {
            width: 80px;
            height: 80px;
            object-fit: contain;
        }
        
        .modal-brand-info h4 {
            font-size: 1.8rem;
            color: var(--white);
            margin-bottom: 0.3rem;
        }
        
        .modal-brand-info p {
            color: var(--gray-light);
        }
        
        .modal-brand-stats {
            display: flex;
            gap: 2rem;
        }
        
        .modal-stat {
            text-align: center;
        }
        
        .modal-stat-value {
            font-size: 2rem;
            font-weight: 700;
            color: var(--gold);
        }
        
        .modal-stat-label {
            color: var(--gray-light);
            font-size: 0.9rem;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        
        .cars-grid {
            display: grid;
            gap: 1.5rem;
            margin-bottom: 2rem;
            max-height: 400px;
            overflow-y: auto;
            padding-right: 1rem;
        }
        
        .car-card {
            background: rgba(255, 255, 255, 0.05);
            border-radius: var(--border-radius);
            overflow: hidden;
            border: 1px solid rgba(255, 255, 255, 0.1);
            transition: var(--transition-smooth);
        }
        
        .car-card:hover {
            border-color: var(--gold);
            transform: translateY(-2px);
        }
        
        .car-images {
            position: relative;
            height: 200px;
            overflow: hidden;
        }
        
        .car-main-image {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        
        .car-image-count {
            position: absolute;
            top: 1rem;
            right: 1rem;
            background: rgba(0, 0, 0, 0.7);
            color: white;
            padding: 0.3rem 0.8rem;
            border-radius: var(--border-radius-sm);
            font-size: 0.8rem;
        }
        
        .car-status {
            position: absolute;
            bottom: 1rem;
            left: 1rem;
            padding: 0.3rem 1rem;
            border-radius: 20px;
            font-size: 0.8rem;
            font-weight: 600;
            text-transform: uppercase;
        }
        
        .car-status.available {
            background: var(--glow-green);
            color: var(--black);
        }
        
        .car-status.sold {
            background: #FF003C;
            color: white;
        }
        
        .car-status.reserved {
            background: #FFD700;
            color: var(--black);
        }
        
        .car-details {
            padding: 1.5rem;
        }
        
        .car-title {
            font-size: 1.3rem;
            color: var(--white);
            margin-bottom: 1rem;
        }
        
        .car-specs {
            display: flex;
            flex-wrap: wrap;
            gap: 1rem;
            margin-bottom: 1rem;
        }
        
        .car-spec {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            color: var(--gray-light);
            font-size: 0.9rem;
        }
        
        .car-spec i {
            color: var(--gold);
        }
        
        .car-description {
            color: var(--gray-light);
            font-size: 0.95rem;
            line-height: 1.5;
            margin-bottom: 1rem;
        }
        
        .car-price-section {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .car-price {
            font-size: 1.5rem;
            font-weight: 700;
            color: var(--gold);
        }
        
        .car-actions {
            display: flex;
            gap: 0.8rem;
        }
        
        .btn-view-images, .btn-inquire {
            padding: 0.8rem 1.2rem;
            border: none;
            border-radius: var(--border-radius);
            font-weight: 600;
            cursor: pointer;
            transition: var(--transition-smooth);
            font-size: 0.9rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .btn-view-images {
            background: rgba(255, 255, 255, 0.1);
            color: var(--white);
        }
        
        .btn-view-images:hover {
            background: rgba(255, 255, 255, 0.2);
        }
        
        .btn-inquire {
            background: #25D366;
            color: white;
        }
        
        .btn-inquire:hover {
            background: #128C7E;
            transform: translateY(-2px);
        }
        
        .modal-actions {
            text-align: center;
            padding-top: 2rem;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .btn-whatsapp-large {
            background: #25D366;
            color: white;
            border: none;
            padding: 1rem 2.5rem;
            border-radius: var(--border-radius);
            font-size: 1.1rem;
            font-weight: 600;
            cursor: pointer;
            transition: var(--transition-smooth);
            display: inline-flex;
            align-items: center;
            gap: 1rem;
        }
        
        .btn-whatsapp-large:hover {
            background: #128C7E;
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(37, 211, 102, 0.3);
        }
        
        /* Gallery modal */
        .gallery-container {
            width: 90%;
            max-width: 1000px;
            height: 80vh;
            background: var(--black-light);
            border-radius: var(--border-radius-lg);
            border: 1px solid rgba(212, 175, 55, 0.3);
            overflow: hidden;
        }
        
        .gallery-header {
            padding: 1.5rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: rgba(0, 0, 0, 0.5);
        }
        
        .gallery-close, .gallery-prev, .gallery-next {
            background: rgba(255, 255, 255, 0.1);
            border: none;
            color: white;
            width: 45px;
            height: 45px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: var(--transition-fast);
        }
        
        .gallery-close:hover, .gallery-prev:hover, .gallery-next:hover {
            background: var(--gold);
            color: var(--black);
        }
        
        .gallery-nav {
            display: flex;
            gap: 0.5rem;
        }
        
        .gallery-content {
            height: calc(80vh - 90px);
        }
        
        .gallery-image {
            width: 100%;
            height: 100%;
            object-fit: contain;
        }
    `;
    document.head.appendChild(toastStyle);
    
    console.log('🎉 Luxury Showroom initialized!');
});

// Handle gallery close
document.getElementById('closeGallery')?.addEventListener('click', () => {
    showroom.closeModal();
});

document.getElementById('galleryModal')?.addEventListener('click', (e) => {
    if (e.target === document.getElementById('galleryModal')) {
        showroom.closeModal();
    }
});
