/**
 * FRANK AUTO DEALS - Admin System JS
 * Complete admin management and responsive functionality
 */

class AdminSystem {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeAdminFeatures();
        this.handleResponsiveDesign();
        this.setupSecurityFeatures();
        this.initializeDataTables();
    }

    // Setup all event listeners
    setupEventListeners() {
        // Mobile menu toggle
        document.getElementById('mobileMenuBtn')?.addEventListener('click', this.toggleMobileMenu.bind(this));
        
        // Theme toggle
        document.getElementById('themeToggle')?.addEventListener('click', this.toggleTheme.bind(this));
        
        // Back to top button
        document.getElementById('backToTop')?.addEventListener('click', this.scrollToTop.bind(this));
        
        // Admin access triple click
        this.setupAdminAccess();
        
        // Filter functionality
        this.setupFilters();
        
        // Search functionality
        this.setupSearch();
        
        // Car cards interactions
        this.setupCarCards();
        
        // Modal handlers
        this.setupModals();
    }

    // Initialize admin-specific features
    initializeAdminFeatures() {
        if (window.location.pathname.includes('admin')) {
            this.setupAdminDashboard();
            this.setupAdminDataManagement();
            this.setupAdminAnalytics();
        }
    }

    // Responsive design handlers
    handleResponsiveDesign() {
        // Responsive navigation
        this.handleResponsiveNav();
        
        // Responsive grid adjustments
        this.handleResponsiveGrid();
        
        // Touch interactions
        this.handleTouchInteractions();
        
        // Viewport adjustments
        this.handleViewportChanges();
    }

    // Security features
    setupSecurityFeatures() {
        // Session timeout
        this.setupSessionTimeout();
        
        // Activity logging
        this.logUserActivity();
        
        // Input sanitization
        this.sanitizeInputs();
        
        // CSRF protection
        this.setupCSRF();
    }

    // Mobile menu functionality
    toggleMobileMenu() {
        const menuBtn = document.getElementById('mobileMenuBtn');
        const navMenu = document.querySelector('.nav-menu');
        const navActions = document.querySelector('.nav-actions');
        
        if (menuBtn && navMenu) {
            menuBtn.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            // Also toggle actions on mobile
            if (window.innerWidth <= 768 && navActions) {
                navActions.classList.toggle('active');
            }
        }
    }

    // Theme toggle functionality
    toggleTheme() {
        const body = document.body;
        const themeToggle = document.getElementById('themeToggle');
        
        body.classList.toggle('light-theme');
        themeToggle.classList.toggle('active');
        
        // Save theme preference
        const theme = body.classList.contains('light-theme') ? 'light' : 'dark';
        localStorage.setItem('frank-theme', theme);
        
        // Update particles for theme
        this.updateParticlesTheme(theme);
    }

    // Scroll to top functionality
    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    // Setup admin access (triple click)
    setupAdminAccess() {
        let clickCount = 0;
        let clickTimer;
        
        document.addEventListener('click', (e) => {
            clickCount++;
            
            clearTimeout(clickTimer);
            clickTimer = setTimeout(() => {
                if (clickCount === 3) {
                    this.revealAdminPortal();
                }
                clickCount = 0;
            }, 500);
        });
    }

    // Reveal admin portal
    revealAdminPortal() {
        const adminLink = document.getElementById('adminLink');
        if (!adminLink) return;
        
        // Visual effects
        adminLink.style.cssText = `
            opacity: 1 !important;
            color: #00F3FF !important;
            background-color: rgba(0, 243, 255, 0.1) !important;
            border: 2px solid #00F3FF !important;
            box-shadow: 0 0 20px #00F3FF !important;
            transform: scale(1.05);
            transition: all 0.3s ease !important;
        `;
        
        // Add sound effect
        this.playSound('access');
        
        // Revert after timeout
        setTimeout(() => {
            adminLink.style.cssText = `
                opacity: 0.3 !important;
                transition: all 1s ease !important;
            `;
        }, 10000);
    }

    // Setup filter functionality
    setupFilters() {
        const filterTabs = document.querySelectorAll('.filter-tab');
        const carGrid = document.getElementById('featuredCars');
        
        filterTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Update active tab
                filterTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                // Filter cars
                const filter = tab.dataset.filter;
                this.filterCars(filter);
            });
        });
    }

    // Filter cars based on selection
    filterCars(filter) {
        const cars = document.querySelectorAll('.car-card');
        
        cars.forEach(car => {
            const carType = car.dataset.type || 'all';
            
            if (filter === 'all' || carType === filter) {
                car.style.display = 'block';
                setTimeout(() => {
                    car.style.opacity = '1';
                    car.style.transform = 'translateY(0)';
                }, 50);
            } else {
                car.style.opacity = '0';
                car.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    car.style.display = 'none';
                }, 300);
            }
        });
    }

    // Setup search functionality
    setupSearch() {
        const searchInput = document.querySelector('.search-input');
        const searchBtn = document.querySelector('.search-btn');
        
        if (searchInput && searchBtn) {
            searchBtn.addEventListener('click', () => this.performSearch(searchInput.value));
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.performSearch(searchInput.value);
            });
            
            // Live search
            searchInput.addEventListener('input', (e) => {
                this.performLiveSearch(e.target.value);
            });
        }
    }

    // Perform search
    performSearch(query) {
        if (!query.trim()) return;
        
        // Show loading
        this.showLoading();
        
        // Simulate API call
        setTimeout(() => {
            // Filter cars based on query
            const cars = document.querySelectorAll('.car-card');
            let results = 0;
            
            cars.forEach(car => {
                const carName = car.querySelector('.car-name')?.textContent.toLowerCase();
                const carBrand = car.querySelector('.car-brand')?.textContent.toLowerCase();
                const carFeatures = car.querySelector('.car-features')?.textContent.toLowerCase();
                
                if (carName?.includes(query.toLowerCase()) || 
                    carBrand?.includes(query.toLowerCase()) ||
                    carFeatures?.includes(query.toLowerCase())) {
                    car.style.display = 'block';
                    results++;
                } else {
                    car.style.display = 'none';
                }
            });
            
            // Show results count
            this.showSearchResults(results, query);
            
            // Hide loading
            this.hideLoading();
        }, 500);
    }

    // Live search
    performLiveSearch(query) {
        // Implement live search logic
        console.log('Live search:', query);
    }

    // Setup car card interactions
    setupCarCards() {
        // Load car data
        this.loadCarData();
        
        // Setup hover effects
        this.setupCardHoverEffects();
        
        // Setup click handlers
        this.setupCardClickHandlers();
    }

    // Load car data dynamically
    loadCarData() {
        const carGrid = document.getElementById('featuredCars');
        if (!carGrid) return;
        
        // Sample car data (in production, this would come from an API)
        const cars = [
            {
                id: 1,
                name: 'Toyota Land Cruiser V8',
                brand: 'Toyota',
                price: 'KSh 25,000,000',
                year: 2023,
                fuel: 'Petrol',
                transmission: 'Automatic',
                type: 'suv',
                image: 'assets/images/cars/toyota-landcruiser.jpg',
                features: ['4WD', 'Leather Seats', 'Sunroof', 'Navigation']
            },
            {
                id: 2,
                name: 'BMW M5 Competition',
                brand: 'BMW',
                price: 'KSh 18,500,000',
                year: 2024,
                fuel: 'Petrol',
                transmission: 'Automatic',
                type: 'sports',
                image: 'assets/images/cars/bmw-m5.jpg',
                features: ['V8 Engine', 'Carbon Fiber', 'M Sport Package', 'Heads-up Display']
            },
            {
                id: 3,
                name: 'Mercedes S-Class',
                brand: 'Mercedes',
                price: 'KSh 32,000,000',
                year: 2024,
                fuel: 'Hybrid',
                transmission: 'Automatic',
                type: 'luxury',
                image: 'assets/images/cars/mercedes-sclass.jpg',
                features: ['Maybach Edition', 'Massage Seats', 'Burmester Sound', 'Night Vision']
            },
            {
                id: 4,
                name: 'Porsche 911 Turbo S',
                brand: 'Porsche',
                price: 'KSh 45,000,000',
                year: 2024,
                fuel: 'Petrol',
                transmission: 'Automatic',
                type: 'sports',
                image: 'assets/images/cars/porsche-911.jpg',
                features: ['640 HP', '0-100km/h in 2.7s', 'Carbon Ceramic Brakes', 'Sport Chrono']
            },
            {
                id: 5,
                name: 'Range Rover Autobiography',
                brand: 'Range Rover',
                price: 'KSh 38,000,000',
                year: 2024,
                fuel: 'Petrol',
                transmission: 'Automatic',
                type: 'suv',
                image: 'assets/images/cars/range-rover-autobiography.jpg',
                features: ['Supercharged V8', 'Executive Seats', 'Terrain Response 2', 'Meridian Audio']
            },
            {
                id: 6,
                name: 'Toyota Prado TX',
                brand: 'Toyota',
                price: 'KSh 8,500,000',
                year: 2022,
                fuel: 'Diesel',
                transmission: 'Automatic',
                type: 'suv',
                image: 'assets/images/cars/toyota-prado.jpg',
                features: ['7 Seater', 'KDSS Suspension', 'Multi-terrain Select', 'Cool Box']
            }
        ];
        
        // Generate car cards
        carGrid.innerHTML = cars.map(car => this.generateCarCard(car)).join('');
    }

    // Generate car card HTML
    generateCarCard(car) {
        return `
            <div class="car-card" data-type="${car.type}">
                <div class="car-card-inner">
                    <div class="car-image">
                        <img src="${car.image}" alt="${car.name}" onerror="this.src='assets/images/cars/default-car.jpg'">
                        <div class="car-badge ${car.type}">
                            ${car.type.toUpperCase()}
                        </div>
                        <div class="car-overlay">
                            <button class="quick-view" data-id="${car.id}">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="whatsapp-enquiry" onclick="orderViaWhatsApp('${car.name}', '${car.price}')">
                                <i class="fab fa-whatsapp"></i>
                            </button>
                        </div>
                    </div>
                    
                    <div class="car-info">
                        <div class="car-header">
                            <h3 class="car-name">${car.name}</h3>
                            <div class="car-price">${car.price}</div>
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
                        </div>
                        
                        <div class="car-features">
                            ${car.features.map(feature => `
                                <span class="feature-tag">${feature}</span>
                            `).join('')}
                        </div>
                        
                        <div class="car-actions">
                            <button class="btn-details" data-id="${car.id}">
                                <i class="fas fa-info-circle"></i>
                                <span>Details</span>
                            </button>
                            <button class="btn-test-drive" onclick="openWhatsAppModal('${car.name}', '${car.price.replace('KSh ', '')}', '${car.image}')">
                                <i class="fas fa-car"></i>
                                <span>Test Drive</span>
                            </button>
                        </div>
                    </div>
                    
                    <div class="car-glow"></div>
                </div>
            </div>
        `;
    }

    // Setup card hover effects
    setupCardHoverEffects() {
        const cards = document.querySelectorAll('.car-card');
        
        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.classList.add('hover');
                const glow = card.querySelector('.car-glow');
                if (glow) glow.style.opacity = '1';
            });
            
            card.addEventListener('mouseleave', () => {
                card.classList.remove('hover');
                const glow = card.querySelector('.car-glow');
                if (glow) glow.style.opacity = '0';
            });
        });
    }

    // Setup card click handlers
    setupCardClickHandlers() {
        document.addEventListener('click', (e) => {
            // Quick view
            if (e.target.closest('.quick-view')) {
                const carId = e.target.closest('.quick-view').dataset.id;
                this.showQuickView(carId);
            }
            
            // Details button
            if (e.target.closest('.btn-details')) {
                const carId = e.target.closest('.btn-details').dataset.id;
                this.showCarDetails(carId);
            }
        });
    }

    // Show quick view modal
    showQuickView(carId) {
        // Implement quick view modal
        console.log('Quick view for car:', carId);
    }

    // Setup modals
    setupModals() {
        // Close modals on ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAllModals();
            }
        });
        
        // Close modals on outside click
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-backdrop')) {
                this.closeAllModals();
            }
        });
    }

    // Handle responsive navigation
    handleResponsiveNav() {
        // Check viewport and adjust navigation
        const checkViewport = () => {
            const nav = document.querySelector('.hologram-nav');
            if (!nav) return;
            
            if (window.innerWidth <= 768) {
                nav.classList.add('mobile');
                this.setupMobileNav();
            } else {
                nav.classList.remove('mobile');
            }
        };
        
        // Initial check
        checkViewport();
        
        // Check on resize
        window.addEventListener('resize', checkViewport);
    }

    // Setup mobile navigation
    setupMobileNav() {
        // Add touch events for mobile menu
        const menuBtn = document.getElementById('mobileMenuBtn');
        if (menuBtn) {
            menuBtn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.toggleMobileMenu();
            });
        }
        
        // Setup touch for dropdowns
        const dropdowns = document.querySelectorAll('.nav-dropdown');
        dropdowns.forEach(dropdown => {
            dropdown.addEventListener('touchstart', (e) => {
                e.preventDefault();
                dropdown.classList.toggle('active');
            });
        });
    }

    // Handle responsive grid adjustments
    handleResponsiveGrid() {
        const adjustGrid = () => {
            const grid = document.querySelector('.featured-grid');
            if (!grid) return;
            
            if (window.innerWidth <= 576) {
                grid.style.gridTemplateColumns = 'repeat(1, 1fr)';
            } else if (window.innerWidth <= 992) {
                grid.style.gridTemplateColumns = 'repeat(2, 1fr)';
            } else {
                grid.style.gridTemplateColumns = 'repeat(3, 1fr)';
            }
        };
        
        adjustGrid();
        window.addEventListener('resize', adjustGrid);
    }

    // Handle touch interactions
    handleTouchInteractions() {
        // Prevent touch delay
        document.addEventListener('touchstart', () => {}, { passive: true });
        
        // Setup touch gestures
        this.setupTouchGestures();
    }

    // Setup touch gestures
    setupTouchGestures() {
        let startX, startY;
        
        document.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        });
        
        document.addEventListener('touchmove', (e) => {
            if (!startX || !startY) return;
            
            const diffX = startX - e.touches[0].clientX;
            const diffY = startY - e.touches[0].clientY;
            
            // Swipe detection
            if (Math.abs(diffX) > Math.abs(diffY)) {
                // Horizontal swipe
                if (diffX > 50) {
                    // Swipe left
                    this.handleSwipe('left');
                } else if (diffX < -50) {
                    // Swipe right
                    this.handleSwipe('right');
                }
            }
            
            startX = null;
            startY = null;
        });
    }

    // Handle swipe gestures
    handleSwipe(direction) {
        console.log('Swipe:', direction);
        // Implement swipe actions
    }

    // Handle viewport changes
    handleViewportChanges() {
        // Update layout on orientation change
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                location.reload();
            }, 100);
        });
    }

    // Setup session timeout
    setupSessionTimeout() {
        let timeout;
        const timeoutDuration = 30 * 60 * 1000; // 30 minutes
        
        const resetTimer = () => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                this.showSessionTimeoutWarning();
            }, timeoutDuration);
        };
        
        // Reset on user activity
        ['click', 'mousemove', 'keypress', 'scroll', 'touchstart'].forEach(event => {
            document.addEventListener(event, resetTimer, { passive: true });
        });
        
        resetTimer();
    }

    // Show session timeout warning
    showSessionTimeoutWarning() {
        // Implement session timeout warning
        console.log('Session timeout warning');
    }

    // Log user activity
    logUserActivity() {
        // Log page views and interactions
        console.log('User activity logged');
    }

    // Sanitize inputs
    sanitizeInputs() {
        const sanitize = (input) => {
            return input
                .replace(/[<>]/g, '') // Remove HTML tags
                .trim();
        };
        
        // Apply to all inputs
        document.querySelectorAll('input, textarea').forEach(input => {
            input.addEventListener('blur', () => {
                input.value = sanitize(input.value);
            });
        });
    }

    // Setup CSRF protection
    setupCSRF() {
        // Generate CSRF token
        const token = this.generateCSRFToken();
        localStorage.setItem('csrf-token', token);
        
        // Add token to all forms
        document.querySelectorAll('form').forEach(form => {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = '_csrf';
            input.value = token;
            form.appendChild(input);
        });
    }

    // Generate CSRF token
    generateCSRFToken() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    // Initialize data tables for admin
    initializeDataTables() {
        if (!window.location.pathname.includes('admin')) return;
        
        // Initialize car inventory table
        this.initCarInventoryTable();
        
        // Initialize client management table
        this.initClientTable();
        
        // Initialize sales analytics
        this.initSalesAnalytics();
    }

    // Initialize car inventory table
    initCarInventoryTable() {
        const table = document.getElementById('carInventoryTable');
        if (!table) return;
        
        // Implement DataTable initialization
        console.log('Initializing car inventory table');
    }

    // Setup admin dashboard
    setupAdminDashboard() {
        // Load dashboard widgets
        this.loadDashboardWidgets();
        
        // Setup real-time updates
        this.setupRealtimeUpdates();
        
        // Setup admin notifications
        this.setupAdminNotifications();
    }

    // Setup admin data management
    setupAdminDataManagement() {
        // CRUD operations for cars
        this.setupCarCRUD();
        
        // Client management
        this.setupClientManagement();
        
        // Order processing
        this.setupOrderProcessing();
    }

    // Setup admin analytics
    setupAdminAnalytics() {
        // Sales analytics
        this.initSalesCharts();
        
        // Traffic analytics
        this.initTrafficAnalytics();
        
        // Performance metrics
        this.initPerformanceMetrics();
    }

    // Load dashboard widgets
    loadDashboardWidgets() {
        // Implement dashboard widgets loading
        console.log('Loading dashboard widgets');
    }

    // Setup real-time updates
    setupRealtimeUpdates() {
        // Implement WebSocket or polling for real-time updates
        console.log('Setting up real-time updates');
    }

    // Setup admin notifications
    setupAdminNotifications() {
        // Notification system
        this.initNotificationSystem();
        
        // Alert system
        this.initAlertSystem();
    }

    // Setup car CRUD operations
    setupCarCRUD() {
        // Create
        this.setupCarCreate();
        
        // Read
        this.setupCarRead();
        
        // Update
        this.setupCarUpdate();
        
        // Delete
        this.setupCarDelete();
    }

    // Helper methods
    showLoading() {
        const loader = document.createElement('div');
        loader.className = 'loading-overlay';
        loader.innerHTML = `
            <div class="loading-spinner">
                <i class="fas fa-spinner fa-spin"></i>
                <p>Loading...</p>
            </div>
        `;
        document.body.appendChild(loader);
    }

    hideLoading() {
        const loader = document.querySelector('.loading-overlay');
        if (loader) loader.remove();
    }

    showSearchResults(count, query) {
        const resultsDiv = document.createElement('div');
        resultsDiv.className = 'search-results';
        resultsDiv.innerHTML = `
            <p>Found ${count} results for "${query}"</p>
        `;
        
        const grid = document.getElementById('featuredCars');
        grid.parentNode.insertBefore(resultsDiv, grid);
        
        setTimeout(() => {
            resultsDiv.remove();
        }, 3000);
    }

    playSound(type) {
        // Implement sound effects based on type
        console.log('Playing sound:', type);
    }

    updateParticlesTheme(theme) {
        // Update particles based on theme
        console.log('Updating particles for theme:', theme);
    }

    closeAllModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.style.display = 'none';
        });
    }
}

// Initialize Admin System
document.addEventListener('DOMContentLoaded', () => {
    const adminSystem = new AdminSystem();
    
    // Make available globally
    window.AdminSystem = adminSystem;
});