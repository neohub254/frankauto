/**
 * FRANK AUTO DEALS - Responsive Touch JS
 * Handles all touch interactions and mobile responsiveness
 */

class ResponsiveTouch {
    constructor() {
        this.init();
    }

    init() {
        this.detectDevice();
        this.setupTouchEvents();
        this.setupSwipeGestures();
        this.setupMobileOptimizations();
        this.setupPerformanceOptimizations();
    }

    // Detect device type and capabilities
    detectDevice() {
        this.isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        this.isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        this.isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        this.isAndroid = /Android/.test(navigator.userAgent);
        
        // Add device classes to body
        const body = document.body;
        if (this.isMobile) body.classList.add('mobile-device');
        if (this.isTouch) body.classList.add('touch-device');
        if (this.isIOS) body.classList.add('ios-device');
        if (this.isAndroid) body.classList.add('android-device');
    }

    // Setup touch event handlers
    setupTouchEvents() {
        // Prevent zoom on double-tap
        let lastTouchEnd = 0;
        document.addEventListener('touchend', (e) => {
            const now = Date.now();
            if (now - lastTouchEnd <= 300) {
                e.preventDefault();
            }
            lastTouchEnd = now;
        }, { passive: false });

        // Add touch feedback to buttons
        this.setupTouchFeedback();
        
        // Handle touch on interactive elements
        this.setupTouchInteractions();
        
        // Improve scrolling on mobile
        this.improveMobileScrolling();
    }

    // Add touch feedback to buttons
    setupTouchFeedback() {
        const addRipple = (e) => {
            const btn = e.currentTarget;
            const circle = document.createElement('span');
            const rect = btn.getBoundingClientRect();
            
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX ? e.clientX - rect.left : rect.width / 2;
            const y = e.clientY ? e.clientY - rect.top : rect.height / 2;
            
            circle.style.cssText = `
                width: ${size}px;
                height: ${size}px;
                left: ${x - size / 2}px;
                top: ${y - size / 2}px;
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.3);
                transform: scale(0);
                animation: ripple 0.6s linear;
            `;
            
            btn.style.position = 'relative';
            btn.style.overflow = 'hidden';
            btn.appendChild(circle);
            
            setTimeout(() => circle.remove(), 600);
        };

        // Add ripple to all buttons
        document.querySelectorAll('button, .btn, .action-btn, .nav-link').forEach(btn => {
            btn.addEventListener('touchstart', addRipple, { passive: true });
            btn.addEventListener('click', addRipple);
        });
    }

    // Setup touch interactions for specific elements
    setupTouchInteractions() {
        // Mobile menu with better touch handling
        const menuBtn = document.getElementById('mobileMenuBtn');
        if (menuBtn) {
            menuBtn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                menuBtn.classList.add('touch-active');
            }, { passive: false });
            
            menuBtn.addEventListener('touchend', (e) => {
                e.preventDefault();
                menuBtn.classList.remove('touch-active');
                menuBtn.click();
            }, { passive: false });
        }

        // Improved dropdown touch handling
        document.querySelectorAll('.nav-dropdown, .dropdown-trigger').forEach(dropdown => {
            dropdown.addEventListener('touchstart', (e) => {
                if (this.isMobile) {
                    e.preventDefault();
                    dropdown.classList.toggle('touch-open');
                }
            }, { passive: false });
        });

        // Better car card touch handling
        document.querySelectorAll('.car-card').forEach(card => {
            card.addEventListener('touchstart', () => {
                card.classList.add('touch-active');
            }, { passive: true });
            
            card.addEventListener('touchend', () => {
                setTimeout(() => {
                    card.classList.remove('touch-active');
                }, 150);
            }, { passive: true });
        });
    }

    // Improve mobile scrolling
    improveMobileScrolling() {
        // Add smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const href = anchor.getAttribute('href');
                if (href === '#') return;
                
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Add momentum scrolling to containers
        if (this.isIOS) {
            document.querySelectorAll('.scrollable-content').forEach(container => {
                container.style.webkitOverflowScrolling = 'touch';
            });
        }

        // Hide address bar on scroll
        window.addEventListener('scroll', () => {
            setTimeout(() => {
                window.scrollTo(0, window.pageYOffset);
            }, 0);
        });
    }

    // Setup swipe gestures
    setupSwipeGestures() {
        let touchstartX = 0;
        let touchstartY = 0;
        let touchendX = 0;
        let touchendY = 0;
        
        const gestureZone = document.body;
        
        gestureZone.addEventListener('touchstart', (e) => {
            touchstartX = e.changedTouches[0].screenX;
            touchstartY = e.changedTouches[0].screenY;
        }, { passive: true });
        
        gestureZone.addEventListener('touchend', (e) => {
            touchendX = e.changedTouches[0].screenX;
            touchendY = e.changedTouches[0].screenY;
            this.handleGesture();
        }, { passive: true });
        
        this.handleGesture = () => {
            const threshold = 50;
            const swipeHorizontal = Math.abs(touchendX - touchstartX) > threshold;
            const swipeVertical = Math.abs(touchendY - touchstartY) > threshold;
            
            if (swipeHorizontal && !swipeVertical) {
                if (touchendX < touchstartX) {
                    this.handleSwipe('left');
                }
                if (touchendX > touchstartX) {
                    this.handleSwipe('right');
                }
            }
            
            if (swipeVertical && !swipeHorizontal) {
                if (touchendY < touchstartY) {
                    this.handleSwipe('up');
                }
                if (touchendY > touchstartY) {
                    this.handleSwipe('down');
                }
            }
        };
    }

    // Handle swipe gestures
    handleSwipe(direction) {
        console.log(`Swipe ${direction} detected`);
        
        switch(direction) {
            case 'left':
                this.nextCarouselSlide();
                break;
            case 'right':
                this.previousCarouselSlide();
                break;
            case 'up':
                // Scroll up or close modal
                this.handleSwipeUp();
                break;
            case 'down':
                // Scroll down or open menu
                this.handleSwipeDown();
                break;
        }
    }

    // Carousel navigation with swipe
    nextCarouselSlide() {
        const activeCarousel = document.querySelector('.carousel.active');
        if (activeCarousel) {
            const nextBtn = activeCarousel.querySelector('.carousel-next');
            if (nextBtn) nextBtn.click();
        }
    }

    previousCarouselSlide() {
        const activeCarousel = document.querySelector('.carousel.active');
        if (activeCarousel) {
            const prevBtn = activeCarousel.querySelector('.carousel-prev');
            if (prevBtn) prevBtn.click();
        }
    }

    handleSwipeUp() {
        // Close modals or go back
        const openModal = document.querySelector('.modal[style*="display: block"]');
        if (openModal) {
            openModal.style.display = 'none';
        }
    }

    handleSwipeDown() {
        // Open navigation or refresh
        if (window.scrollY === 0) {
            document.querySelector('.mobile-menu-btn')?.click();
        }
    }

    // Setup mobile optimizations
    setupMobileOptimizations() {
        // Optimize images for mobile
        this.optimizeImages();
        
        // Lazy load content
        this.setupLazyLoading();
        
        // Adjust font sizes for mobile
        this.adjustFontSizes();
        
        // Optimize animations for mobile
        this.optimizeAnimations();
    }

    // Optimize images for mobile
    optimizeImages() {
        if (!this.isMobile) return;
        
        // Replace large images with mobile-optimized versions
        document.querySelectorAll('img[data-mobile-src]').forEach(img => {
            const mobileSrc = img.dataset.mobileSrc;
            if (mobileSrc) {
                img.src = mobileSrc;
            }
        });
        
        // Add loading="lazy" to images
        document.querySelectorAll('img:not([loading])').forEach(img => {
            img.loading = 'lazy';
        });
    }

    // Setup lazy loading
    setupLazyLoading() {
        const lazyLoad = () => {
            const lazyImages = document.querySelectorAll('img[data-src]');
            
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        imageObserver.unobserve(img);
                    }
                });
            });
            
            lazyImages.forEach(img => imageObserver.observe(img));
        };
        
        // Run lazy load
        if ('IntersectionObserver' in window) {
            lazyLoad();
        } else {
            // Fallback for older browsers
            document.querySelectorAll('img[data-src]').forEach(img => {
                img.src = img.dataset.src;
            });
        }
    }

    // Adjust font sizes for mobile
    adjustFontSizes() {
        if (!this.isMobile) return;
        
        const scaleFactor = window.innerWidth / 1920; // Base design width
        
        document.querySelectorAll('.responsive-text').forEach(el => {
            const baseSize = parseFloat(getComputedStyle(el).fontSize);
            const adjustedSize = baseSize * Math.max(scaleFactor, 0.8);
            el.style.fontSize = `${adjustedSize}px`;
        });
    }

    // Optimize animations for mobile
    optimizeAnimations() {
        if (!this.isMobile) return;
        
        // Reduce animation intensity on mobile
        document.querySelectorAll('.animated').forEach(el => {
            el.style.animationDuration = '0.5s';
        });
        
        // Disable heavy animations
        if (this.isLowEndDevice()) {
            document.body.classList.add('reduce-motion');
        }
    }

    // Detect low-end devices
    isLowEndDevice() {
        const memory = navigator.deviceMemory || 4;
        const cores = navigator.hardwareConcurrency || 4;
        return memory < 4 || cores < 4;
    }

    // Setup performance optimizations
    setupPerformanceOptimizations() {
        // Debounce resize events
        this.debounceResize();
        
        // Throttle scroll events
        this.throttleScroll();
        
        // Optimize paint operations
        this.optimizePaint();
    }

    // Debounce resize events
    debounceResize() {
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.handleResize();
            }, 250);
        });
    }

    // Handle resize
    handleResize() {
        // Update responsive classes
        this.updateResponsiveClasses();
        
        // Recalculate layouts
        this.recalculateLayouts();
        
        // Update carousel sizes
        this.updateCarouselSizes();
    }

    // Update responsive classes
    updateResponsiveClasses() {
        const width = window.innerWidth;
        const body = document.body;
        
        // Remove existing size classes
        body.classList.remove('size-xs', 'size-sm', 'size-md', 'size-lg', 'size-xl');
        
        // Add new size class
        if (width < 576) body.classList.add('size-xs');
        else if (width < 768) body.classList.add('size-sm');
        else if (width < 992) body.classList.add('size-md');
        else if (width < 1200) body.classList.add('size-lg');
        else body.classList.add('size-xl');
    }

    // Recalculate layouts
    recalculateLayouts() {
        // Adjust grid layouts
        this.adjustGridLayouts();
        
        // Adjust navigation
        this.adjustNavigation();
        
        // Adjust hero section
        this.adjustHeroSection();
    }

    // Adjust grid layouts
    adjustGridLayouts() {
        const grids = document.querySelectorAll('.featured-grid, .brands-grid, .stats-grid');
        grids.forEach(grid => {
            const width = window.innerWidth;
            let columns;
            
            if (width < 576) columns = 1;
            else if (width < 768) columns = 2;
            else if (width < 992) columns = 3;
            else columns = 4;
            
            grid.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
        });
    }

    // Adjust navigation
    adjustNavigation() {
        const nav = document.querySelector('.hologram-nav');
        if (!nav) return;
        
        if (window.innerWidth <= 768) {
            nav.classList.add('mobile-nav');
            this.setupMobileNavBehavior();
        } else {
            nav.classList.remove('mobile-nav');
        }
    }

    // Setup mobile nav behavior
    setupMobileNavBehavior() {
        // Close dropdowns when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.nav-dropdown') && !e.target.closest('.dropdown-trigger')) {
                document.querySelectorAll('.nav-dropdown').forEach(dropdown => {
                    dropdown.classList.remove('open');
                });
            }
        });
    }

    // Adjust hero section
    adjustHeroSection() {
        const hero = document.querySelector('.cosmic-hero');
        if (!hero) return;
        
        if (window.innerHeight < 600) {
            hero.style.minHeight = `${window.innerHeight}px`;
        }
    }

    // Update carousel sizes
    updateCarouselSizes() {
        document.querySelectorAll('.carousel').forEach(carousel => {
            const slides = carousel.querySelectorAll('.carousel-slide');
            const width = carousel.offsetWidth;
            
            slides.forEach(slide => {
                slide.style.width = `${width}px`;
            });
        });
    }

    // Throttle scroll events
    throttleScroll() {
        let ticking = false;
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    this.handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }

    // Handle scroll events
    handleScroll() {
        // Update navigation on scroll
        this.updateNavOnScroll();
        
        // Parallax effects
        this.updateParallax();
        
        // Lazy load on scroll
        this.lazyLoadOnScroll();
        
        // Update scroll indicators
        this.updateScrollIndicators();
    }

    // Update navigation on scroll
    updateNavOnScroll() {
        const nav = document.querySelector('.hologram-nav');
        if (!nav) return;
        
        if (window.scrollY > 100) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    }

    // Update parallax effects
    updateParallax() {
        const scrollY = window.scrollY;
        const parallaxElements = document.querySelectorAll('.parallax-layer');
        
        parallaxElements.forEach((layer, index) => {
            const speed = parseFloat(layer.dataset.speed) || 0.5;
            const yPos = -(scrollY * speed);
            layer.style.transform = `translateY(${yPos}px)`;
        });
    }

    // Lazy load on scroll
    lazyLoadOnScroll() {
        // Additional lazy loading logic
    }

    // Update scroll indicators
    updateScrollIndicators() {
        const indicator = document.querySelector('.scroll-indicator');
        if (!indicator) return;
        
        const scrollPercentage = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
        
        if (scrollPercentage > 5) {
            indicator.style.opacity = '0';
        } else {
            indicator.style.opacity = '1';
        }
    }

    // Optimize paint operations
    optimizePaint() {
        // Use will-change sparingly
        document.querySelectorAll('.animated-element').forEach(el => {
            el.style.willChange = 'transform, opacity';
        });
        
        // Promote elements to their own layer
        document.querySelectorAll('.car-card, .nav-link').forEach(el => {
            el.style.transform = 'translateZ(0)';
        });
    }
}

// Initialize Responsive Touch
document.addEventListener('DOMContentLoaded', () => {
    const responsiveTouch = new ResponsiveTouch();
    window.ResponsiveTouch = responsiveTouch;
});

// CSS for ripple effect
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .touch-active {
        transform: scale(0.95) !important;
        transition: transform 0.1s ease !important;
    }
    
    .mobile-nav .nav-menu {
        transition: transform 0.3s ease;
    }
    
    .reduce-motion * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
    }
    
    .size-xs .hero-title {
        font-size: 2rem !important;
    }
    
    .size-sm .hero-title {
        font-size: 2.5rem !important;
    }
`;
document.head.appendChild(style);