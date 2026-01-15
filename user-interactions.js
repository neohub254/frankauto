/**
 * FRANK AUTO DEALS - User Interactions JS
 * Handles all user interactions, animations, and feedback
 */

class UserInteractions {
    constructor() {
        this.init();
        this.setupInteractions();
    }

    init() {
        this.setupHoverEffects();
        this.setupClickAnimations();
        this.setupScrollAnimations();
        this.setupFormInteractions();
        this.setupGameInteractions();
        this.setupSoundInteractions();
    }

    // Setup hover effects
    setupHoverEffects() {
        // Glow effect on nav links
        document.querySelectorAll('[data-hover-glow="true"]').forEach(element => {
            element.addEventListener('mouseenter', () => {
                element.style.boxShadow = '0 0 20px rgba(0, 243, 255, 0.5)';
                element.style.transform = 'translateY(-2px)';
            });
            
            element.addEventListener('mouseleave', () => {
                element.style.boxShadow = '';
                element.style.transform = '';
            });
        });

        // 3D tilt effect on cards
        document.querySelectorAll('.car-card, .brand-planet').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateY = (x - centerX) / 25;
                const rotateX = (centerY - y) / 25;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
            });
        });

        // Button scale effect
        document.querySelectorAll('.btn, button').forEach(btn => {
            btn.addEventListener('mouseenter', () => {
                btn.style.transform = 'scale(1.05)';
            });
            
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'scale(1)';
            });
        });
    }

    // Setup click animations
    setupClickAnimations() {
        // Ripple effect on all clickable elements
        document.addEventListener('click', (e) => {
            const target = e.target;
            const clickable = target.closest('.clickable, button, .btn, .nav-link, .action-btn');
            
            if (clickable) {
                this.createRipple(e, clickable);
            }
        });

        // Particle burst on special buttons
        document.querySelectorAll('.luxury-btn, .ai-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.createParticleBurst(e);
            });
        });

        // Confetti for successful actions
        document.querySelectorAll('.btn-success, .purchase-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.createConfetti();
            });
        });
    }

    // Create ripple effect
    createRipple(event, element) {
        const ripple = document.createElement('span');
        const rect = element.getBoundingClientRect();
        
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            transform: scale(0);
            animation: ripple-animation 0.6s linear;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            pointer-events: none;
        `;
        
        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    }

    // Create particle burst
    createParticleBurst(event) {
        const particleCount = 20;
        const colors = ['#00F3FF', '#9D00FF', '#FF003C', '#00FF9D'];
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle-burst';
            
            const size = Math.random() * 10 + 5;
            const color = colors[Math.floor(Math.random() * colors.length)];
            
            particle.style.cssText = `
                position: fixed;
                width: ${size}px;
                height: ${size}px;
                background: ${color};
                border-radius: 50%;
                pointer-events: none;
                z-index: 9999;
                left: ${event.clientX}px;
                top: ${event.clientY}px;
            `;
            
            document.body.appendChild(particle);
            
            // Animate particle
            const angle = Math.random() * Math.PI * 2;
            const velocity = Math.random() * 100 + 50;
            const vx = Math.cos(angle) * velocity;
            const vy = Math.sin(angle) * velocity;
            
            let opacity = 1;
            const animate = () => {
                opacity -= 0.02;
                particle.style.opacity = opacity;
                particle.style.transform = `translate(${vx}px, ${vy}px)`;
                
                if (opacity > 0) {
                    requestAnimationFrame(animate);
                } else {
                    particle.remove();
                }
            };
            
            animate();
        }
    }

    // Create confetti effect
    createConfetti() {
        const confettiCount = 150;
        const colors = ['#00F3FF', '#9D00FF', '#FF003C', '#00FF9D', '#FFD700', '#FFFFFF'];
        
        for (let i = 0; i < confettiCount; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            
            const size = Math.random() * 10 + 5;
            const color = colors[Math.floor(Math.random() * colors.length)];
            const shape = Math.random() > 0.5 ? 'circle' : 'rect';
            
            confetti.style.cssText = `
                position: fixed;
                width: ${size}px;
                height: ${size}px;
                background: ${color};
                ${shape === 'circle' ? 'border-radius: 50%;' : ''}
                pointer-events: none;
                z-index: 9999;
                left: ${Math.random() * window.innerWidth}px;
                top: -20px;
            `;
            
            document.body.appendChild(confetti);
            
            // Animate confetti
            const duration = Math.random() * 3000 + 2000;
            const animation = confetti.animate([
                {
                    transform: `translate(0, 0) rotate(0deg)`,
                    opacity: 1
                },
                {
                    transform: `translate(${Math.random() * 200 - 100}px, ${window.innerHeight + 100}px) rotate(${Math.random() * 720}deg)`,
                    opacity: 0
                }
            ], {
                duration: duration,
                easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)'
            });
            
            animation.onfinish = () => confetti.remove();
        }
    }

    // Setup scroll animations
    setupScrollAnimations() {
        // Reveal animations on scroll
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                }
            });
        }, observerOptions);

        // Observe elements for reveal animation
        document.querySelectorAll('.car-card, .stat-card, .brand-planet, .section-header').forEach(el => {
            observer.observe(el);
        });

        // Parallax scrolling
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallaxElements = document.querySelectorAll('.parallax');
            
            parallaxElements.forEach(element => {
                const speed = element.dataset.speed || 0.5;
                const yPos = -(scrolled * speed);
                element.style.transform = `translateY(${yPos}px)`;
            });
        });

        // Sticky navigation
        const nav = document.querySelector('.hologram-nav');
        if (nav) {
            window.addEventListener('scroll', () => {
                if (window.scrollY > 100) {
                    nav.classList.add('sticky');
                } else {
                    nav.classList.remove('sticky');
                }
            });
        }
    }

    // Setup form interactions
    setupFormInteractions() {
        // Input focus effects
        document.querySelectorAll('input, textarea, select').forEach(input => {
            input.addEventListener('focus', () => {
                input.parentElement.classList.add('focused');
            });
            
            input.addEventListener('blur', () => {
                if (!input.value) {
                    input.parentElement.classList.remove('focused');
                }
            });
            
            // Real-time validation
            input.addEventListener('input', () => {
                this.validateInput(input);
            });
        });

        // Form submission feedback
        document.querySelectorAll('form').forEach(form => {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const submitBtn = form.querySelector('button[type="submit"]');
                const originalText = submitBtn.innerHTML;
                
                // Show loading state
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
                submitBtn.disabled = true;
                
                try {
                    // Simulate API call
                    await new Promise(resolve => setTimeout(resolve, 1500));
                    
                    // Show success
                    submitBtn.innerHTML = '<i class="fas fa-check"></i> Success!';
                    submitBtn.style.background = '#00FF9D';
                    submitBtn.style.color = '#000';
                    
                    // Reset form
                    setTimeout(() => {
                        form.reset();
                        submitBtn.innerHTML = originalText;
                        submitBtn.disabled = false;
                        submitBtn.style.background = '';
                        submitBtn.style.color = '';
                    }, 2000);
                    
                } catch (error) {
                    // Show error
                    submitBtn.innerHTML = '<i class="fas fa-times"></i> Error!';
                    submitBtn.style.background = '#FF003C';
                    submitBtn.style.color = '#FFF';
                    
                    setTimeout(() => {
                        submitBtn.innerHTML = originalText;
                        submitBtn.disabled = false;
                        submitBtn.style.background = '';
                        submitBtn.style.color = '';
                    }, 2000);
                }
            });
        });
    }

    // Validate input
    validateInput(input) {
        const value = input.value.trim();
        const feedback = input.parentElement.querySelector('.validation-feedback');
        
        if (!feedback) return;
        
        // Clear previous feedback
        feedback.textContent = '';
        feedback.className = 'validation-feedback';
        
        // Email validation
        if (input.type === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                feedback.textContent = 'Please enter a valid email address';
                feedback.classList.add('error');
                return false;
            }
        }
        
        // Phone validation
        if (input.type === 'tel') {
            const phoneRegex = /^[+]?[\d\s\-()]+$/;
            if (!phoneRegex.test(value)) {
                feedback.textContent = 'Please enter a valid phone number';
                feedback.classList.add('error');
                return false;
            }
        }
        
        // Required field
        if (input.required && !value) {
            feedback.textContent = 'This field is required';
            feedback.classList.add('error');
            return false;
        }
        
        // Valid
        feedback.textContent = '✓';
        feedback.classList.add('valid');
        return true;
    }

    // Setup game interactions
    setupGameInteractions() {
        // Sound Challenge game
        const gameOptions = document.querySelectorAll('.game-option');
        const gameFeedback = document.querySelector('.game-feedback');
        
        if (gameOptions.length && gameFeedback) {
            const correctAnswer = 'Porsche 911'; // Example correct answer
            
            gameOptions.forEach(option => {
                option.addEventListener('click', () => {
                    const userAnswer = option.textContent;
                    
                    if (userAnswer === correctAnswer) {
                        gameFeedback.textContent = '🎉 Correct! That\'s a Porsche 911!';
                        gameFeedback.style.color = '#00FF9D';
                        option.style.background = '#00FF9D';
                        option.style.color = '#000';
                        
                        // Play success sound
                        this.playSound('success');
                        
                        // Add points animation
                        this.addPointsAnimation(100);
                    } else {
                        gameFeedback.textContent = '❌ Try again!';
                        gameFeedback.style.color = '#FF003C';
                        option.style.background = '#FF003C';
                        option.style.color = '#FFF';
                        
                        // Play error sound
                        this.playSound('error');
                    }
                    
                    // Disable other options
                    gameOptions.forEach(opt => {
                        opt.disabled = true;
                    });
                    
                    // Show correct answer
                    setTimeout(() => {
                        gameOptions.forEach(opt => {
                            if (opt.textContent === correctAnswer) {
                                opt.style.background = '#00FF9D';
                                opt.style.color = '#000';
                            }
                        });
                    }, 1000);
                });
            });
        }

        // Mini player controls
        const playBtn = document.querySelector('.play-btn');
        const visualizer = document.querySelector('.player-visualizer');
        
        if (playBtn) {
            let isPlaying = false;
            
            playBtn.addEventListener('click', () => {
                isPlaying = !isPlaying;
                
                if (isPlaying) {
                    playBtn.innerHTML = '<i class="fas fa-pause"></i>';
                    this.startVisualizer(visualizer);
                    this.playEngineSound();
                } else {
                    playBtn.innerHTML = '<i class="fas fa-play"></i>';
                    this.stopVisualizer(visualizer);
                    this.stopEngineSound();
                }
            });
        }
    }

    // Start audio visualizer
    startVisualizer(visualizer) {
        if (!visualizer) return;
        
        const bars = visualizer.querySelectorAll('.visualizer-bar');
        bars.forEach(bar => {
            bar.style.animation = 'visualize 1s infinite alternate';
        });
    }

    // Stop audio visualizer
    stopVisualizer(visualizer) {
        if (!visualizer) return;
        
        const bars = visualizer.querySelectorAll('.visualizer-bar');
        bars.forEach(bar => {
            bar.style.animation = 'none';
            bar.style.height = '10px';
        });
    }

    // Play engine sound
    playEngineSound() {
        // Implement engine sound playback
        console.log('Playing engine sound');
    }

    // Stop engine sound
    stopEngineSound() {
        console.log('Stopping engine sound');
    }

    // Setup sound interactions
    setupSoundInteractions() {
        // Volume controls
        const volumeBtn = document.createElement('button');
        volumeBtn.className = 'volume-control';
        volumeBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
        volumeBtn.style.cssText = `
            position: fixed;
            bottom: 100px;
            right: 20px;
            z-index: 1000;
            background: rgba(0,0,0,0.5);
            color: white;
            border: none;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            cursor: pointer;
            font-size: 20px;
        `;
        
        document.body.appendChild(volumeBtn);
        
        let isMuted = false;
        volumeBtn.addEventListener('click', () => {
            isMuted = !isMuted;
            volumeBtn.innerHTML = isMuted ? 
                '<i class="fas fa-volume-mute"></i>' : 
                '<i class="fas fa-volume-up"></i>';
            
            // Toggle all sounds
            this.toggleAllSounds(!isMuted);
        });

        // Sound effects for interactions
        this.setupInteractionSounds();
    }



    // Toggle all sounds
    toggleAllSounds(enabled) {
        const audioElements = document.querySelectorAll('audio, video');
        audioElements.forEach(audio => {
            audio.muted = !enabled;
        });
        
        // Update sound preference
        localStorage.setItem('sound-enabled', enabled);
    }

    // Setup interaction sounds
    setupInteractionSounds() {
        // Load sound preference
        const soundEnabled = localStorage.getItem('sound-enabled') !== 'false';
        if (!soundEnabled) {
            this.toggleAllSounds(false);
        }

        // Hover sounds
        document.querySelectorAll('.nav-link, .action-btn, .car-card').forEach(element => {
            element.addEventListener('mouseenter', () => {
                this.playSound('hover');
            });
        });

        // Click sounds
        document.addEventListener('click', (e) => {
            if (e.target.closest('button, .btn, .nav-link')) {
                this.playSound('click');
            }
        });

        // Scroll sound
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                this.playSound('scroll', 0.3);
            }, 100);
        });
    }

    // Play sound effect
    playSound(type, volume = 0.5) {
        if (localStorage.getItem('sound-enabled') === 'false') return;

        const sounds = {
            'hover': 'assets/sounds/hover.mp3',
            'click': 'assets/sounds/click.mp3',
            'scroll': 'assets/sounds/scroll.mp3',
            'success': 'assets/sounds/success.mp3',
            'error': 'assets/sounds/error.mp3',
            'access': 'assets/sounds/access.mp3'
        };

        const audio = new Audio(sounds[type] || sounds.click);
        audio.volume = volume;
        audio.play().catch(() => {
            // Fallback to beep if audio file not found
            if (type === 'success') this.beep(800, 200);
            else if (type === 'error') this.beep(300, 200);
            else this.beep(500, 100);
        });
    }

    // Beep fallback
    beep(frequency, duration) {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = frequency;
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + duration / 1000);
        } catch (e) {
            console.log('Audio context not supported');
        }
    }

    // Add points animation
    addPointsAnimation(points) {
        const pointsElement = document.createElement('div');
        pointsElement.className = 'points-animation';
        pointsElement.textContent = `+${points} Points`;
        pointsElement.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 24px;
            color: #00FF9D;
            font-weight: bold;
            text-shadow: 0 0 10px #00FF9D;
            z-index: 9999;
            animation: floatUp 2s ease-out forwards;
        `;
        
        document.body.appendChild(pointsElement);
        
        setTimeout(() => {
            pointsElement.remove();
        }, 2000);
    }
}

// Initialize User Interactions
document.addEventListener('DOMContentLoaded', () => {
    const userInteractions = new UserInteractions();
    window.UserInteractions = userInteractions;
});

// Add CSS animations
const interactionStyles = document.createElement('style');
interactionStyles.textContent = `
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    @keyframes floatUp {
        0% {
            opacity: 1;
            transform: translate(-50%, -50%);
        }
        100% {
            opacity: 0;
            transform: translate(-50%, -150%);
        }
    }
    
    @keyframes visualize {
        0% {
            height: 10px;
            opacity: 0.5;
        }
        100% {
            height: 40px;
            opacity: 1;
        }
    }
    
    .revealed {
        animation: reveal 0.8s ease-out forwards;
    }
    
    @keyframes reveal {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .sticky {
        position: fixed !important;
        top: 0 !important;
        width: 100% !important;
        z-index: 1000 !important;
        background: rgba(0, 0, 0, 0.95) !important;
        backdrop-filter: blur(10px) !important;
        animation: slideDown 0.3s ease-out !important;
    }
    
    @keyframes slideDown {
        from {
            transform: translateY(-100%);
        }
        to {
            transform: translateY(0);
        }
    }
    
    .validation-feedback {
        font-size: 12px;
        margin-top: 5px;
        display: block;
    }
    
    .validation-feedback.error {
        color: #FF003C;
    }
    
    .validation-feedback.valid {
        color: #00FF9D;
    }
`;
document.head.appendChild(interactionStyles);
