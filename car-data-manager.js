/**
 * FRANK AUTO DEALS - Car Data Manager JS
 * Manages car data, filtering, and dynamic loading
 */

class CarDataManager {
    constructor() {
        this.cars = [];
        this.filteredCars = [];
        this.currentFilter = 'all';
        this.currentSearch = '';
        this.init();
    }

    init() {
        this.loadCarData();
        this.setupEventListeners();
        this.renderCars();
    }

    // Load car data from API or local storage
    async loadCarData() {
        try {
            // Try to load from API first
            const response = await fetch('/api/cars');
            if (response.ok) {
                this.cars = await response.json();
            } else {
                // Fallback to local data
                this.cars = this.getLocalCarData();
            }
        } catch (error) {
            console.error('Error loading car data:', error);
            this.cars = this.getLocalCarData();
        }
        
        this.filteredCars = [...this.cars];
        this.saveToLocalStorage();
    }

    // Get local car data (fallback)
    getLocalCarData() {
        return [
            {
                id: 1,
                name: 'Toyota Land Cruiser V8',
                brand: 'Toyota',
                model: 'Land Cruiser',
                year: 2023,
                price: 25000000,
                currency: 'KSh',
                fuel: 'Petrol',
                transmission: 'Automatic',
                mileage: '5,000 km',
                color: 'White',
                type: 'suv',
                features: ['4WD', 'Leather Seats', 'Sunroof', 'Navigation', 'Camera 360'],
                description: 'Top of the line luxury SUV with all features',
                images: ['assets/images/cars/toyota-landcruiser.jpg'],
                status: 'available',
                location: 'Nairobi',
                createdAt: '2024-01-15'
            },
            // Add more car objects...
        ];
    }

    // Save to local storage
    saveToLocalStorage() {
        localStorage.setItem('frank-cars', JSON.stringify(this.cars));
    }

    // Load from local storage
    loadFromLocalStorage() {
        const saved = localStorage.getItem('frank-cars');
        if (saved) {
            this.cars = JSON.parse(saved);
            this.filteredCars = [...this.cars];
            return true;
        }
        return false;
    }

    // Setup event listeners
    setupEventListeners() {
        // Filter tabs
        document.querySelectorAll('.filter-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const filter = e.target.dataset.filter;
                this.applyFilter(filter);
            });
        });

        // Search input
        const searchInput = document.querySelector('.search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchCars(e.target.value);
            });
        }

        // Sort options
        document.querySelectorAll('.sort-option').forEach(option => {
            option.addEventListener('click', (e) => {
                const sortBy = e.target.dataset.sort;
                this.sortCars(sortBy);
            });
        });
    }

    // Apply filter to cars
    applyFilter(filter) {
        this.currentFilter = filter;
        this.updateFilteredCars();
        this.renderCars();
        this.updateFilterUI(filter);
    }

    // Update filtered cars based on current filter and search
    updateFilteredCars() {
        let filtered = [...this.cars];

        // Apply type filter
        if (this.currentFilter !== 'all') {
            filtered = filtered.filter(car => car.type === this.currentFilter);
        }

        // Apply search filter
        if (this.currentSearch) {
            const searchTerm = this.currentSearch.toLowerCase();
            filtered = filtered.filter(car => 
                car.name.toLowerCase().includes(searchTerm) ||
                car.brand.toLowerCase().includes(searchTerm) ||
                car.model.toLowerCase().includes(searchTerm) ||
                car.features.some(f => f.toLowerCase().includes(searchTerm))
            );
        }

        this.filteredCars = filtered;
    }

    // Search cars
    searchCars(query) {
        this.currentSearch = query;
        this.updateFilteredCars();
        this.renderCars();
        this.showSearchResults(query);
    }

    // Sort cars
    sortCars(sortBy) {
        switch(sortBy) {
            case 'price-low':
                this.filteredCars.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                this.filteredCars.sort((a, b) => b.price - a.price);
                break;
            case 'year-new':
                this.filteredCars.sort((a, b) => b.year - a.year);
                break;
            case 'year-old':
                this.filteredCars.sort((a, b) => a.year - b.year);
                break;
            case 'name':
                this.filteredCars.sort((a, b) => a.name.localeCompare(b.name));
                break;
        }
        
        this.renderCars();
        this.updateSortUI(sortBy);
    }

    // Render cars to the grid
    renderCars() {
        const grid = document.getElementById('featuredCars');
        if (!grid) return;

        grid.innerHTML = this.filteredCars.map(car => this.generateCarCard(car)).join('');
        
        // Add event listeners to new cards
        this.setupCardInteractions();
        
        // Update car count
        this.updateCarCount();
    }

    // Generate car card HTML
    generateCarCard(car) {
        return `
            <div class="car-card" data-id="${car.id}" data-type="${car.type}">
                <div class="car-card-inner">
                    <div class="car-image">
                        <img src="${car.images[0]}" alt="${car.name}" 
                             data-src="${car.images[0]}" 
                             onerror="this.src='assets/images/cars/default-car.jpg'">
                        <div class="car-badge ${car.type}">
                            ${this.getTypeLabel(car.type)}
                        </div>
                        <div class="car-status ${car.status}">
                            ${car.status.toUpperCase()}
                        </div>
                        <div class="car-overlay">
                            <button class="quick-view" data-id="${car.id}">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="favorite-btn" data-id="${car.id}">
                                <i class="far fa-heart"></i>
                            </button>
                        </div>
                    </div>
                    
                    <div class="car-info">
                        <div class="car-header">
                            <div class="car-brand">${car.brand}</div>
                            <h3 class="car-name">${car.name}</h3>
                            <div class="car-price">${car.currency} ${this.formatPrice(car.price)}</div>
                        </div>
                        
                        <div class="car-specs">
                            <div class="spec-item">
                                <i class="fas fa-calendar"></i>
                                <span>${car.year}</span>
                            </div>
                            <div class="spec-item">
                                <i class="fas fa-gas-pump"></i>
                                <span>${car.fuel}</span>
                            </div>
                            <div class="spec-item">
                                <i class="fas fa-cog"></i>
                                <span>${car.transmission}</span>
                            </div>
                            <div class="spec-item">
                                <i class="fas fa-tachometer-alt"></i>
                                <span>${car.mileage}</span>
                            </div>
                        </div>
                        
                        <div class="car-features">
                            ${car.features.slice(0, 3).map(feature => `
                                <span class="feature-tag">${feature}</span>
                            `).join('')}
                            ${car.features.length > 3 ? `
                                <span class="feature-tag more">+${car.features.length - 3}</span>
                            ` : ''}
                        </div>
                        
                        <div class="car-actions">
                            <button class="btn-details" data-id="${car.id}">
                                <i class="fas fa-info-circle"></i>
                                <span>View Details</span>
                            </button>
                            <button class="btn-enquire" onclick="orderViaWhatsApp('${car.name}', ${car.price})">
                                <i class="fab fa-whatsapp"></i>
                                <span>Enquire Now</span>
                            </button>
                        </div>
                    </div>
                    
                    <div class="car-glow"></div>
                </div>
            </div>
        `;
    }

    // Setup card interactions
    setupCardInteractions() {
        // Quick view
        document.querySelectorAll('.quick-view').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const carId = parseInt(e.currentTarget.dataset.id);
                this.showQuickView(carId);
            });
        });

        // Favorite button
        document.querySelectorAll('.favorite-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const carId = parseInt(e.currentTarget.dataset.id);
                this.toggleFavorite(carId);
            });
        });

        // View details
        document.querySelectorAll('.btn-details').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const carId = parseInt(e.currentTarget.dataset.id);
                this.showCarDetails(carId);
            });
        });
    }

    // Show quick view modal
    showQuickView(carId) {
        const car = this.cars.find(c => c.id === carId);
        if (!car) return;

        const modal = this.createQuickViewModal(car);
        document.body.appendChild(modal);
        this.showModal(modal);
    }

    // Create quick view modal
    createQuickViewModal(car) {
        const modal = document.createElement('div');
        modal.className = 'modal quick-view-modal';
        modal.innerHTML = `
            <div class="modal-backdrop" onclick="this.parentElement.remove()"></div>
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${car.name}</h3>
                    <button class="close-modal" onclick="this.closest('.modal').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="quick-view-content">
                        <div class="car-images">
                            <img src="${car.images[0]}" alt="${car.name}">
                        </div>
                        <div class="car-details">
                            <div class="price-section">
                                <span class="price">${car.currency} ${this.formatPrice(car.price)}</span>
                                <span class="status ${car.status}">${car.status.toUpperCase()}</span>
                            </div>
                            <div class="specs-grid">
                                <div class="spec-item">
                                    <i class="fas fa-calendar"></i>
                                    <span>Year: ${car.year}</span>
                                </div>
                                <div class="spec-item">
                                    <i class="fas fa-gas-pump"></i>
                                    <span>Fuel: ${car.fuel}</span>
                                </div>
                                <div class="spec-item">
                                    <i class="fas fa-cog"></i>
                                    <span>Transmission: ${car.transmission}</span>
                                </div>
                                <div class="spec-item">
                                    <i class="fas fa-palette"></i>
                                    <span>Color: ${car.color}</span>
                                </div>
                            </div>
                            <div class="features-list">
                                <h4>Features</h4>
                                <div class="features-grid">
                                    ${car.features.map(feature => `
                                        <span class="feature-item">
                                            <i class="fas fa-check"></i>
                                            ${feature}
                                        </span>
                                    `).join('')}
                                </div>
                            </div>
                            <div class="action-buttons">
                                <button class="btn-primary" onclick="orderViaWhatsApp('${car.name}', ${car.price})">
                                    <i class="fab fa-whatsapp"></i>
                                    Enquire on WhatsApp
                                </button>
                                <button class="btn-secondary" onclick="window.location.href='/car-details.html?id=${car.id}'">
                                    <i class="fas fa-info-circle"></i>
                                    Full Details
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        return modal;
    }

    // Show modal
    showModal(modal) {
        modal.style.display = 'block';
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);
    }

    // Toggle favorite
    toggleFavorite(carId) {
        const favorites = JSON.parse(localStorage.getItem('frank-favorites') || '[]');
        const index = favorites.indexOf(carId);
        
        if (index === -1) {
            favorites.push(carId);
        } else {
            favorites.splice(index, 1);
        }
        
        localStorage.setItem('frank-favorites', JSON.stringify(favorites));
        this.updateFavoriteButton(carId, index === -1);
    }

    // Update favorite button
    updateFavoriteButton(carId, isFavorite) {
        const btn = document.querySelector(`.favorite-btn[data-id="${carId}"]`);
        if (btn) {
            const icon = btn.querySelector('i');
            if (isFavorite) {
                icon.className = 'fas fa-heart';
                btn.style.color = '#FF003C';
            } else {
                icon.className = 'far fa-heart';
                btn.style.color = '';
            }
        }
    }

    // Show car details page
    showCarDetails(carId) {
        window.location.href = `/car-details.html?id=${carId}`;
    }

    // Update filter UI
    updateFilterUI(filter) {
        document.querySelectorAll('.filter-tab').forEach(tab => {
            if (tab.dataset.filter === filter) {
                tab.classList.add('active');
            } else {
                tab.classList.remove('active');
            }
        });
    }

    // Update sort UI
    updateSortUI(sortBy) {
        document.querySelectorAll('.sort-option').forEach(option => {
            if (option.dataset.sort === sortBy) {
                option.classList.add('active');
            } else {
                option.classList.remove('active');
            }
        });
    }

    // Update car count
    updateCarCount() {
        const countElement = document.querySelector('.car-count');
        if (countElement) {
            countElement.textContent = this.filteredCars.length;
        }
    }

    // Show search results
    showSearchResults(query) {
        const resultsElement = document.querySelector('.search-results');
        if (resultsElement) {
            if (query) {
                resultsElement.textContent = `Found ${this.filteredCars.length} results for "${query}"`;
                resultsElement.style.display = 'block';
            } else {
                resultsElement.style.display = 'none';
            }
        }
    }

    // Helper methods
    formatPrice(price) {
        return price.toLocaleString();
    }

    getTypeLabel(type) {
        const labels = {
            'suv': 'SUV',
            'sports': 'SPORTS',
            'luxury': 'LUXURY',
            'new': 'NEW',
            'budget': 'BUDGET'
        };
        return labels[type] || type.toUpperCase();
    }

    // Get car by ID
    getCarById(id) {
        return this.cars.find(car => car.id === id);
    }

    // Get cars by brand
    getCarsByBrand(brand) {
        return this.cars.filter(car => car.brand.toLowerCase() === brand.toLowerCase());
    }

    // Get featured cars
    getFeaturedCars(limit = 6) {
        return this.cars.slice(0, limit);
    }

    // Get new arrivals
    getNewArrivals(limit = 4) {
        return [...this.cars]
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, limit);
    }

    // Get cars under price
    getCarsUnderPrice(maxPrice) {
        return this.cars.filter(car => car.price <= maxPrice);
    }
}

// Initialize Car Data Manager
document.addEventListener('DOMContentLoaded', () => {
    const carManager = new CarDataManager();
    window.CarDataManager = carManager;
});