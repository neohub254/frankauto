/**
 * FRANK AUTO DEALS - Brands Showroom
 * Complete and working version
 */

// Simple preloader hide - add this at the VERY TOP
(function() {
    // Hide preloader after max 3 seconds
    setTimeout(function() {
        const preloader = document.querySelector('.preloader');
        if (preloader) {
            preloader.style.opacity = '0';
            preloader.style.transition = 'opacity 0.5s ease';
            setTimeout(() => preloader.style.display = 'none', 500);
        }
    }, 3000);
})();

class BrandsShowroom {
    constructor() {
        this.cars = [];
        this.brands = [];
        this.compareList = [];
        this.currentView = 'brands';
        
        // Initialize immediately
        this.init();
    }
    
    init() {
        console.log('🚀 Initializing Brands Showroom...');
        
        // Load data
        this.loadData();
        
        // Setup everything
        this.setupEventListeners();
        this.updateStats();
        this.renderBrands();
        
        // Setup navigation
        this.setupNavigation();
        
        // Setup anchor links
        this.setupAnchorLinks();
        
        // Hide preloader when done
        this.hidePreloader();
        
        console.log('✅ Showroom ready!');
    }
    
    // ===== DATA LOADING =====
    loadData() {
        try {
            // Load cars from admin
            this.cars = JSON.parse(localStorage.getItem('frankCars')) || [];
            
            // Load brands or use defaults
            const savedBrands = JSON.parse(localStorage.getItem('frankBrands'));
            if (savedBrands && savedBrands.length > 0) {
                this.brands = savedBrands;
            } else {
                this.brands = this.getDefaultBrands();
                this.organizeCarsByBrand();
            }
            
            console.log(`📊 Loaded: ${this.cars.length} cars, ${this.brands.length} brands`);
            
        } catch (error) {
            console.error('❌ Error loading data:', error);
            this.brands = this.getDefaultBrands();
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
                id: 'toyota', 
                name: 'Toyota', 
                tagline: 'Reliability Redefined', 
                logo: 'toyotalogo.jpg',
                categories: ['japanese', 'budget', 'suv'],
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
                id: 'lexus', 
                name: 'Lexus', 
                tagline: 'The Pursuit of Perfection', 
                logo: 'lexuslogo.jpg',
                categories: ['luxury', 'japanese'],
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
            brand.stats.total = brand.cars.length;
            brand.stats.available = brand.cars.filter(c => c.status === 'available').length;
            
            // Calculate price range
            if (brand.cars.length > 0) {
                const prices = brand.cars.map(c => parseInt(c.price) || 0).filter(p => p > 0);
                if (prices.length > 0) {
                    brand.stats.minPrice = Math.min(...prices);
                    brand.stats.maxPrice = Math.max(...prices);
                }
            }
        });
        
        // Save to localStorage
        localStorage.setItem('frankBrands', JSON.stringify(this.brands));
    }
    
    // ===== UI UPDATES =====
    updateStats() {
        const totalCars = this.cars.length;
        const availableCars = this.cars.filter(c => c.status === 'available').length;
        const totalBrands = this.brands.length;
        const totalValue = this.cars.reduce((sum, car) => sum + (parseInt(car.price) || 0), 0);
        
        // Update elements if they exist
        const update = (id, value) => {
            const el = document.getElementById(id);
            if (el) el.textContent = value;
        };
        
        update('totalCars', totalCars);
        update('availableCars', availableCars);
        update('totalBrands', totalBrands);
        update('totalValue', `KSh ${(totalValue / 1000000).toFixed(1)}M`);
        
        // Update last updated time
        update('lastUpdated', new Date().toLocaleTimeString());
    }
    
    renderBrands() {
        const container = document.getElementById('brandsGrid');
        if (!container) return;
        
        container.innerHTML = '';
        
        this.brands.forEach(brand => {
            // Calculate stats if not already done
            if (!brand.stats) {
                brand.cars = this.cars.filter(car => car.brand === brand.id);
                brand.stats = {
                    total: brand.cars.length,
                    available: brand.cars.filter(c => c.status === 'available').length,
                    minPrice: 0,
                    maxPrice: 0
                };
            }
            
            const card = this.createBrandCard(brand);
            container.appendChild(card);
        });
        
        // If no cars, show message
        if (this.cars.length === 0) {
            container.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 60px;">
                    <i class="fas fa-flag" style="font-size: 4rem; color: #8a8f98; margin-bottom: 20px;"></i>
                    <h3 style="color: #8a8f98; margin-bottom: 10px;">No Cars Added Yet</h3>
                    <p style="color: #8a8f98; margin-bottom: 30px;">
                        Add cars in the Admin Dashboard to see them here.
                    </p>
                    <button onclick="window.open('admin-login.html', '_blank')" 
                            style="background: #00FF9D; color: black; border: none; 
                                   padding: 12px 30px; border-radius: 8px; font-weight: bold;
                                   cursor: pointer; margin: 10px;">
                        Go to Admin Dashboard
                    </button>
                </div>
            `;
        }
    }
    
    createBrandCard(brand) {
        const card = document.createElement('div');
        card.className = 'brand-card';
        card.dataset.brandId = brand.id;
        
        // Determine badge
        let badgeClass = 'badge-premium';
        let badgeText = 'PREMIUM';
        if (brand.categories.includes('luxury')) {
            badgeClass = 'badge-luxury';
            badgeText = 'LUXURY';
        }
        
        card.innerHTML = `
            <div class="brand-header">
                <div class="brand-logo-container">
                    <img src="${brand.logo}" alt="${brand.name}" class="brand-logo"
                         onerror="this.src='https://via.placeholder.com/80/2a2a3a/ffffff?text=${brand.name.charAt(0)}'">
                </div>
                <div class="brand-badge ${badgeClass}">${badgeText}</div>
            </div>
            
            <div class="brand-content">
                <h3 class="brand-name">${brand.name}</h3>
                <p class="brand-tagline">${brand.tagline}</p>
                
                <div class="brand-stats">
                    <div class="brand-stat">
                        <i class="fas fa-car stat-icon"></i>
                        <div class="stat-value">${brand.stats.total}</div>
                        <div class="stat-label">MODELS</div>
                    </div>
                    <div class="brand-stat">
                        <i class="fas fa-check-circle stat-icon"></i>
                        <div class="stat-value">${brand.stats.available}</div>
                        <div class="stat-label">AVAILABLE</div>
                    </div>
                </div>
                
                ${brand.stats.minPrice > 0 ? `
                    <div class="price-range">
                        <i class="fas fa-tag"></i>
                        <span>From KSh ${brand.stats.minPrice.toLocaleString()}</span>
                    </div>
                ` : ''}
                
                <div class="brand-features">
                    ${brand.categories.slice(0, 3).map(cat => 
                        `<span class="feature-tag">${cat.toUpperCase()}</span>`
                    ).join('')}
                </div>
            </div>
            
            <div class="brand-actions">
                <button class="btn-view" onclick="showroom.viewBrand('${brand.id}')">
                    <i class="fas fa-eye"></i> View ${brand.stats.total} Cars
                </button>
                <button class="btn-compare" onclick="showroom.addToCompare('${brand.id}')">
                    <i class="fas fa-balance-scale"></i> Compare
                </button>
            </div>
        `;
        
        return card;
    }
    
    // ===== VIEW MANAGEMENT =====
    viewBrand(brandId) {
        console.log('Viewing brand:', brandId);
        
        const brand = this.brands.find(b => b.id === brandId);
        if (!brand) return;
        
        // Update URL with hash
        window.history.pushState(null, '', `#${brandId}`);
        
        // Get cars for this brand
        const brandCars = this.cars.filter(car => car.brand === brandId);
        
        // Create modal
        this.showBrandModal(brand, brandCars);
    }
    
    showBrandModal(brand, cars) {
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.95);
            backdrop-filter: blur(10px);
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
            animation: fadeIn 0.3s ease;
        `;
        
        modal.innerHTML = `
            <div style="background: #1a1a2e; border-radius: 20px; padding: 40px; max-width: 1000px; width: 100%; max-height: 90vh; overflow-y: auto; position: relative; border: 1px solid rgba(0,255,157,0.2);">
                <button onclick="this.parentElement.parentElement.remove()" 
                        style="position: absolute; top: 20px; right: 20px; background: #FF003C; color: white; border: none; width: 40px; height: 40px; border-radius: 50%; font-size: 20px; cursor: pointer; z-index: 10;">
                    ×
                </button>
                
                <div style="display: flex; align-items: center; gap: 30px; margin-bottom: 40px; padding-bottom: 20px; border-bottom: 1px solid rgba(255,255,255,0.1);">
                    <div style="width: 100px; height: 100px; background: rgba(255,255,255,0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center; padding: 20px;">
                        <img src="${brand.logo}" alt="${brand.name}" style="max-width: 100%; max-height: 100%;"
                             onerror="this.src='https://via.placeholder.com/100/2a2a3a/ffffff?text=${brand.name.charAt(0)}'">
                    </div>
                    <div>
                        <h2 style="color: #00FF9D; margin-bottom: 10px; font-size: 2.5rem;">${brand.name}</h2>
                        <p style="color: #00F3FF; font-style: italic; font-size: 1.2rem;">${brand.tagline}</p>
                    </div>
                </div>
                
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 40px;">
                    <div style="text-align: center; padding: 25px; background: rgba(0,255,157,0.1); border-radius: 15px; border: 1px solid rgba(0,255,157,0.3);">
                        <div style="font-size: 2.5rem; font-weight: bold; color: #00FF9D;">${cars.length}</div>
                        <div style="color: #8a8f98; text-transform: uppercase; letter-spacing: 2px; font-size: 0.9rem;">Total Cars</div>
                    </div>
                    <div style="text-align: center; padding: 25px; background: rgba(0,243,255,0.1); border-radius: 15px; border: 1px solid rgba(0,243,255,0.3);">
                        <div style="font-size: 2.5rem; font-weight: bold; color: #00F3FF;">${cars.filter(c => c.status === 'available').length}</div>
                        <div style="color: #8a8f98; text-transform: uppercase; letter-spacing: 2px; font-size: 0.9rem;">Available</div>
                    </div>
                    <div style="text-align: center; padding: 25px; background: rgba(255,215,0,0.1); border-radius: 15px; border: 1px solid rgba(255,215,0,0.3);">
                        <div style="font-size: 2.5rem; font-weight: bold; color: #FFD700;">
                            ${cars.length > 0 ? 'KSh ' + Math.min(...cars.map(c => parseInt(c.price) || 0)).toLocaleString() : '0'}
                        </div>
                        <div style="color: #8a8f98; text-transform: uppercase; letter-spacing: 2px; font-size: 0.9rem;">Starting Price</div>
                    </div>
                </div>
                
                <h3 style="color: white; margin-bottom: 20px; font-size: 1.5rem;">Available Vehicles</h3>
                
                <div style="display: grid; gap: 20px; max-height: 400px; overflow-y: auto; padding-right: 10px;">
                    ${cars.length > 0 ? cars.map(car => `
                        <div style="background: rgba(255,255,255,0.05); border-radius: 10px; padding: 20px; border: 1px solid rgba(255,255,255,0.1);">
                            <div style="display: flex; justify-content: space-between; align-items: start;">
                                <div>
                                    <h4 style="color: white; margin-bottom: 5px;">${car.model}</h4>
                                    <div style="color: #8a8f98; font-size: 0.9rem;">
                                        ${car.year} • ${car.color || 'N/A'} • ${car.engine || 'N/A'} • ${car.transmission || 'N/A'}
                                    </div>
                                </div>
                                <div style="text-align: right;">
                                    <div style="color: #00FF9D; font-weight: bold; font-size: 1.2rem;">
                                        KSh ${parseInt(car.price).toLocaleString()}
                                    </div>
                                    <div style="background: ${car.status === 'available' ? '#00FF9D' : car.status === 'sold' ? '#FF003C' : '#FFD700'}; 
                                          color: ${car.status === 'available' ? 'black' : 'white'}; 
                                          padding: 3px 10px; border-radius: 20px; font-size: 0.8rem; font-weight: bold; margin-top: 5px; display: inline-block;">
                                        ${car.status || 'N/A'}
                                    </div>
                                </div>
                            </div>
                            
                            ${car.description ? `
                                <div style="margin-top: 15px; color: #8a8f98; font-size: 0.9rem; line-height: 1.5;">
                                    ${car.description}
                                </div>
                            ` : ''}
                            
                            <div style="margin-top: 15px; display: flex; gap: 10px;">
                                <button onclick="showroom.inquireCar('${car.id}')" 
                                        style="background: #25D366; color: white; border: none; padding: 8px 15px; border-radius: 5px; font-size: 0.9rem; cursor: pointer; display: flex; align-items: center; gap: 5px;">
                                    <i class="fab fa-whatsapp"></i> Inquire
                                </button>
                            </div>
                        </div>
                    `).join('') : `
                        <div style="text-align: center; padding: 40px; color: #8a8f98;">
                            <i class="fas fa-car" style="font-size: 3rem; opacity: 0.3; margin-bottom: 20px;"></i>
                            <h4>No cars available for ${brand.name}</h4>
                            <p>Add ${brand.name} cars in the Admin Dashboard to see them here.</p>
                            <button onclick="window.open('admin-login.html', '_blank')" 
                                    style="background: #00FF9D; color: black; border: none; padding: 10px 20px; border-radius: 5px; margin-top: 15px; cursor: pointer; font-weight: bold;">
                                Add ${brand.name} Cars
                            </button>
                        </div>
                    `}
                </div>
                
                <div style="margin-top: 40px; display: flex; gap: 15px; justify-content: center;">
                    <button onclick="showroom.contactWhatsApp('${brand.name}')" 
                            style="background: #25D366; color: white; border: none; padding: 15px 30px; border-radius: 8px; font-weight: bold; cursor: pointer; display: flex; align-items: center; gap: 10px;">
                        <i class="fab fa-whatsapp"></i> Inquire About ${brand.name}
                    </button>
                    <button onclick="this.parentElement.parentElement.remove()" 
                            style="background: rgba(255,255,255,0.1); color: white; border: 1px solid rgba(255,255,255,0.3); padding: 15px 30px; border-radius: 8px; font-weight: bold; cursor: pointer;">
                        Close
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }
    
    // ===== EVENT HANDLERS =====
    setupEventListeners() {
        // Search
        const searchInput = document.getElementById('globalSearch');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchBrands(e.target.value);
            });
        }
        
        // Category tabs
        document.querySelectorAll('.filter-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const category = e.target.dataset.category;
                this.filterByCategory(category);
            });
        });
        
        // View toggle buttons
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const view = e.target.dataset.view;
                this.setView(view);
            });
        });
        
        // Nav buttons
        const adminBtn = document.querySelector('.admin-btn');
        if (adminBtn) {
            adminBtn.addEventListener('click', () => {
                window.open('admin-login.html', '_blank');
            });
        }
    }
    
    setupNavigation() {
        // Update compare count
        const savedCompare = localStorage.getItem('brandsCompareList');
        if (savedCompare) {
            this.compareList = JSON.parse(savedCompare);
            this.updateCompareUI();
        }
    }
    
    setupAnchorLinks() {
        // Check for hash on load
        const hash = window.location.hash.substring(1);
        if (hash && this.brands.some(b => b.id === hash)) {
            setTimeout(() => this.viewBrand(hash), 1000);
        }
        
        // Handle hash changes
        window.addEventListener('hashchange', () => {
            const newHash = window.location.hash.substring(1);
            if (newHash && this.brands.some(b => b.id === newHash)) {
                this.viewBrand(newHash);
            }
        });
    }
    
    // ===== UTILITY FUNCTIONS =====
    searchBrands(query) {
        const searchTerm = query.toLowerCase().trim();
        if (!searchTerm) return;
        
        const filtered = this.brands.filter(brand => 
            brand.name.toLowerCase().includes(searchTerm) ||
            brand.tagline.toLowerCase().includes(searchTerm) ||
            brand.categories.some(cat => cat.toLowerCase().includes(searchTerm))
        );
        
        this.renderFilteredBrands(filtered);
    }
    
    filterByCategory(category) {
        // Update active tab
        document.querySelectorAll('.filter-tab').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.category === category);
        });
        
        if (category === 'all') {
            this.renderBrands();
        } else {
            const filtered = this.brands.filter(brand => 
                brand.categories.includes(category)
            );
            this.renderFilteredBrands(filtered);
        }
    }
    
    renderFilteredBrands(filteredBrands) {
        const container = document.getElementById('brandsGrid');
        if (!container) return;
        
        container.innerHTML = '';
        filteredBrands.forEach(brand => {
            const card = this.createBrandCard(brand);
            container.appendChild(card);
        });
    }
    
    setView(view) {
        // Update active button
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.view === view);
        });
        
        if (view === 'all-cars') {
            this.showAllCars();
        } else {
            this.showBrandsView();
        }
    }
    
    showAllCars() {
        // Simple implementation - could be expanded
        const allCars = this.cars.filter(c => c.status === 'available');
        if (allCars.length > 0) {
            alert(`Showing ${allCars.length} available cars.`);
        } else {
            alert('No cars available. Add cars in Admin Dashboard.');
        }
    }
    
    showBrandsView() {
        // Already showing brands by default
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
    
    updateCompareUI() {
        const count = this.compareList.length;
        const countElement = document.getElementById('compareCount');
        if (countElement) countElement.textContent = count;
        
        localStorage.setItem('brandsCompareList', JSON.stringify(this.compareList));
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
            `Hello, I'm interested in this car. Please provide more details.`
        );
        
        window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
    }
    
    contactWhatsApp(brandName = '') {
        const phone = '254742436155';
        const message = encodeURIComponent(
            `🏎️ *SHOWROOM ENQUIRY - Frank Auto Deals*\n\n` +
            `${brandName ? `*Interested in:* ${brandName}\n\n` : ''}` +
            `Hello, I'm interested in vehicles from your showroom. Please assist me.`
        );
        
        window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
    }
    
    // ===== UI HELPERS =====
    hidePreloader() {
        const preloader = document.querySelector('.preloader');
        if (preloader) {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
        }
    }
    
    showMessage(text, type = 'info') {
        const message = document.createElement('div');
        message.textContent = text;
        message.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 25px;
            background: ${type === 'success' ? '#00FF9D' : type === 'warning' ? '#FFD700' : type === 'error' ? '#FF003C' : '#00F3FF'};
            color: #000;
            border-radius: 8px;
            font-weight: bold;
            z-index: 10000;
            box-shadow: 0 5px 20px rgba(0,0,0,0.3);
            animation: slideInRight 0.3s ease;
        `;
        
        document.body.appendChild(message);
        
        setTimeout(() => {
            message.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => message.remove(), 300);
        }, 3000);
    }
    
    goHome() {
        window.location.href = 'index.html';
    }
    
    refreshData() {
        this.showMessage('Refreshing data...', 'info');
        this.loadData();
        this.updateStats();
        this.renderBrands();
        setTimeout(() => {
            this.showMessage('Data refreshed successfully', 'success');
        }, 500);
    }
    
    toggleCompare() {
        const panel = document.getElementById('comparePanel');
        if (panel) panel.classList.toggle('hidden');
    }
    
    toggleFilters() {
        const panel = document.getElementById('filterPanel');
        if (panel) panel.classList.toggle('hidden');
    }
    
    closeCarModal() {
        const modal = document.getElementById('carModal');
        if (modal) modal.classList.add('hidden');
    }
    
    closeComparisonModal() {
        const modal = document.getElementById('comparisonModal');
        if (modal) modal.classList.add('hidden');
    }
    
    clearCompare() {
        this.compareList = [];
        this.updateCompareUI();
        this.showMessage('Comparison cleared', 'info');
    }
    
    showComparison() {
        if (this.compareList.length < 2) {
            this.showMessage('Select at least 2 brands to compare', 'warning');
            return;
        }
        this.showMessage('Compare feature - coming soon!', 'info');
    }
}

// ===== INITIALIZATION =====
// Create global instance
let showroom;

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('📱 DOM ready - starting showroom');
    
    // Create and initialize showroom
    showroom = new BrandsShowroom();
    window.showroom = showroom;
    
    // Add emergency CSS animations
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
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
    `;
    document.head.appendChild(style);
    
    // Add debug button
    const debugBtn = document.createElement('button');
    debugBtn.innerHTML = '🐛 DEBUG';
    debugBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #FF003C;
        color: white;
        padding: 10px 15px;
        border: none;
        border-radius: 5px;
        font-size: 12px;
        font-weight: bold;
        z-index: 9999;
        cursor: pointer;
        box-shadow: 0 2px 10px rgba(255,0,60,0.3);
    `;
    debugBtn.onclick = function() {
        const cars = JSON.parse(localStorage.getItem('frankCars')) || [];
        const brands = JSON.parse(localStorage.getItem('frankBrands')) || [];
        
        console.log('=== DEBUG INFO ===');
        console.log('Cars:', cars);
        console.log('Brands:', brands);
        
        alert(`Showroom Debug:
        • Cars: ${cars.length}
        • Brands: ${brands.length}
        • Showroom: ${showroom ? 'Loaded' : 'Not loaded'}
        • Check console for details`);
    };
    document.body.appendChild(debugBtn);
});

// Final safety - hide preloader no matter what
window.addEventListener('load', function() {
    setTimeout(() => {
        const preloader = document.querySelector('.preloader');
        if (preloader) {
            preloader.style.display = 'none';
            console.log('✅ Page fully loaded');
        }
    }, 4000);
});
