// ============================================
// FRANK AUTO DEALS - QUANTUM EFFECTS
// Premium Interactive Features
// ============================================

class QuantumEffects {
    constructor() {
        this.isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        this.init();
    }

    init() {
        this.initPreloader();
        this.initParticles();
        this.initNavigation();
        this.initTypingEffect();
        this.initStatsCounter();
        this.initImageGalleries();
        this.initCarFilters();
        this.initHoverEffects();
        this.initScrollAnimations();
        this.initThemeToggle();
        this.initWhatsAppIntegration();
        this.initAIConcierge();
        this.initAdminAccess();
        this.initBackToTop();
    }

    // ===== PRELOADER =====
    initPreloader() {
        const preloader = document.querySelector('.quantum-preloader');
        if (!preloader) return;

        const progressFill = document.querySelector('.progress-fill');
        const logoChars = document.querySelectorAll('.logo-char');

        // Animate logo characters
        logoChars.forEach((char, index) => {
            setTimeout(() => {
                char.style.animation = 'charPop 0.5s forwards';
            }, index * 100);
        });

        // Animate progress bar
        if (progressFill) {
            let progress = 0;
            const interval = setInterval(() => {
                progress += Math.random() * 15;
                progressFill.style.width = Math.min(progress, 100) + '%';
                
                if (progress >= 100) {
                    clearInterval(interval);
                    setTimeout(() => {
                        preloader.style.opacity = '0';
                        setTimeout(() => {
                            preloader.style.display = 'none';
                            this.triggerPageAnimations();
                        }, 500);
                    }, 300);
                }
            }, 100);
        } else {
            setTimeout(() => {
                preloader.style.opacity = '0';
                setTimeout(() => {
                    preloader.style.display = 'none';
                    this.triggerPageAnimations();
                }, 500);
            }, 2500);
        }
    }

    // ===== PARTICLES BACKGROUND =====
    initParticles() {
        const canvas = document.getElementById('particles-js');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const particles = [];
        const particleCount = this.isMobile ? 30 : 80;

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 1;
                this.speedX = Math.random() * 1 - 0.5;
                this.speedY = Math.random() * 1 - 0.5;
                this.color = `rgba(0, 243, 255, ${Math.random() * 0.5})`;
                this.opacity = Math.random() * 0.5 + 0.1;
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                if (this.x > canvas.width) this.x = 0;
                if (this.x < 0) this.x = canvas.width;
                if (this.y > canvas.height) this.y = 0;
                if (this.y < 0) this.y = canvas.height;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.globalAlpha = this.opacity;
                ctx.fill();
            }
        }

        // Create particles
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Draw connections
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 100) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(0, 243, 255, ${0.1 * (1 - distance / 100)})`;
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }

            // Update and draw particles
            particles.forEach(particle => {
                particle.update();
                particle.draw();
            });

            requestAnimationFrame(animate);
        }

        animate();

        // Handle resize
        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });
    }

    // ===== NAVIGATION =====
    initNavigation() {
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        const navMenu = document.querySelector('.nav-menu');

        if (mobileMenuBtn && navMenu) {
            mobileMenuBtn.addEventListener('click', () => {
                mobileMenuBtn.classList.toggle('active');
                navMenu.classList.toggle('active');
                document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
            });
        }

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (navMenu && navMenu.classList.contains('active') && 
                !e.target.closest('.nav-menu') && 
                !e.target.closest('.mobile-menu-btn')) {
                mobileMenuBtn.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });

        // Smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Nav link hover effects
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('mouseenter', () => {
                link.style.transform = 'translateY(-2px)';
            });
            link.addEventListener('mouseleave', () => {
                link.style.transform = 'translateY(0)';
            });
        });
    }

    // ===== TYPING EFFECT =====
    initTypingEffect() {
        const typingText = document.getElementById('typingText');
        if (!typingText) return;

        const texts = [
            'KENYA\'S PREMIER LUXURY CAR DEALERSHIP',
            'EXPERIENCE AUTOMOTIVE EXCELLENCE',
            'YOUR DREAM CAR AWAITS',
            'ELITE COLLECTION CURATED FOR YOU'
        ];

        let textIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let isPaused = false;

        function type() {
            if (isPaused) return;

            const currentText = texts[textIndex];

            if (isDeleting) {
                typingText.textContent = currentText.substring(0, charIndex - 1);
                charIndex--;
            } else {
                typingText.textContent = currentText.substring(0, charIndex + 1);
                charIndex++;
            }

            if (!isDeleting && charIndex === currentText.length) {
                isDeleting = true;
                isPaused = true;
                setTimeout(() => {
                    isPaused = false;
                    setTimeout(type, 1500);
                }, 1500);
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                textIndex = (textIndex + 1) % texts.length;
                setTimeout(type, 500);
            } else {
                setTimeout(type, isDeleting ? 50 : 100);
            }
        }

        type();
    }

    // ===== ANIMATED STATS =====
    initStatsCounter() {
        const statCards = document.querySelectorAll('.stat-card');
        if (!statCards.length) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const card = entry.target;
                    const count = parseInt(card.getAttribute('data-count'));
                    const statNumber = card.querySelector('.stat-number');
                    const speed = parseInt(card.getAttribute('data-speed')) || 10;

                    if (statNumber) {
                        this.animateCounter(statNumber, 0, count, speed);
                        observer.unobserve(card);
                    }
                }
            });
        }, { threshold: 0.5 });

        statCards.forEach(card => observer.observe(card));
    }

    animateCounter(element, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const value = Math.floor(progress * (end - start) + start);
            element.textContent = value.toLocaleString();

            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }

    // ===== IMAGE GALLERIES (5 Photos) =====
    initImageGalleries() {
        // Car image galleries
        document.querySelectorAll('.car-media').forEach(media => {
            media.addEventListener('click', (e) => {
                if (e.target.classList.contains('quick-view')) return;
                this.showImageGallery(media);
            });
        });

        // Initialize gallery navigation
        this.initGalleryNavigation();
    }

    showImageGallery(mediaElement) {
        // Get all images for this car (would come from data attribute in real implementation)
        const carId = mediaElement.closest('.car-card').dataset.carId;
        const images = [
            'assets/images/cars/default-car.jpg',
            'assets/images/cars/default-car-2.jpg',
            'assets/images/cars/default-car-3.jpg',
            'assets/images/cars/default-car-4.jpg',
            'assets/images/cars/default-car-5.jpg'
        ];

        const galleryHTML = `
            <div class="image-gallery-overlay">
                <div class="gallery-container">
                    <div class="gallery-header">
                        <h3>Car Images</h3>
                        <button class="close-gallery">&times;</button>
                    </div>
                    <div class="gallery-main">
                        <img src="${images[0]}" alt="Car Image" class="active-image">
                    </div>
                    <div class="gallery-thumbnails">
                        ${images.map((img, index) => `
                            <div class="thumbnail ${index === 0 ? 'active' : ''}" data-index="${index}">
                                <img src="${img}" alt="Thumbnail ${index + 1}">
                            </div>
                        `).join('')}
                    </div>
                    <div class="gallery-controls">
                        <button class="gallery-prev">
                            <i class="fas fa-chevron-left"></i>
                        </button>
                        <div class="gallery-counter">
                            <span class="current-index">1</span> / ${images.length}
                        </div>
                        <button class="gallery-next">
                            <i class="fas fa-chevron-right"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', galleryHTML);
        this.initGalleryInteractions();
    }

    initGalleryNavigation() {
        let currentIndex = 0;
        let images = [];

        document.addEventListener('click', (e) => {
            if (e.target.closest('.thumbnail')) {
                const thumbnail = e.target.closest('.thumbnail');
                currentIndex = parseInt(thumbnail.dataset.index);
                this.updateGalleryDisplay(currentIndex);
            }

            if (e.target.closest('.gallery-prev')) {
                currentIndex = (currentIndex - 1 + images.length) % images.length;
                this.updateGalleryDisplay(currentIndex);
            }

            if (e.target.closest('.gallery-next')) {
                currentIndex = (currentIndex + 1) % images.length;
                this.updateGalleryDisplay(currentIndex);
            }

            if (e.target.closest('.close-gallery') || e.target.classList.contains('image-gallery-overlay')) {
                document.querySelector('.image-gallery-overlay')?.remove();
            }
        });
    }

    updateGalleryDisplay(index) {
        const gallery = document.querySelector('.image-gallery-overlay');
        if (!gallery) return;

        const mainImage = gallery.querySelector('.active-image');
        const thumbnails = gallery.querySelectorAll('.thumbnail');
        const counter = gallery.querySelector('.current-index');

        // Update main image
        const images = [
            'assets/images/cars/default-car.jpg',
            'assets/images/cars/default-car-2.jpg',
            'assets/images/cars/default-car-3.jpg',
            'assets/images/cars/default-car-4.jpg',
            'assets/images/cars/default-car-5.jpg'
        ];

        mainImage.src = images[index];
        mainImage.style.opacity = '0';
        setTimeout(() => {
            mainImage.style.opacity = '1';
        }, 50);

        // Update thumbnails
        thumbnails.forEach((thumb, i) => {
            thumb.classList.toggle('active', i === index);
        });

        // Update counter
        counter.textContent = index + 1;
    }

    // ===== CAR FILTER SYSTEM =====
    initCarFilters() {
        const filterTabs = document.querySelectorAll('.filter-tab');
        const searchInput = document.querySelector('.search-input');
        const carCards = document.querySelectorAll('.car-card');

        if (!filterTabs.length) return;

        filterTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Update active tab
                filterTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                const filter = tab.dataset.filter;
                this.filterCars(filter);
            });
        });

        // Search functionality
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const searchTerm = e.target.value.toLowerCase();
                this.searchCars(searchTerm);
            });
        }
    }

    filterCars(filter) {
        const carCards = document.querySelectorAll('.car-card');
        
        carCards.forEach(card => {
            const carType = card.dataset.type || 'all';
            
            if (filter === 'all' || carType === filter || card.classList.contains(filter)) {
                card.style.display = 'block';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 50);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
    }

    searchCars(searchTerm) {
        const carCards = document.querySelectorAll('.car-card');
        
        carCards.forEach(card => {
            const carName = card.querySelector('.car-title').textContent.toLowerCase();
            const carBrand = card.dataset.brand || '';
            
            if (carName.includes(searchTerm) || carBrand.includes(searchTerm)) {
                card.style.display = 'block';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 50);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
    }

    // ===== HOVER EFFECTS =====
    initHoverEffects() {
        // Card hover effects
        document.querySelectorAll('.car-card, .brand-planet, .stat-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-10px)';
                card.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.3)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0)';
                card.style.boxShadow = '';
            });
        });

        // Button hover effects
        document.querySelectorAll('.btn-primary, .btn-secondary, .btn-tertiary').forEach(btn => {
            btn.addEventListener('mouseenter', () => {
                btn.style.transform = 'translateY(-3px)';
            });
            
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'translateY(0)';
            });
        });
    }

    // ===== SCROLL ANIMATIONS =====
    initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        // Observe elements for animation
        document.querySelectorAll('.car-card, .feature-card, .brand-planet').forEach(el => {
            observer.observe(el);
        });

        // Parallax effect
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallaxElements = document.querySelectorAll('[data-parallax]');
            
            parallaxElements.forEach(el => {
                const speed = parseFloat(el.dataset.parallax) || 0.5;
                el.style.transform = `translateY(${scrolled * speed}px)`;
            });
        });
    }

    // ===== THEME TOGGLE =====
    initThemeToggle() {
        const themeToggle = document.getElementById('themeToggle');
        if (!themeToggle) return;

        // Check for saved theme
        const savedTheme = localStorage.getItem('frank-theme');
        if (savedTheme === 'light') {
            document.body.classList.add('light-theme');
            themeToggle.classList.add('active');
        }

        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('light-theme');
            themeToggle.classList.toggle('active');
            
            // Save theme preference
            const isLight = document.body.classList.contains('light-theme');
            localStorage.setItem('frank-theme', isLight ? 'light' : 'dark');
        });
    }

    // ===== WHATSAPP INTEGRATION =====
    initWhatsAppIntegration() {
        // WhatsApp order buttons
        document.querySelectorAll('.whatsapp-order').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const carCard = btn.closest('.car-card');
                const carName = carCard.querySelector('.car-title').textContent;
                const carPrice = carCard.querySelector('.price-main').textContent;
                
                this.openWhatsAppOrder(carName, carPrice);
            });
        });

        // WhatsApp quick contact
        document.querySelectorAll('.whatsapp-btn').forEach(btn => {
            if (!btn.classList.contains('whatsapp-order')) {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    const phone = '254742436155';
                    const message = 'Hello Frank Auto Deals! I would like to inquire about your luxury vehicles.';
                    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
                });
            }
        });
    }

    openWhatsAppOrder(carName, carPrice) {
        const phone = '254742436155';
        const message = `🚗 *FRANK AUTO DEALS - CAR ENQUIRY*%0A%0A*Vehicle:* ${carName}%0A*Price:* ${carPrice}%0A%0AI'm interested in this vehicle. Please provide more details and availability.`;
        window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
    }

    // ===== AI CONCIERGE =====
    initAIConcierge() {
        const openBtn = document.querySelector('.ai-concierge-btn');
        const closeBtn = document.querySelector('.close-concierge');
        const concierge = document.getElementById('aiConcierge');
        const sendBtn = document.getElementById('sendMessage');
        const aiInput = document.getElementById('aiInput');
        const quickQuestions = document.querySelectorAll('.quick-question');

        if (!concierge) return;

        // Open concierge
        if (openBtn) {
            openBtn.addEventListener('click', () => {
                concierge.style.display = 'block';
                setTimeout(() => {
                    concierge.style.opacity = '1';
                    concierge.style.transform = 'translateY(0)';
                }, 10);
            });
        }

        // Close concierge
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                concierge.style.opacity = '0';
                concierge.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    concierge.style.display = 'none';
                }, 300);
            });
        }

        // Send message
        if (sendBtn && aiInput) {
            sendBtn.addEventListener('click', () => {
                const message = aiInput.value.trim();
                if (message) {
                    this.sendAIMessage(message);
                    aiInput.value = '';
                }
            });

            aiInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    const message = aiInput.value.trim();
                    if (message) {
                        this.sendAIMessage(message);
                        aiInput.value = '';
                    }
                }
            });
        }

        // Quick questions
        quickQuestions.forEach(question => {
            question.addEventListener('click', () => {
                const questionText = question.dataset.question;
                this.sendAIMessage(questionText);
            });
        });
    }

    sendAIMessage(message) {
        const messagesContainer = document.getElementById('conciergeMessages');
        if (!messagesContainer) return;

        // Add user message
        const userMessage = document.createElement('div');
        userMessage.className = 'message user';
        userMessage.innerHTML = `<div class="message-content">${message}</div>`;
        messagesContainer.appendChild(userMessage);

        // Scroll to bottom
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        // Simulate AI response
        setTimeout(() => {
            const aiResponse = this.generateAIResponse(message);
            const aiMessage = document.createElement('div');
            aiMessage.className = 'message ai';
            aiMessage.innerHTML = `<div class="message-content">${aiResponse}</div>`;
            messagesContainer.appendChild(aiMessage);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }, 1000);
    }

    generateAIResponse(message) {
        const responses = {
            'suv': 'We have several excellent SUVs available! Popular choices include Toyota Land Cruiser V8, Range Rover Sport, and BMW X7. Which price range are you interested in?',
            'luxury': 'For luxury sedans, I recommend Mercedes S-Class, BMW 7 Series, or Lexus LS. For luxury SUVs, we have Range Rover Autobiography and Mercedes G-Wagon.',
            'sports': 'Our sports collection includes Porsche 911, BMW M8, and Mercedes AMG GT. These offer exceptional performance and style.',
            'budget': 'We have great options under KSh 5M including Toyota Harrier, Nissan X-Trail, and Ford Explorer. Would you like to see specific models?',
            'default': 'Thank you for your interest! We have over 500 luxury vehicles available. Could you specify your preferences regarding type, budget, or specific brand?'
        };

        const lowerMessage = message.toLowerCase();
        
        if (lowerMessage.includes('suv') || lowerMessage.includes('4x4')) {
            return responses.suv;
        } else if (lowerMessage.includes('luxury') || lowerMessage.includes('premium')) {
            return responses.luxury;
        } else if (lowerMessage.includes('sport') || lowerMessage.includes('fast')) {
            return responses.sports;
        } else if (lowerMessage.includes('budget') || lowerMessage.includes('cheap') || lowerMessage.includes('affordable')) {
            return responses.budget;
        } else {
            return responses.default;
        }
    }

    // ===== ADMIN ACCESS SYSTEM =====
    initAdminAccess() {
        let clickCount = 0;
        let clickTimer;

        document.addEventListener('click', () => {
            clickCount++;
            
            if (clickTimer) clearTimeout(clickTimer);
            clickTimer = setTimeout(() => {
                clickCount = 0;
            }, 1000);

            if (clickCount === 3) {
                this.revealAdminAccess();
                clickCount = 0;
            }
        });
    }

    revealAdminAccess() {
        const adminLink = document.getElementById('adminLink');
        if (!adminLink) return;

        // Add visual feedback
        adminLink.classList.add('revealed');
        adminLink.style.animation = 'adminPulse 2s infinite';

        // Create notification
        const notification = document.createElement('div');
        notification.className = 'admin-notification';
        notification.innerHTML = `
            <i class="fas fa-unlock"></i>
            <span>Admin Access Revealed! Link will disappear in 10 seconds.</span>
        `;
        document.body.appendChild(notification);

        // Remove after 10 seconds
        setTimeout(() => {
            adminLink.classList.remove('revealed');
            adminLink.style.animation = '';
            notification.remove();
        }, 10000);
    }

    // ===== BACK TO TOP =====
    initBackToTop() {
        const backToTop = document.getElementById('backToTop');
        if (!backToTop) return;

        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTop.style.opacity = '1';
                backToTop.style.visibility = 'visible';
            } else {
                backToTop.style.opacity = '0';
                backToTop.style.visibility = 'hidden';
            }
        });

        backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ===== UTILITY FUNCTIONS =====
    triggerPageAnimations() {
        // Trigger entrance animations
        document.querySelectorAll('.animate-on-load').forEach(el => {
            el.classList.add('animate-in');
        });
    }

    initGalleryInteractions() {
        // Gallery interactions will be handled by initGalleryNavigation
    }
}

// Initialize Quantum Effects when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.Quantum = new QuantumEffects();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = QuantumEffects;
}