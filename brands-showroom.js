// Brands Showroom JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const brandPills = document.querySelectorAll('.brand-pill');
    const globalSearch = document.getElementById('globalSearch');
    const backToTopBtn = document.getElementById('backToTop');
    const orderModal = document.getElementById('orderModal');
    const closeModalBtn = document.querySelector('.close-modal');
    const whatsappFloat = document.getElementById('whatsappFloat');
    const contactBtn = document.querySelector('.contact-btn');
    
    // State
    let carsData = [];
    let currentBrandFilter = 'all';
    let currentSearchTerm = '';

    // Initialize
    init();

    function init() {
        setupEventListeners();
        createParticles();
        loadCarsData();
        setupSmoothScrolling();
        setupIntersectionObserver();
    }

    function setupEventListeners() {
        // Brand filter pills
        brandPills.forEach(pill => {
            pill.addEventListener('click', function() {
                const brand = this.dataset.brand;
                filterByBrand(brand);
                scrollToBrand(brand);
            });
        });

        // Global search
        globalSearch.addEventListener('input', function() {
            currentSearchTerm = this.value.toLowerCase();
            filterCars();
        });

        // Back to top button
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        // Scroll event for back to top button
        window.addEventListener('scroll', toggleBackToTop);

        // Modal close
        closeModalBtn.addEventListener('click', () => {
            orderModal.classList.remove('active');
        });

        // Close modal on outside click
        orderModal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.remove('active');
            }
        });

        // WhatsApp button
        contactBtn.addEventListener('click', function() {
            window.open('https://wa.me/254742436155', '_blank');
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && orderModal.classList.contains('active')) {
                orderModal.classList.remove('active');
            }
        });

        // Update stats on scroll (for animation effects)
        window.addEventListener('scroll', updateVisibleBrands);
    }

    function createParticles() {
        const particlesContainer = document.getElementById('particles');
        const particleCount = 100;

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            // Random properties
            const size = Math.random() * 3 + 1;
            const posX = Math.random() * 100;
            const posY = Math.random() * 100;
            const duration = Math.random() * 10 + 10;
            const delay = Math.random() * 5;
            
            particle.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                background: rgba(0, 212, 255, ${Math.random() * 0.3 + 0.1});
                border-radius: 50%;
                left: ${posX}%;
                top: ${posY}%;
                animation: float ${duration}s ease-in-out ${delay}s infinite;
            `;
            
            particlesContainer.appendChild(particle);
        }

        // Add CSS for floating animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes float {
                0%, 100% {
                    transform: translateY(0) translateX(0);
                    opacity: 0.3;
                }
                25% {
                    transform: translateY(-20px) translateX(10px);
                    opacity: 0.6;
                }
                50% {
                    transform: translateY(-10px) translateX(-10px);
                    opacity: 0.3;
                }
                75% {
                    transform: translateY(20px) translateX(5px);
                    opacity: 0.6;
                }
            }
        `;
        document.head.appendChild(style);
    }

    function loadCarsData() {
        // For demo purposes - FIREBASE INTEGRATION MARKER HERE
        const sampleCars = [
            {
                id: '1',
                model: 'BMW X5 M Sport',
                brand: 'bmw',
                year: 2023,
                price: 85000,
                color: 'Alpine White',
                mileage: 5000,
                fuel: 'Petrol',
                transmission: 'Automatic',
                description: 'Fully loaded with M Sport package, panoramic roof, premium sound system.',
                images: ['bmw-x5-1.jpg', 'bmw-x5-2.jpg', 'bmw-x5-3.jpg'],
                status: 'available'
            },
            {
                id: '2',
                model: 'Mercedes C-Class AMG',
                brand: 'mercedes',
                year: 2022,
                price: 65000,
                color: 'Obsidian Black',
                mileage: 15000,
                fuel: 'Petrol',
                transmission: 'Automatic',
                description: 'AMG Line with night package, Burmester sound system, memory seats.',
                images: ['mercedes-c-1.jpg', 'mercedes-c-2.jpg', 'mercedes-c-3.jpg'],
                status: 'available'
            },
            {
                id: '3',
                model: 'Toyota Land Cruiser V8',
                brand: 'toyota',
                year: 2023,
                price: 95000,
                color: 'Pearl White',
                mileage: 8000,
                fuel: 'Diesel',
                transmission: 'Automatic',
                description: 'Top spec with all terrain package, rear entertainment, premium interior.',
                images: ['lc200-1.jpg', 'lc200-2.jpg', 'lc200-3.jpg'],
                status: 'available'
            },
            {
                id: '4',
                model: 'Range Rover Sport',
                brand: 'range-rover',
                year: 2022,
                price: 120000,
                color: 'Santorini Black',
                mileage: 12000,
                fuel: 'Diesel',
                transmission: 'Automatic',
                description: 'HSE spec with black pack, Meridian sound, terrain response system.',
                images: ['rr-sport-1.jpg', 'rr-sport-2.jpg', 'rr-sport-3.jpg'],
                status: 'available'
            },
            {
                id: '5',
                model: 'Porsche 911 Carrera',
                brand: 'porsche',
                year: 2023,
                price: 180000,
                color: 'Guards Red',
                mileage: 3000,
                fuel: 'Petrol',
                transmission: 'PDK',
                description: 'Sports Chrono package, sport exhaust, Porsche ceramic brakes.',
                images: ['911-1.jpg', '911-2.jpg', '911-3.jpg'],
                status: 'available'
            },
            {
                id: '6',
                model: 'Lexus LX 600',
                brand: 'lexus',
                year: 2023,
                price: 110000,
                color: 'Nori Green',
                mileage: 5000,
                fuel: 'Petrol',
                transmission: 'Automatic',
                description: 'Ultra Luxury package, Mark Levinson audio, executive rear seats.',
                images: ['lx600-1.jpg', 'lx600-2.jpg', 'lx600-3.jpg'],
                status: 'available'
            }
        ];
        
        carsData = sampleCars;
        renderAllCars();
        updateBrandCounts();
        updateStats();
    }

    function renderAllCars() {
        // Clear all brand sections
        const brandSections = [
            'bmw', 'mercedes', 'porsche', 'range-rover', 'toyota', 
            'lexus', 'audi', 'ford', 'nissan', 'volvo', 
            'jeep', 'mitsubishi', 'lamborghini', 'ferrari', 'other'
        ];
        
        brandSections.forEach(brand => {
            const container = document.getElementById(`${brand}Cars`);
            if (container) {
                container.innerHTML = '<div class="loading"><div class="loading-spinner"></div><p>Loading cars...</p></div>';
            }
        });

        // Render cars after a short delay for demo
        setTimeout(() => {
            filterCars();
        }, 500);
    }

    function filterCars() {
        // Filter cars based on brand and search term
        let filteredCars = carsData.filter(car => {
            const matchesBrand = currentBrandFilter === 'all' || car.brand === currentBrandFilter;
            const matchesSearch = !currentSearchTerm || 
                car.model.toLowerCase().includes(currentSearchTerm) ||
                car.brand.toLowerCase().includes(currentSearchTerm) ||
                car.color.toLowerCase().includes(currentSearchTerm) ||
                car.description.toLowerCase().includes(currentSearchTerm);
            
            return matchesBrand && matchesSearch && car.status === 'available';
        });

        // Group cars by brand
        const carsByBrand = {};
        filteredCars.forEach(car => {
            if (!carsByBrand[car.brand]) {
                carsByBrand[car.brand] = [];
            }
            carsByBrand[car.brand].push(car);
        });

        // Render cars for each brand
        Object.keys(carsByBrand).forEach(brand => {
            const container = document.getElementById(`${brand}Cars`);
            if (container) {
                container.innerHTML = carsByBrand[brand].map(createCarCard).join('');
                setupCarCardEvents(brand);
            }
        });

        // Hide empty brand sections
        const allBrands = [
            'bmw', 'mercedes', 'porsche', 'range-rover', 'toyota', 
            'lexus', 'audi', 'ford', 'nissan', 'volvo', 
            'jeep', 'mitsubishi', 'lamborghini', 'ferrari', 'other'
        ];
        
        allBrands.forEach(brand => {
            const section = document.getElementById(brand);
            const container = document.getElementById(`${brand}Cars`);
            if (section && container) {
                if (!carsByBrand[brand] || carsByBrand[brand].length === 0) {
                    section.style.display = 'none';
                } else {
                    section.style.display = 'block';
                }
            }
        });

        updateBrandCounts();
    }

    function createCarCard(car) {
        const formattedPrice = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0
        }).format(car.price);

        return `
            <div class="car-card" data-car-id="${car.id}">
                ${car.status === 'sold' ? '<div class="car-sold-badge">SOLD</div>' : ''}
                <div class="car-image-slider">
                    <img src="${car.images[0] || 'default-car.jpg'}" alt="${car.model}" class="car-image">
                    <div class="image-counter">1/${car.images.length || 1}</div>
                </div>
                <div class="car-details">
                    <div class="car-title">
                        <span class="car-model">${car.model}</span>
                        <span class="car-price">${formattedPrice}</span>
                    </div>
                    <div class="car-specs">
                        <div class="spec-item">
                            <i class="fas fa-calendar"></i>
                            <span>${car.year}</span>
                        </div>
                        <div class="spec-item">
                            <i class="fas fa-palette"></i>
                            <span>${car.color}</span>
                        </div>
                        <div class="spec-item">
                            <i class="fas fa-tachometer-alt"></i>
                            <span>${car.mileage ? car.mileage.toLocaleString() + ' km' : 'New'}</span>
                        </div>
                        <div class="spec-item">
                            <i class="fas fa-gas-pump"></i>
                            <span>${car.fuel || 'Petrol'}</span>
                        </div>
                    </div>
                    <p class="car-description">${car.description || 'Premium luxury vehicle in excellent condition.'}</p>
                    <div class="car-actions">
                        <button class="order-btn" onclick="openOrderModal('${car.id}')">
                            <i class="fas fa-shopping-cart"></i> Order Now
                        </button>
                        <a href="https://wa.me/254742436155?text=I'm interested in the ${encodeURIComponent(car.model)} - ${car.year} (${car.color}) priced at ${formattedPrice}" 
                           target="_blank" class="whatsapp-btn">
                            <i class="fab fa-whatsapp"></i>
                        </a>
                    </div>
                </div>
            </div>
        `;
    }

    function setupCarCardEvents(brand) {
        const carCards = document.querySelectorAll(`#${brand}Cars .car-card`);
        
        carCards.forEach(card => {
            // Image slider effect
            const imageSlider = card.querySelector('.car-image-slider');
            const carImage = card.querySelector('.car-image');
            let currentImageIndex = 0;
            
            if (imageSlider && carImage) {
                // Get car data
                const carId = card.dataset.carId;
                const car = carsData.find(c => c.id === carId);
                
                if (car && car.images.length > 1) {
                    imageSlider.addEventListener('mouseenter', () => {
                        currentImageIndex = 1; // Show second image on hover
                        carImage.src = car.images[currentImageIndex] || 'default-car.jpg';
                    });
                    
                    imageSlider.addEventListener('mouseleave', () => {
                        currentImageIndex = 0; // Back to first image
                        carImage.src = car.images[currentImageIndex] || 'default-car.jpg';
                    });
                    
                    // Add click to cycle through images
                    imageSlider.addEventListener('click', (e) => {
                        if (e.target === carImage) {
                            currentImageIndex = (currentImageIndex + 1) % car.images.length;
                            carImage.src = car.images[currentImageIndex] || 'default-car.jpg';
                            
                            // Update counter
                            const counter = imageSlider.querySelector('.image-counter');
                            if (counter) {
                                counter.textContent = `${currentImageIndex + 1}/${car.images.length}`;
                            }
                        }
                    });
                }
            }
        });
    }

    function filterByBrand(brand) {
        currentBrandFilter = brand;
        
        // Update active pill
        brandPills.forEach(pill => {
            pill.classList.remove('active');
            if (pill.dataset.brand === brand) {
                pill.classList.add('active');
            }
        });
        
        filterCars();
        
        // Update URL hash for deep linking
        if (brand !== 'all') {
            window.location.hash = brand;
        } else {
            window.location.hash = '';
        }
    }

    function scrollToBrand(brand) {
        if (brand === 'all') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }
        
        const brandSection = document.getElementById(brand);
        if (brandSection) {
            const headerHeight = document.querySelector('.main-header').offsetHeight;
            const offsetTop = brandSection.offsetTop - headerHeight - 20;
            
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    }

    function setupSmoothScrolling() {
        // Smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href === '#' || href === '#contact') return;
                
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const headerHeight = document.querySelector('.main-header').offsetHeight;
                    const offsetTop = targetElement.offsetTop - headerHeight - 20;
                    
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                    
                    // Update brand filter if needed
                    if (targetId !== 'brands') {
                        filterByBrand(targetId);
                    }
                }
            });
        });
    }

    function setupIntersectionObserver() {
        // Observe brand sections for animation
        const brandSections = document.querySelectorAll('.brand-section');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '50px'
        });

        brandSections.forEach(section => {
            observer.observe(section);
        });
    }

    function updateBrandCounts() {
        // Count cars per brand
        const brandCounts = {};
        const filteredCars = carsData.filter(car => car.status === 'available');
        
        filteredCars.forEach(car => {
            if (!brandCounts[car.brand]) {
                brandCounts[car.brand] = 0;
            }
            brandCounts[car.brand]++;
        });

        // Update count displays
        Object.keys(brandCounts).forEach(brand => {
            const countElement = document.getElementById(`${brand}Count`);
            if (countElement) {
                countElement.textContent = brandCounts[brand];
            }
        });

        // Update "other" count
        const otherCountElement = document.getElementById('otherCount');
        if (otherCountElement) {
            const otherBrands = ['lamborghini', 'ferrari', 'other'];
            const otherCount = otherBrands.reduce((sum, brand) => sum + (brandCounts[brand] || 0), 0);
            otherCountElement.textContent = otherCount;
        }
    }

    function updateStats() {
        // Update hero stats with animation
        const totalCars = carsData.filter(car => car.status === 'available').length;
        const brands = new Set(carsData.map(car => car.brand)).size;
        
        animateCounter('totalCarsCount', totalCars);
        animateCounter('availableCarsCount', totalCars);
        animateCounter('brandsCount', brands);
    }

    function animateCounter(elementId, targetValue) {
        const element = document.getElementById(elementId);
        if (!element) return;
        
        const currentValue = parseInt(element.textContent.replace('+', '')) || 0;
        const increment = targetValue > currentValue ? 1 : -1;
        let current = currentValue;
        
        const timer = setInterval(() => {
            current += increment;
            element.textContent = current + '+';
            
            if (current === targetValue) {
                clearInterval(timer);
            }
        }, 30);
    }

    function toggleBackToTop() {
        if (window.scrollY > 500) {
            backToTopBtn.style.opacity = '1';
            backToTopBtn.style.visibility = 'visible';
            backToTopBtn.style.transform = 'translateY(0)';
        } else {
            backToTopBtn.style.opacity = '0';
            backToTopBtn.style.visibility = 'hidden';
            backToTopBtn.style.transform = 'translateY(20px)';
        }
    }

    function updateVisibleBrands() {
        // Highlight brand pills based on scroll position
        const scrollPosition = window.scrollY + 100;
        const brandSections = document.querySelectorAll('.brand-section');
        
        let currentBrand = 'all';
        
        brandSections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentBrand = section.id;
            }
        });
        
        // Update active pill
        brandPills.forEach(pill => {
            pill.classList.remove('active');
            if (pill.dataset.brand === currentBrand) {
                pill.classList.add('active');
            }
        });
    }

    // Make functions available globally
    window.openOrderModal = function(carId) {
        const car = carsData.find(c => c.id === carId);
        if (!car) return;
        
        const formattedPrice = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0
        }).format(car.price);
        
        const modalBody = document.getElementById('orderModalBody');
        modalBody.innerHTML = `
            <div class="order-form">
                <div class="order-car-info">
                    <h4>${car.model}</h4>
                    <p><strong>Brand:</strong> ${car.brand.charAt(0).toUpperCase() + car.brand.slice(1)}</p>
                    <p><strong>Year:</strong> ${car.year}</p>
                    <p><strong>Color:</strong> ${car.color}</p>
                    <p><strong>Price:</strong> ${formattedPrice}</p>
                </div>
                <div class="order-options">
                    <h4>Order Options:</h4>
                    <div class="order-buttons">
                        <a href="https://wa.me/254742436155?text=I want to order the ${encodeURIComponent(car.model)} - ${car.year} (${car.color}) for ${formattedPrice}" 
                           target="_blank" class="order-option-btn whatsapp">
                            <i class="fab fa-whatsapp"></i> Order via WhatsApp
                        </a>
                        <a href="sms:+254742436155?body=I want to order the ${encodeURIComponent(car.model)} - ${car.year} (${car.color}) for ${formattedPrice}" 
                           class="order-option-btn sms">
                            <i class="fas fa-comment-sms"></i> Order via SMS
                        </a>
                        <button class="order-option-btn call" onclick="window.location.href='tel:+254742436155'">
                            <i class="fas fa-phone"></i> Call to Order
                        </button>
                    </div>
                </div>
                <div class="order-note">
                    <p><i class="fas fa-info-circle"></i> Our team will contact you within 15 minutes to confirm your order.</p>
                </div>
            </div>
        `;
        
        orderModal.classList.add('active');
    };

    // Initialize scroll position
    toggleBackToTop();
    updateVisibleBrands();
});

// Add CSS for animations
document.addEventListener('DOMContentLoaded', function() {
    const style = document.createElement('style');
    style.textContent = `
        .brand-section {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        
        .brand-section.visible {
            opacity: 1;
            transform: translateY(0);
        }
        
        .car-card {
            opacity: 0;
            transform: translateY(20px);
            animation: fadeInUp 0.5s ease forwards;
        }
        
        @keyframes fadeInUp {
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .order-form {
            display: flex;
            flex-direction: column;
            gap: 20px;
        }
        
        .order-car-info {
            background: rgba(255, 255, 255, 0.05);
            padding: 20px;
            border-radius: 8px;
            border: 1px solid var(--border);
        }
        
        .order-car-info h4 {
            color: var(--accent);
            margin-bottom: 10px;
            font-size: 1.3rem;
        }
        
        .order-car-info p {
            margin: 5px 0;
            color: var(--text-secondary);
        }
        
        .order-options h4 {
            color: var(--accent);
            margin-bottom: 15px;
        }
        
        .order-buttons {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
        
        .order-option-btn {
            padding: 15px;
            border: none;
            border-radius: 8px;
            font-family: 'Poppins', sans-serif;
            font-weight: 600;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            transition: all 0.3s ease;
            text-decoration: none;
            color: white;
            text-align: center;
        }
        
        .order-option-btn.whatsapp {
            background: linear-gradient(45deg, #25D366, #128C7E);
        }
        
        .order-option-btn.sms {
            background: linear-gradient(45deg, #00d4ff, #0088ff);
        }
        
        .order-option-btn.call {
            background: linear-gradient(45deg, #ff9900, #ff6600);
        }
        
        .order-option-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        }
        
        .order-note {
            background: rgba(0, 212, 255, 0.1);
            padding: 15px;
            border-radius: 8px;
            border: 1px solid var(--accent);
            font-size: 0.9rem;
            color: var(--text);
        }
        
        .order-note i {
            color: var(--accent);
            margin-right: 8px;
        }
    `;
    document.head.appendChild(style);
});
