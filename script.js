// ===== GLOBAL VARIABLES =====
let cursor = document.querySelector('.cursor');
let cursorFollower = document.querySelector('.cursor-follower');
let gameActive = false;
let gameScore = 0;
let gameTimer = 10;
let currentRound = 1;
let timerInterval;
let currentSound;
let correctBrand;

// ===== CURSOR EFFECTS =====
document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
    
    setTimeout(() => {
        cursorFollower.style.left = e.clientX + 'px';
        cursorFollower.style.top = e.clientY + 'px';
    }, 50);
});

// Add hover effect to interactive elements
const interactiveElements = document.querySelectorAll('a, button, .car-card, .brand-portal, .badge-card, .testimonial-card, .option-btn, .nav-link');
interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursor.classList.add('hover');
    });
    el.addEventListener('mouseleave', () => {
        cursor.classList.remove('hover');
    });
});

// ===== NAVIGATION SCROLL EFFECT =====
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    // Animate elements on scroll
    animateOnScroll();
});




// ===== HAMBURGER MENU - SIMPLIFIED FIX =====
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        // Initially hide hamburger on desktop
        updateHamburgerVisibility();
        
        // Update on resize
        window.addEventListener('resize', updateHamburgerVisibility);
        
        // Toggle menu
        hamburger.addEventListener('click', function(e) {
            e.stopPropagation();
            this.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
        
        // Close menu when clicking a link
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
    
    function updateHamburgerVisibility() {
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        
        if (!hamburger || !navMenu) return;
        
        // Always show hamburger on mobile, hide on desktop
        if (window.innerWidth <= 1024) {
            hamburger.style.display = 'flex';
            navMenu.style.display = 'none';
        } else {
            hamburger.style.display = 'none';
            navMenu.style.display = 'flex';
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    }
});

// ===== MINIMAL WORKING FIX FOR CAR BUTTONS =====
(function() {
    // Wait a bit for page to fully load
    setTimeout(() => {
        console.log('Setting up car buttons...');
        
        // Fix Virtual Tour buttons
        document.querySelectorAll('.view-details').forEach(btn => {
            btn.onclick = function(e) {
                e.preventDefault();
                const card = this.closest('.car-card');
                const brand = card.querySelector('.car-brand')?.textContent || 'Car';
                const model = card.querySelector('.car-model')?.textContent || 'Model';
                alert(`🚗 Virtual Tour for ${brand} ${model}\n\nThis would launch an interactive 360° tour!`);
            };
        });
        
        // Fix Inquire Now buttons  
        document.querySelectorAll('.inquire-now').forEach(btn => {
            btn.onclick = function(e) {
                e.preventDefault();
                const card = this.closest('.car-card');
                const brand = card.querySelector('.car-brand')?.textContent || 'Car';
                const model = card.querySelector('.car-model')?.textContent || 'Model';
                const price = card.querySelector('.price-amount')?.textContent || 'Contact for price';
                
                const message = `Hello! I'm interested in the ${brand} ${model} (KES ${price}). Please provide more details.`;
                const url = `https://wa.me/254742436155?text=${encodeURIComponent(message)}`;
                
                window.open(url, '_blank');
            };
        });
        
        console.log(`Fixed ${document.querySelectorAll('.view-details').length} Virtual Tour buttons`);
        console.log(`Fixed ${document.querySelectorAll('.inquire-now').length} Inquire Now buttons`);
    }, 500);
})();


// ===== STATISTICS COUNTER =====
function animateStatistics() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    statNumbers.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-target'));
        const increment = target / 100;
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            stat.textContent = Math.floor(current);
        }, 20);
    });
}

// Initialize statistics animation when in viewport
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateStatistics();
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const statsSection = document.querySelector('.hero-stats');
if (statsSection) {
    statsObserver.observe(statsSection);
}

// ===== ANIMATE ON SCROLL =====
function animateOnScroll() {
    const elements = document.querySelectorAll('.car-card, .badge-card, .testimonial-card, .brand-portal');
    
    elements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.2;
        
        if (elementPosition < screenPosition) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
}

// Set initial states for animated elements
document.querySelectorAll('.car-card, .badge-card, .testimonial-card, .brand-portal').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
});

// ===== CAR CARDS HOVER EFFECTS =====
const carCards = document.querySelectorAll('.car-card');
carCards.forEach(card => {
    card.addEventListener('mouseenter', (e) => {
        const color = getComputedStyle(card).color;
        card.style.setProperty('--glow-color', color);
    });
});

// ===== TESTIMONIAL SLIDER =====
const testimonialCards = document.querySelector('.testimonial-cards');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');
const dots = document.querySelectorAll('.dot');
let currentSlide = 0;

function updateSlider() {
    const cardWidth = document.querySelector('.testimonial-card').offsetWidth + 32; // including gap
    testimonialCards.style.transform = `translateX(-${currentSlide * cardWidth}px)`;
    
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
    });
}

if (prevBtn && nextBtn) {
    prevBtn.addEventListener('click', () => {
        currentSlide = Math.max(0, currentSlide - 1);
        updateSlider();
    });
    
    nextBtn.addEventListener('click', () => {
        const maxSlides = testimonialCards.children.length - 1;
        currentSlide = Math.min(maxSlides, currentSlide + 1);
        updateSlider();
    });
}

dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        currentSlide = index;
        updateSlider();
    });
});

// Auto slide testimonials
setInterval(() => {
    if (currentSlide < testimonialCards.children.length - 1) {
        currentSlide++;
    } else {
        currentSlide = 0;
    }
    updateSlider();
}, 5000);

// ===== SOUND GUESSING GAME =====
const gameSounds = [
    { id: 1, brand: "BMW", sound: "sounds/bmw-engine.mp3", color: "#0066ff" },
    { id: 2, brand: "Mercedes", sound: "sounds/mercedes-engine.mp3", color: "#ff00ff" },
    { id: 3, brand: "Porsche", sound: "sounds/porsche-engine.mp3", color: "#ff6b35" },
    { id: 4, brand: "Ferrari", sound: "sounds/ferrari-engine.mp3", color: "#ff0033" },
    { id: 5, brand: "Lamborghini", sound: "sounds/lamborghini-engine.mp3", color: "#9d00ff" },
    { id: 6, brand: "Audi", sound: "sounds/audi-engine.mp3", color: "#ffffff" },
    { id: 7, brand: "Mustang", sound: "sounds/mustang-engine.mp3", color: "#ff6b35" },
    { id: 8, brand: "Range Rover", sound: "sounds/range-rover-engine.mp3", color: "#00ff9d" },
    { id: 9, brand: "Lexus", sound: "sounds/lexus-engine.mp3", color: "#ffffff" },
    { id: 10, brand: "Tesla", sound: "sounds/tesla-sound.mp3", color: "#00f7ff" }
];

const playBtn = document.getElementById('playBtn');
const repeatBtn = document.getElementById('repeatBtn');
const optionGrid = document.getElementById('optionGrid');
const gameResult = document.getElementById('gameResult');
const scoreElement = document.getElementById('score');
const timerElement = document.getElementById('timer');
const roundElement = document.getElementById('round');
const soundWave = document.getElementById('soundWave');
const carSilhouette = document.getElementById('carSilhouette');

// Initialize game options
function initializeGameOptions() {
    optionGrid.innerHTML = '';
    const brands = ["BMW", "Mercedes", "Porsche", "Ferrari", "Lamborghini", "Audi", "Mustang", "Range Rover", "Lexus", "Tesla"];
    
    // Shuffle and take 5 random brands
    const shuffled = [...brands].sort(() => 0.5 - Math.random()).slice(0, 5);
    
    shuffled.forEach(brand => {
        const button = document.createElement('button');
        button.className = 'option-btn';
        button.textContent = brand;
        button.addEventListener('click', () => checkAnswer(brand));
        optionGrid.appendChild(button);
    });
}

// Start the game
function startGame() {
    if (gameActive) return;
    
    gameActive = true;
    gameScore = 0;
    currentRound = 1;
    gameTimer = 10;
    
    scoreElement.textContent = gameScore;
    timerElement.textContent = gameTimer;
    roundElement.textContent = `${currentRound}/10`;
    gameResult.innerHTML = '';
    
    // Enable repeat button
    repeatBtn.disabled = false;
    
    // Start first round
    playRound();
    
    // Start timer
    startTimer();
}

// Play a round
function playRound() {
    // Select random sound
    const randomSound = gameSounds[Math.floor(Math.random() * gameSounds.length)];
    correctBrand = randomSound.brand;
    
    // Create audio element
    if (currentSound) {
        currentSound.pause();
        currentSound.currentTime = 0;
    }
    
    currentSound = new Audio(randomSound.sound);
    currentSound.play();
    
    // Animate sound wave
    animateSoundWave();
    
    // Update car silhouette
    carSilhouette.innerHTML = `<i class="fas fa-car" style="color: ${randomSound.color}; font-size: 5rem;"></i>`;
    
    // Update options (include correct answer with 4 wrong ones)
    updateOptions(randomSound.brand);
}

// Update game options
function updateOptions(correctBrand) {
    const allBrands = gameSounds.map(s => s.brand);
    const wrongBrands = allBrands.filter(b => b !== correctBrand);
    
    // Shuffle wrong brands and take 4
    const selectedWrongBrands = [...wrongBrands]
        .sort(() => 0.5 - Math.random())
        .slice(0, 4);
    
    // Combine with correct brand and shuffle
    const options = [correctBrand, ...selectedWrongBrands]
        .sort(() => 0.5 - Math.random());
    
    // Update option buttons
    const optionButtons = optionGrid.querySelectorAll('.option-btn');
    optionButtons.forEach((btn, index) => {
        btn.textContent = options[index];
        btn.className = 'option-btn';
        btn.onclick = () => checkAnswer(options[index]);
        btn.disabled = false;
    });
}

// Check answer
function checkAnswer(selectedBrand) {
    if (!gameActive) return;
    
    const optionButtons = optionGrid.querySelectorAll('.option-btn');
    optionButtons.forEach(btn => {
        btn.disabled = true;
        if (btn.textContent === correctBrand) {
            btn.classList.add('correct');
        } else if (btn.textContent === selectedBrand && selectedBrand !== correctBrand) {
            btn.classList.add('wrong');
        }
    });
    
    if (selectedBrand === correctBrand) {
        gameScore += 10;
        scoreElement.textContent = gameScore;
        gameResult.innerHTML = `
            <div style="color: #00ff9d; font-size: 1.2rem; margin-bottom: 1rem;">
                <i class="fas fa-check-circle"></i> Correct! That's a ${correctBrand} engine!
            </div>
        `;
    } else {
        gameResult.innerHTML = `
            <div style="color: #ff0033; font-size: 1.2rem; margin-bottom: 1rem;">
                <i class="fas fa-times-circle"></i> Wrong! It was a ${correctBrand} engine.
            </div>
        `;
    }
    
    // Next round after delay
    setTimeout(() => {
        if (currentRound < 10) {
            currentRound++;
            roundElement.textContent = `${currentRound}/10`;
            gameTimer = 10;
            timerElement.textContent = gameTimer;
            playRound();
            
            // Re-enable buttons
            optionButtons.forEach(btn => {
                btn.disabled = false;
                btn.classList.remove('correct', 'wrong');
            });
            
            gameResult.innerHTML = '';
        } else {
            endGame();
        }
    }, 2000);
}

// Start timer
function startTimer() {
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        if (gameTimer > 0) {
            gameTimer--;
            timerElement.textContent = gameTimer;
            
            // Pulse animation when time is low
            if (gameTimer <= 5) {
                timerElement.style.animation = 'pulse 1s infinite';
            }
        } else {
            // Time's up
            clearInterval(timerInterval);
            if (gameActive) {
                gameResult.innerHTML = `
                    <div style="color: #ff6b35; font-size: 1.2rem; margin-bottom: 1rem;">
                        <i class="fas fa-clock"></i> Time's up! It was a ${correctBrand}.
                    </div>
                `;
                
                // Disable buttons
                const optionButtons = optionGrid.querySelectorAll('.option-btn');
                optionButtons.forEach(btn => {
                    btn.disabled = true;
                    if (btn.textContent === correctBrand) {
                        btn.classList.add('correct');
                    }
                });
                
                // Next round after delay
                setTimeout(() => {
                    if (currentRound < 10) {
                        currentRound++;
                        roundElement.textContent = `${currentRound}/10`;
                        gameTimer = 10;
                        timerElement.textContent = gameTimer;
                        timerElement.style.animation = '';
                        playRound();
                        
                        // Re-enable buttons
                        optionButtons.forEach(btn => {
                            btn.disabled = false;
                            btn.classList.remove('correct', 'wrong');
                        });
                        
                        gameResult.innerHTML = '';
                        startTimer();
                    } else {
                        endGame();
                    }
                }, 2000);
            }
        }
    }, 1000);
}

// End game
function endGame() {
    gameActive = false;
    clearInterval(timerInterval);
    
    let message = '';
    if (gameScore >= 80) {
        message = `Excellent! You scored ${gameScore}/100. You're a true car expert!`;
    } else if (gameScore >= 60) {
        message = `Good job! You scored ${gameScore}/100. You know your engines!`;
    } else {
        message = `You scored ${gameScore}/100. Keep practicing to improve!`;
    }
    
    gameResult.innerHTML = `
        <div style="text-align: center;">
            <h3 style="color: #ff00ff; margin-bottom: 1rem;">Game Over!</h3>
            <p style="margin-bottom: 1rem; font-size: 1.1rem;">${message}</p>
            <button class="game-btn play-btn" id="restartBtn" style="margin: 0 auto;">
                <i class="fas fa-redo"></i>
                <span>PLAY AGAIN</span>
            </button>
        </div>
    `;
    
    // Add restart button listener
    document.getElementById('restartBtn').addEventListener('click', startGame);
}

// Animate sound wave
function animateSoundWave() {
    const bars = soundWave.querySelectorAll('.wave-bar');
    bars.forEach(bar => {
        bar.style.animation = 'none';
        void bar.offsetWidth; // Trigger reflow
        bar.style.animation = null;
    });
}

// Event listeners for game buttons
if (playBtn) {
    playBtn.addEventListener('click', startGame);
}

if (repeatBtn) {
    repeatBtn.addEventListener('click', () => {
        if (currentSound && gameActive) {
            currentSound.currentTime = 0;
            currentSound.play();
            animateSoundWave();
        }
    });
}

// Initialize game options on page load
document.addEventListener('DOMContentLoaded', () => {
    initializeGameOptions();
    
    // Add particle effects
    createParticles();
    
    // Initialize scroll animations
    animateOnScroll();
    window.addEventListener('scroll', animateOnScroll);
});

// ===== PARTICLE EFFECTS =====
function createParticles() {
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'particles-container';
    particlesContainer.style.position = 'fixed';
    particlesContainer.style.top = '0';
    particlesContainer.style.left = '0';
    particlesContainer.style.width = '100%';
    particlesContainer.style.height = '100%';
    particlesContainer.style.pointerEvents = 'none';
    particlesContainer.style.zIndex = '1';
    document.body.appendChild(particlesContainer);
    
    const colors = ['#ff00ff', '#00ff9d', '#0066ff', '#9d00ff', '#ff6b35', '#00f7ff'];
    
    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.width = Math.random() * 4 + 2 + 'px';
        particle.style.height = particle.style.width;
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];
        particle.style.borderRadius = '50%';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.opacity = '0.3';
        particle.style.filter = 'blur(1px)';
        
        // Animation
        particle.style.animation = `float ${Math.random() * 10 + 10}s linear infinite`;
        particle.style.animationDelay = Math.random() * 5 + 's';
        
        particlesContainer.appendChild(particle);
    }
}

// ===== VIDEO BACKGROUND =====
const videoSection = document.querySelector('.video-nebula-section');
if (videoSection) {
    const video = videoSection.querySelector('video');
    if (video) {
        // Play video when in viewport
        const videoObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    video.play();
                } else {
                    video.pause();
                }
            });
        }, { threshold: 0.5 });
        
        videoObserver.observe(videoSection);
    }
}

// ===== BRAND PORTAL ANIMATIONS =====
const brandPortals = document.querySelectorAll('.brand-portal');
brandPortals.forEach(portal => {
    portal.addEventListener('mouseenter', () => {
        const portalContainer = portal.querySelector('.portal-container');
        const color = portal.getAttribute('data-color');
        
        // Create ripple effect
        const ripple = document.createElement('div');
        ripple.style.position = 'absolute';
        ripple.style.width = '100%';
        ripple.style.height = '100%';
        ripple.style.background = `radial-gradient(circle at center, var(--${color}), transparent 70%)`;
        ripple.style.opacity = '0';
        ripple.style.transition = 'opacity 0.3s ease';
        ripple.style.borderRadius = '20px';
        ripple.style.zIndex = '1';
        
        portalContainer.appendChild(ripple);
        
        setTimeout(() => {
            ripple.style.opacity = '0.3';
        }, 10);
        
        portal.addEventListener('mouseleave', () => {
            ripple.style.opacity = '0';
            setTimeout(() => {
                ripple.remove();
            }, 300);
        }, { once: true });
    });
});

// ===== WHATSAPP BUTTON PULSE =====
const whatsappButtons = document.querySelectorAll('.whatsapp-float, .whatsapp-btn');
whatsappButtons.forEach(btn => {
    setInterval(() => {
        btn.style.transform = 'scale(1.05)';
        setTimeout(() => {
            btn.style.transform = 'scale(1)';
        }, 300);
    }, 3000);
});

// ===== GLASS MORPHISM EFFECT =====
const glassElements = document.querySelectorAll('.badge-card, .testimonial-card, .car-card');
glassElements.forEach(el => {
    el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        el.style.setProperty('--mouse-x', `${x}px`);
        el.style.setProperty('--mouse-y', `${y}px`);
    });
});

// ===== TYPEWRITER EFFECT FOR HERO TITLE =====
function typeWriterEffect() {
    const titleWords = document.querySelectorAll('.title-word');
    let delay = 0;
    
    titleWords.forEach(word => {
        const text = word.textContent;
        word.textContent = '';
        
        setTimeout(() => {
            let i = 0;
            const typing = setInterval(() => {
                if (i < text.length) {
                    word.textContent += text.charAt(i);
                    i++;
                } else {
                    clearInterval(typing);
                }
            }, 100);
        }, delay);
        
        delay += 500;
    });
}

// Start typewriter effect when page loads
window.addEventListener('load', () => {
    setTimeout(typeWriterEffect, 500);
});

// ===== PAGE LOAD ANIMATION =====
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
        
        // Animate hero elements sequentially
        const heroElements = document.querySelectorAll('.hero-subtitle, .hero-stats, .hero-cta, .scroll-indicator');
        heroElements.forEach((el, index) => {
            setTimeout(() => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, 500 + (index * 200));
        });
    }, 100);
});

// ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
            
            // Close mobile menu if open
            if (navMenu.classList.contains('active')) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                navMenu.style.display = '';
            }
        }
    });
});

// ===== RAINBOW TEXT EFFECT =====
const rainbowTexts = document.querySelectorAll('.section-title-glow, .logo-text, .nebula-title');
rainbowTexts.forEach(text => {
    setInterval(() => {
        const hue = (Date.now() / 20) % 360;
        text.style.background = `linear-gradient(90deg, 
            hsl(${hue}, 100%, 50%), 
            hsl(${(hue + 60) % 360}, 100%, 50%), 
            hsl(${(hue + 120) % 360}, 100%, 50%))`;
        text.style.webkitBackgroundClip = 'text';
        text.style.backgroundClip = 'text';
    }, 50);
});

// ===== COUNTDOWN TIMER FOR SPECIAL OFFERS =====
function createCountdownTimer() {
    const countdownElement = document.createElement('div');
    countdownElement.className = 'countdown-timer';
    countdownElement.style.position = 'fixed';
    countdownElement.style.top = '100px';
    countdownElement.style.right = '20px';
    countdownElement.style.background = 'rgba(255, 0, 255, 0.2)';
    countdownElement.style.backdropFilter = 'blur(10px)';
    countdownElement.style.border = '2px solid #ff00ff';
    countdownElement.style.borderRadius = '15px';
    countdownElement.style.padding = '1rem';
    countdownElement.style.color = '#fff';
    countdownElement.style.zIndex = '999';
    countdownElement.style.fontFamily = "'Orbitron', sans-serif";
    countdownElement.style.textAlign = 'center';
    countdownElement.style.boxShadow = '0 10px 30px rgba(255, 0, 255, 0.3)';
    
    countdownElement.innerHTML = `
        <div style="font-size: 0.8rem; margin-bottom: 0.5rem; color: #ff00ff;">SPECIAL OFFER ENDS IN</div>
        <div style="font-size: 1.5rem; font-weight: 700;" id="countdown-time">24:00:00</div>
        <div style="font-size: 0.7rem; margin-top: 0.5rem; opacity: 0.8;">Limited Time Only</div>
    `;
    
    document.body.appendChild(countdownElement);
    
    // Countdown timer logic
    let timeLeft = 24 * 60 * 60; // 24 hours in seconds
    
    const updateCountdown = () => {
        if (timeLeft <= 0) {
            timeLeft = 24 * 60 * 60; // Reset to 24 hours
        }
        
        const hours = Math.floor(timeLeft / 3600);
        const minutes = Math.floor((timeLeft % 3600) / 60);
        const seconds = timeLeft % 60;
        
        document.getElementById('countdown-time').textContent = 
            `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        // Pulse animation when under 1 hour
        if (timeLeft <= 3600) {
            countdownElement.style.animation = 'pulse 1s infinite';
        }
        
        timeLeft--;
    };
    
    setInterval(updateCountdown, 1000);
    updateCountdown();
}

// Create countdown timer after page loads
setTimeout(createCountdownTimer, 2000);

// ===== RANDOM COLOR GENERATOR FOR BACKGROUND =====
function randomizeBackground() {
    const hue = Math.floor(Math.random() * 360);
    document.documentElement.style.setProperty('--primary-color', `hsl(${hue}, 100%, 50%)`);
    document.documentElement.style.setProperty('--secondary-color', `hsl(${(hue + 60) % 360}, 100%, 50%)`);
    document.documentElement.style.setProperty('--accent-color', `hsl(${(hue + 120) % 360}, 100%, 50%)`);
}

// Change background colors every 30 seconds
setInterval(randomizeBackground, 30000);

// ===== KEYBOARD SHORTCUTS =====
document.addEventListener('keydown', (e) => {
    // Space bar to play/pause game
    if (e.code === 'Space' && gameActive) {
        e.preventDefault();
        if (currentSound) {
            if (currentSound.paused) {
                currentSound.play();
            } else {
                currentSound.pause();
            }
        }
    }
    
    // Escape to reset game
    if (e.code === 'Escape' && gameActive) {
        endGame();
    }
    
    // G to start game
    if (e.code === 'KeyG' && !gameActive) {
        startGame();
    }
});

// ===== TOUCH DEVICE OPTIMIZATIONS =====
if ('ontouchstart' in window) {
    // Increase tap targets for mobile
    const tapTargets = document.querySelectorAll('button, a, .option-btn');
    tapTargets.forEach(target => {
        target.style.minHeight = '44px';
        target.style.minWidth = '44px';
        target.style.display = 'flex';
        target.style.alignItems = 'center';
        target.style.justifyContent = 'center';
    });
    
    // Disable hover effects on mobile
    document.body.classList.add('touch-device');
}

// ===== PERFORMANCE OPTIMIZATIONS =====
// Lazy load images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                const src = img.getAttribute('data-src');
                if (src) {
                    img.src = src;
                    img.removeAttribute('data-src');
                }
                imageObserver.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ===== ERROR HANDLING =====
window.addEventListener('error', (e) => {
    console.error('Error occurred:', e.error);
});

// ===== CAR CARD BUTTONS - FIXED FOR YOUR HTML =====

document.addEventListener('DOMContentLoaded', function() {
    console.log('Setting up car card buttons...');
    
    // Find all car action buttons
    const carActionDivs = document.querySelectorAll('.car-actions');
    console.log(`Found ${carActionDivs.length} car action sections`);
    
    carActionDivs.forEach((actionsDiv, index) => {
        // Get the buttons inside this car-actions div
        const viewBtn = actionsDiv.querySelector('.view-details');
        const inquireBtn = actionsDiv.querySelector('.inquire-now');
        
        console.log(`Car ${index + 1}:`, {
            hasViewBtn: !!viewBtn,
            hasInquireBtn: !!inquireBtn
        });
        
        // Add click handler for Virtual Tour button
        if (viewBtn) {
            // Remove any existing listeners
            const newViewBtn = viewBtn.cloneNode(true);
            viewBtn.parentNode.replaceChild(newViewBtn, viewBtn);
            
            newViewBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('Virtual Tour clicked');
                
                // Get car card
                const carCard = this.closest('.car-card');
                
                // Get car details
                const carBrand = carCard.querySelector('.car-brand')?.textContent || 'Unknown';
                const carModel = carCard.querySelector('.car-model')?.textContent || 'Unknown';
                const carPrice = carCard.querySelector('.price-amount')?.textContent || 'N/A';
                const priceCurrency = carCard.querySelector('.price-currency')?.textContent || 'KES';
                
                // Get features
                const features = [];
                carCard.querySelectorAll('.feature').forEach(feature => {
                    features.push(feature.textContent.trim());
                });
                
                console.log('Car details:', { carBrand, carModel, carPrice, features });
                
                // Create virtual tour
                createVirtualTourModal(carBrand, carModel, `${priceCurrency} ${carPrice}`, features);
            });
        }
        
        // Add click handler for Inquire Now button
        if (inquireBtn) {
            // Remove any existing listeners
            const newInquireBtn = inquireBtn.cloneNode(true);
            inquireBtn.parentNode.replaceChild(newInquireBtn, inquireBtn);
            
            newInquireBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('Inquire Now clicked');
                
                // Get car card
                const carCard = this.closest('.car-card');
                
                // Get car details
                const carBrand = carCard.querySelector('.car-brand')?.textContent || 'Unknown';
                const carModel = carCard.querySelector('.car-model')?.textContent || 'Unknown';
                const carPrice = carCard.querySelector('.price-amount')?.textContent || 'N/A';
                const priceCurrency = carCard.querySelector('.price-currency')?.textContent || 'KES';
                const priceTag = carCard.querySelector('.price-tag')?.textContent || 'Available';
                
                // Get features
                const features = [];
                carCard.querySelectorAll('.feature').forEach(feature => {
                    features.push(feature.textContent.trim());
                });
                
                // Get stats
                const stats = [];
                carCard.querySelectorAll('.car-stat').forEach(stat => {
                    stats.push(stat.textContent.trim());
                });
                
                console.log('Inquiry details:', { carBrand, carModel, carPrice, priceTag, features, stats });
                
                // Send WhatsApp inquiry
                sendWhatsAppInquiry(carBrand, carModel, `${priceCurrency} ${carPrice}`, priceTag, features, stats);
            });
        }
    });
    
    console.log('All car buttons set up!');
});

// ===== VIRTUAL TOUR MODAL FUNCTION =====
function createVirtualTourModal(brand, model, price, features) {
    // Remove existing modal if any
    const existingModal = document.querySelector('.virtual-tour-overlay');
    if (existingModal) existingModal.remove();
    
    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'virtual-tour-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.95);
        backdrop-filter: blur(10px);
        z-index: 10000;
        display: flex;
        justify-content: center;
        align-items: center;
        animation: fadeIn 0.3s ease;
    `;
    
    // Create modal content
    overlay.innerHTML = `
        <div class="virtual-tour-modal" style="
            background: linear-gradient(135deg, #1a1a2e, #16213e);
            border: 2px solid var(--voltage-purple);
            border-radius: 20px;
            padding: 2rem;
            max-width: 800px;
            width: 90%;
            max-height: 90vh;
            overflow-y: auto;
            position: relative;
            box-shadow: 0 0 50px rgba(157, 0, 255, 0.5);
            animation: slideUp 0.4s ease;
        ">
            <button class="close-tour" style="
                position: absolute;
                top: 15px;
                right: 15px;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                background: var(--voltage-purple);
                color: white;
                border: none;
                font-size: 1.5rem;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
            ">×</button>
            
            <h2 style="
                color: var(--voltage-purple);
                text-align: center;
                margin-bottom: 1.5rem;
                font-family: 'Orbitron', sans-serif;
                font-size: 2rem;
            ">360° VIRTUAL TOUR</h2>
            
            <div style="text-align: center; margin-bottom: 2rem;">
                <h3 style="color: white; font-size: 1.8rem; margin-bottom: 0.5rem;">${brand} ${model}</h3>
                <div style="
                    color: var(--neon-emerald);
                    font-family: 'Orbitron', sans-serif;
                    font-size: 2rem;
                    font-weight: bold;
                    margin-bottom: 1rem;
                ">${price}</div>
            </div>
            
            <div style="
                background: rgba(255, 255, 255, 0.05);
                border-radius: 15px;
                padding: 1.5rem;
                margin-bottom: 2rem;
                text-align: center;
            ">
                <div style="font-size: 4rem; color: var(--voltage-purple); margin-bottom: 1rem;">
                    <i class="fas fa-vr-cardboard"></i>
                </div>
                <p style="color: white; margin-bottom: 1rem;">Interactive 360° Experience Loading...</p>
                <div style="
                    width: 60px;
                    height: 60px;
                    border: 3px solid var(--voltage-purple);
                    border-top: 3px solid transparent;
                    border-radius: 50%;
                    margin: 0 auto;
                    animation: spin 1s linear infinite;
                "></div>
            </div>
            
            <div style="margin-bottom: 2rem;">
                <h4 style="color: var(--neon-emerald); margin-bottom: 1rem;">Key Features:</h4>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
                    ${features.map(feature => `
                        <div style="
                            background: rgba(255, 255, 255, 0.05);
                            border: 1px solid var(--voltage-purple);
                            border-radius: 10px;
                            padding: 1rem;
                            color: white;
                            display: flex;
                            align-items: center;
                            gap: 0.5rem;
                        ">
                            <i class="fas fa-check-circle" style="color: var(--voltage-purple);"></i>
                            <span>${feature}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div style="
                display: flex;
                gap: 1rem;
                justify-content: center;
                margin-top: 2rem;
                flex-wrap: wrap;
            ">
                <button class="tour-control-btn" data-view="exterior" style="
                    padding: 0.8rem 1.5rem;
                    background: linear-gradient(90deg, var(--electric-blue), var(--neon-emerald));
                    color: white;
                    border: none;
                    border-radius: 25px;
                    cursor: pointer;
                    font-weight: bold;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                ">
                    <i class="fas fa-car"></i> Exterior
                </button>
                <button class="tour-control-btn" data-view="interior" style="
                    padding: 0.8rem 1.5rem;
                    background: linear-gradient(90deg, var(--voltage-purple), var(--cyber-magenta));
                    color: white;
                    border: none;
                    border-radius: 25px;
                    cursor: pointer;
                    font-weight: bold;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                ">
                    <i class="fas fa-chair"></i> Interior
                </button>
                <button class="tour-control-btn" data-view="engine" style="
                    padding: 0.8rem 1.5rem;
                    background: linear-gradient(90deg, var(--sunset-orange), var(--laser-red));
                    color: white;
                    border: none;
                    border-radius: 25px;
                    cursor: pointer;
                    font-weight: bold;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                ">
                    <i class="fas fa-cogs"></i> Engine
                </button>
            </div>
            
            <div style="margin-top: 2rem; text-align: center;">
                <button class="book-physical-tour" style="
                    padding: 1rem 2rem;
                    background: linear-gradient(90deg, var(--cyber-magenta), var(--voltage-purple));
                    color: white;
                    border: none;
                    border-radius: 30px;
                    font-weight: bold;
                    cursor: pointer;
                    font-size: 1rem;
                    display: flex;
                    align-items: center;
                    gap: 0.8rem;
                    margin: 0 auto;
                    transition: all 0.3s ease;
                ">
                    <i class="fab fa-whatsapp"></i>
                    <span>Book Physical Viewing</span>
                </button>
            </div>
        </div>
    `;
    
    // Add to page
    document.body.appendChild(overlay);
    
    // Add animations if not exist
    if (!document.querySelector('#tour-animations')) {
        const style = document.createElement('style');
        style.id = 'tour-animations';
        style.textContent = `
            @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
            @keyframes slideUp { from { transform: translateY(50px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
            @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            
            .virtual-tour-overlay .close-tour:hover {
                transform: rotate(90deg) scale(1.1);
                background: var(--cyber-magenta) !important;
            }
            
            .tour-control-btn:hover {
                transform: translateY(-3px);
                box-shadow: 0 10px 20px rgba(255, 255, 255, 0.2);
            }
            
            .book-physical-tour:hover {
                transform: translateY(-3px) scale(1.05);
                box-shadow: 0 15px 30px rgba(255, 0, 255, 0.4);
            }
        `;
        document.head.appendChild(style);
    }
    
    // Close button functionality
    overlay.querySelector('.close-tour').addEventListener('click', () => {
        overlay.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => overlay.remove(), 300);
    });
    
    // Close on background click
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            overlay.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => overlay.remove(), 300);
        }
    });
    
    // Tour control buttons
    overlay.querySelectorAll('.tour-control-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const view = this.getAttribute('data-view');
            console.log(`Switching to ${view} view`);
            
            // Highlight active button
            overlay.querySelectorAll('.tour-control-btn').forEach(b => {
                b.style.opacity = '0.7';
                b.style.transform = 'scale(0.95)';
            });
            this.style.opacity = '1';
            this.style.transform = 'scale(1)';
            
            // Update tour display (in real implementation, this would load the 360° view)
            const tourDisplay = overlay.querySelector('.virtual-tour-modal > div:nth-child(3)');
            tourDisplay.innerHTML = `
                <div style="font-size: 4rem; color: ${view === 'exterior' ? 'var(--electric-blue)' : view === 'interior' ? 'var(--voltage-purple)' : 'var(--sunset-orange)'}; margin-bottom: 1rem;">
                    <i class="fas fa-${view === 'exterior' ? 'car' : view === 'interior' ? 'chair' : 'cogs'}"></i>
                </div>
                <p style="color: white; margin-bottom: 1rem; font-size: 1.2rem;">
                    ${view.charAt(0).toUpperCase() + view.slice(1)} View - Use mouse to rotate
                </p>
                <div style="
                    width: 100%;
                    height: 200px;
                    background: linear-gradient(45deg, 
                        ${view === 'exterior' ? '#001132, #003366' : 
                         view === 'interior' ? '#330033, #660066' : 
                         '#331100, #663300'});
                    border-radius: 10px;
                    margin: 1rem 0;
                    position: relative;
                    overflow: hidden;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                ">
                    <div style="color: white; text-align: center;">
                        <i class="fas fa-sync-alt fa-spin" style="font-size: 3rem; margin-bottom: 1rem;"></i>
                        <p>Loading ${view} view...</p>
                    </div>
                </div>
                <p style="color: rgba(255, 255, 255, 0.7); font-size: 0.9rem;">
                    Hold and drag to rotate • Scroll to zoom • Click to interact
                </p>
            `;
        });
    });
    
    // Book physical tour button
    overlay.querySelector('.book-physical-tour').addEventListener('click', () => {
        const message = `Hello! I'd like to book a physical viewing for the ${brand} ${model} (${price}). Please suggest available dates.`;
        const url = `https://wa.me/254742436155?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    });
    
    // Add fadeOut animation
    if (!document.querySelector('#fadeOutAnim')) {
        const fadeStyle = document.createElement('style');
        fadeStyle.id = 'fadeOutAnim';
        fadeStyle.textContent = `@keyframes fadeOut { from { opacity: 1; } to { opacity: 0; } }`;
        document.head.appendChild(fadeStyle);
    }
}

// ===== WHATSAPP INQUIRY FUNCTION =====
function sendWhatsAppInquiry(brand, model, price, tag, features, stats) {
    const whatsappNumber = '254742436155';
    
    // Format price (remove commas for number formatting)
    const numericPrice = price.replace(/[^\d]/g, '');
    const formattedPrice = new Intl.NumberFormat().format(numericPrice);
    
    // Create detailed message
    let message = `*🚗 CAR INQUIRY - ${brand} ${model}*\n\n`;
    message += `*Price:* ${price}\n`;
    message += `*Status:* ${tag}\n\n`;
    
    if (features.length > 0) {
        message += `*Key Features:*\n`;
        features.slice(0, 3).forEach(feature => {
            message += `✅ ${feature}\n`;
        });
        message += `\n`;
    }
    
    if (stats.length > 0) {
        message += `*Performance:*\n`;
        stats.forEach(stat => {
            message += `⚡ ${stat}\n`;
        });
        message += `\n`;
    }
    
    message += `*I'm interested in this vehicle. Please provide:*\n`;
    message += `1. Complete specifications\n`;
    message += `2. Current availability\n`;
    message += `3. Financing options\n`;
    message += `4. Test drive scheduling\n`;
    message += `5. Warranty information\n`;
    message += `6. Delivery timeline\n\n`;
    message += `Thank you!\n`;
    message += `[Inquiry from Frank Auto Deals Website]`;
    
    // Encode for URL
    const encodedMessage = encodeURIComponent(message);
    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    
    // Create quick confirmation
    const confirmed = confirm(`Open WhatsApp to inquire about:\n\n${brand} ${model}\n${price}\n\nA pre-filled message will be ready.`);
    
    if (confirmed) {
        window.open(whatsappURL, '_blank');
    }
}

// ===== QUICK TEST - Add this to verify buttons work =====
console.log('Car buttons script loaded successfully!');

// Test: Add visual indicator that buttons are clickable
setTimeout(() => {
    document.querySelectorAll('.car-btn').forEach(btn => {
        btn.style.cursor = 'pointer';
        btn.style.transition = 'all 0.3s ease';
        
        btn.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 5px 15px rgba(255, 0, 255, 0.3)';
        });
        
        btn.addEventListener('mouseleave', function() {
            this.style.transform = '';
            this.style.boxShadow = '';
        });
    });
    
    console.log('Added hover effects to', document.querySelectorAll('.car-btn').length, 'car buttons');
}, 1000);

// ===== INITIALIZE EVERYTHING =====
document.addEventListener('DOMContentLoaded', () => {
    console.log('NEON GARAGE Website Initialized');
    console.log('Features loaded:');
    console.log('- Custom cursor effects');
    console.log('- Particle animations');
    console.log('- Sound guessing game');
    console.log('- Neon color effects');
    console.log('- Smooth animations');
    console.log('- Mobile responsive');
});



