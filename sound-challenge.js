/**
 * FRANK AUTO DEALS - Sound Challenge Game
 * Engine Sound Guessing Game
 */

class SoundChallenge {
    constructor() {
        this.score = 0;
        this.highScore = 0;
        this.currentRound = 0;
        this.totalRounds = 10;
        this.timer = 60;
        this.timerInterval = null;
        this.isPlaying = false;
        this.currentSound = null;
        this.availableSounds = [];
        this.gameHistory = [];
        this.playerName = 'Guest';
        this.playCount = 3;
        this.sounds = [];
        this.categories = {
            all: 'All Cars',
            german: 'German Cars',
            japanese: 'Japanese Cars',
            american: 'American Cars'
        };
        this.difficulties = {
            easy: { points: 10, multiplier: 1 },
            medium: { points: 15, multiplier: 1.5 },
            hard: { points: 20, multiplier: 2 }
        };
        this.currentDifficulty = 'medium';
        this.currentCategory = 'all';
        
        this.init();
    }

    async init() {
        await this.loadSounds();
        this.loadHighScore();
        this.setupPlayerName();
        this.setupEventListeners();
        this.updateStats();
        this.loadLeaderboard();
        this.setupVisualizer();
        
        // Preload first sound
        this.preloadAudio();
    }

    async loadSounds() {
        try {
            // Try to load from localStorage first
            const savedSounds = localStorage.getItem('soundChallengeSounds');
            
            if (savedSounds) {
                this.sounds = JSON.parse(savedSounds);
            } else {
                // Load default sounds
                this.sounds = await this.loadDefaultSounds();
                localStorage.setItem('soundChallengeSounds', JSON.stringify(this.sounds));
            }
            
            console.log(`Loaded ${this.sounds.length} sounds`);
            this.updateTotalSounds();
        } catch (error) {
            console.error('Error loading sounds:', error);
            this.sounds = await this.loadDefaultSounds();
        }
    }

    async loadDefaultSounds() {
        // Default sounds data
        return [
            {
                id: 'sound_1',
                name: 'Toyota Land Cruiser V8',
                brand: 'Toyota',
                engine: '5.7L V8',
                category: 'japanese',
                difficulty: 'easy',
                hints: ['SUV', 'Popular in Africa', 'Reliable'],
                soundUrl: 'toyotalandcruiser.m4a', // Will be populated from localStorage
                points: 10
            },
            {
                id: 'sound_2',
                name: 'BMW X5 M Competition',
                brand: 'BMW',
                engine: '4.4L V8 Twin-Turbo',
                category: 'german',
                difficulty: 'medium',
                hints: ['Luxury SUV', 'German Engineering', 'M Performance'],
                soundUrl: '#bmwx5mcompetition',
                points: 15
            },
            {
                id: 'sound_3',
                name: 'Ford Mustang GT',
                brand: 'Ford',
                engine: '5.0L V8',
                category: 'american',
                difficulty: 'easy',
                hints: ['Muscle Car', 'American Icon', 'V8 Engine'],
                soundUrl: 'fordmustanggt',
                points: 10
            }
        ];
    }

    loadHighScore() {
        const savedScore = localStorage.getItem('soundChallengeHighScore');
        this.highScore = savedScore ? parseInt(savedScore) : 0;
        document.getElementById('topScore').textContent = this.highScore;
    }

    setupPlayerName() {
        const savedName = localStorage.getItem('playerName');
        if (savedName) {
            this.playerName = savedName;
        } else {
            const name = prompt('Enter your name for the leaderboard:', 'Guest');
            this.playerName = name || 'Guest';
            localStorage.setItem('playerName', this.playerName);
        }
    }

    setupEventListeners() {
        // Start game button
        document.getElementById('startGame')?.addEventListener('click', () => this.startGame());

        // Play sound button
        document.getElementById('playSound')?.addEventListener('click', () => this.playSound());

        // Answer buttons
        document.querySelectorAll('.answer-btn').forEach((btn, index) => {
            btn.addEventListener('click', () => this.submitAnswer(index));
        });

        // Hint button
        document.getElementById('showHint')?.addEventListener('click', () => this.showHint());

        // Skip button
        document.getElementById('skipQuestion')?.addEventListener('click', () => this.skipQuestion());

        // Play again button
        document.getElementById('playAgain')?.addEventListener('click', () => this.restartGame());

        // Difficulty buttons
        document.querySelectorAll('.difficulty-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const difficulty = e.currentTarget.dataset.difficulty;
                this.selectDifficulty(difficulty);
            });
        });

        // Category buttons
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const category = e.currentTarget.dataset.category;
                this.selectCategory(category);
            });
        });

        // Volume control (if added)
        const volumeControl = document.getElementById('volumeControl');
        if (volumeControl) {
            volumeControl.addEventListener('input', (e) => {
                this.setVolume(e.target.value / 100);
            });
        }

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (!this.isPlaying) return;

            switch(e.key) {
                case '1':
                case '2':
                case '3':
                case '4':
                    const index = parseInt(e.key) - 1;
                    this.submitAnswer(index);
                    break;
                case ' ':
                    e.preventDefault();
                    this.playSound();
                    break;
                case 'h':
                case 'H':
                    this.showHint();
                    break;
                case 's':
                case 'S':
                    this.skipQuestion();
                    break;
            }
        });
    }

    setupVisualizer() {
        const bars = document.querySelectorAll('.visualizer-bars .bar');
        let animationFrame;
        
        const animate = () => {
            bars.forEach(bar => {
                const randomHeight = Math.floor(Math.random() * 40) + 20;
                bar.style.height = `${randomHeight}px`;
            });
            animationFrame = requestAnimationFrame(animate);
        };
        
        // Start animation when sound plays
        this.visualizerAnimation = animate;
    }

    preloadAudio() {
        // Preload audio elements for better performance
        this.sounds.forEach(sound => {
            if (sound.soundUrl && sound.soundUrl !== '#') {
                const audio = new Audio();
                audio.src = sound.soundUrl;
                audio.preload = 'auto';
            }
        });
    }

    startGame() {
        if (this.isPlaying) return;

        this.isPlaying = true;
        this.score = 0;
        this.currentRound = 0;
        this.timer = 60;
        this.gameHistory = [];
        this.playCount = 3;

        // Hide start screen, show game screen
        document.getElementById('startScreen').style.display = 'none';
        document.getElementById('gameScreen').style.display = 'block';

        // Start timer
        this.startTimer();

        // Load first question
        this.nextQuestion();

        // Update UI
        this.updateGameUI();

        // Start visualizer
        this.visualizerAnimation();
    }

    startTimer() {
        this.stopTimer();
        
        this.timerInterval = setInterval(() => {
            this.timer--;
            this.updateTimerDisplay();
            
            if (this.timer <= 0) {
                this.endGame();
            }
        }, 1000);
    }

    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    updateTimerDisplay() {
        const timerElement = document.getElementById('timer');
        if (timerElement) {
            timerElement.textContent = this.timer;
            
            if (this.timer <= 10) {
                timerElement.classList.add('warning');
            } else {
                timerElement.classList.remove('warning');
            }
        }
    }

    nextQuestion() {
        this.currentRound++;
        
        if (this.currentRound > this.totalRounds) {
            this.endGame();
            return;
        }

        // Reset play count
        this.playCount = 3;
        this.updatePlayCountDisplay();

        // Get available sounds for current category and difficulty
        this.availableSounds = this.getAvailableSounds();
        
        if (this.availableSounds.length < 4) {
            console.warn('Not enough sounds for this category/difficulty');
            this.availableSounds = this.sounds;
        }

        // Select random sound
        const soundIndex = Math.floor(Math.random() * this.availableSounds.length);
        this.currentSound = this.availableSounds[soundIndex];

        // Generate wrong answers
        const wrongSounds = this.getWrongAnswers(this.currentSound);
        
        // Combine and shuffle answers
        const answers = [this.currentSound, ...wrongSounds];
        this.shuffleArray(answers);

        // Update question display
        this.updateQuestionDisplay(answers);

        // Reset hint
        this.resetHint();
    }

    getAvailableSounds() {
        return this.sounds.filter(sound => {
            const matchesCategory = this.currentCategory === 'all' || sound.category === this.currentCategory;
            const matchesDifficulty = sound.difficulty === this.currentDifficulty;
            return matchesCategory && matchesDifficulty;
        });
    }

    getWrongAnswers(correctSound, count = 3) {
        const wrongAnswers = [];
        const availableSounds = this.sounds.filter(sound => 
            sound.id !== correctSound.id && 
            sound.difficulty === correctSound.difficulty
        );

        // Shuffle and take needed count
        this.shuffleArray(availableSounds);
        
        for (let i = 0; i < Math.min(count, availableSounds.length); i++) {
            wrongAnswers.push(availableSounds[i]);
        }

        return wrongAnswers;
    }

    updateQuestionDisplay(answers) {
        // Update round number
        document.getElementById('currentRound').textContent = this.currentRound;
        document.getElementById('totalRounds').textContent = this.totalRounds;

        // Update answer buttons
        answers.forEach((answer, index) => {
            const btn = document.querySelectorAll('.answer-btn')[index];
            if (btn) {
                btn.querySelector('.car-name').textContent = answer.name;
                btn.querySelector('.car-brand').textContent = answer.brand;
                btn.classList.remove('correct', 'incorrect');
                btn.disabled = false;
            }
        });

        // Reset play button
        const playBtn = document.getElementById('playSound');
        if (playBtn) {
            playBtn.disabled = false;
            playBtn.innerHTML = '<i class="fas fa-play"></i> PLAY SOUND';
        }

        // Hide hint section
        document.getElementById('hintSection').style.display = 'none';
    }

    playSound() {
        if (!this.currentSound || this.playCount <= 0) return;

        const audio = document.getElementById('gameAudio');
        
        // Set audio source
        if (this.currentSound.soundUrl && this.currentSound.soundUrl !== '#') {
            audio.src = this.currentSound.soundUrl;
        } else {
            // Fallback: Use browser's audio context for generated sound
            this.generateEngineSound();
            return;
        }

        // Play audio
        audio.play().catch(error => {
            console.error('Error playing sound:', error);
            this.showFeedback('Error playing sound. Please try again.', 'error');
        });

        // Decrease play count
        this.playCount--;
        this.updatePlayCountDisplay();

        // Disable play button if no plays left
        if (this.playCount <= 0) {
            document.getElementById('playSound').disabled = true;
        }
    }

    generateEngineSound() {
        // Simple engine sound simulation using Web Audio API
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            // Configure engine sound
            oscillator.frequency.setValueAtTime(80, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(120, audioContext.currentTime + 1);
            oscillator.frequency.exponentialRampToValueAtTime(80, audioContext.currentTime + 2);
            
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.3, audioContext.currentTime + 0.5);
            gainNode.gain.exponentialRampToValueAtTime(0.1, audioContext.currentTime + 2);
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.start();
            oscillator.stop(audioContext.currentTime + 2);
            
            // Decrease play count
            this.playCount--;
            this.updatePlayCountDisplay();
            
        } catch (error) {
            console.error('Error generating sound:', error);
            this.showFeedback('Sound playback not supported', 'error');
        }
    }

    updatePlayCountDisplay() {
        const dots = document.querySelectorAll('.play-dots .dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index < this.playCount);
        });
    }

    submitAnswer(answerIndex) {
        if (!this.isPlaying) return;

        const selectedAnswer = this.currentSound;
        const answerBtn = document.querySelectorAll('.answer-btn')[answerIndex];
        const answerName = answerBtn.querySelector('.car-name').textContent;
        
        // Check if correct
        const isCorrect = answerName === this.currentSound.name;
        
        // Calculate points
        let points = this.difficulties[this.currentDifficulty].points;
        if (this.playCount === 3) points += 5; // Bonus for first try
        if (isCorrect) points *= this.difficulties[this.currentDifficulty].multiplier;
        
        // Update score
        if (isCorrect) {
            this.score += points;
            this.showFeedback('🎉 Correct! +' + points, 'correct');
            answerBtn.classList.add('correct');
        } else {
            this.showFeedback('❌ Incorrect!', 'incorrect');
            answerBtn.classList.add('incorrect');
            
            // Highlight correct answer
            document.querySelectorAll('.answer-btn').forEach(btn => {
                if (btn.querySelector('.car-name').textContent === this.currentSound.name) {
                    btn.classList.add('correct');
                }
            });
        }
        
        // Disable all buttons
        document.querySelectorAll('.answer-btn').forEach(btn => {
            btn.disabled = true;
        });
        
        // Record game history
        this.gameHistory.push({
            round: this.currentRound,
            sound: this.currentSound,
            userAnswer: answerName,
            correct: isCorrect,
            points: isCorrect ? points : 0,
            timeLeft: this.timer
        });
        
        // Update score display
        this.updateScoreDisplay();
        
        // Move to next question after delay
        setTimeout(() => {
            if (this.currentRound < this.totalRounds) {
                this.nextQuestion();
            } else {
                this.endGame();
            }
        }, 2000);
    }

    showHint() {
        if (!this.currentSound || this.currentSound.hints.length === 0) return;

        const hintSection = document.getElementById('hintSection');
        const hintText = document.getElementById('hintText');
        
        // Get random hint
        const hints = this.currentSound.hints;
        const randomHint = hints[Math.floor(Math.random() * hints.length)];
        
        // Show hint
        hintText.textContent = randomHint;
        hintSection.style.display = 'block';
        
        // Deduct points for using hint
        this.score = Math.max(0, this.score - 5);
        this.updateScoreDisplay();
        
        // Disable hint button
        document.getElementById('showHint').disabled = true;
    }

    resetHint() {
        document.getElementById('hintSection').style.display = 'none';
        document.getElementById('showHint').disabled = false;
    }

    skipQuestion() {
        if (!this.isPlaying) return;

        this.gameHistory.push({
            round: this.currentRound,
            sound: this.currentSound,
            userAnswer: 'Skipped',
            correct: false,
            points: 0,
            timeLeft: this.timer
        });

        this.showFeedback('⏭️ Skipped!', 'skipped');

        setTimeout(() => {
            if (this.currentRound < this.totalRounds) {
                this.nextQuestion();
            } else {
                this.endGame();
            }
        }, 1000);
    }

    endGame() {
        this.isPlaying = false;
        this.stopTimer();
        
        // Calculate time bonus
        const timeBonus = Math.floor(this.timer * 2);
        this.score += timeBonus;
        
        // Update high score if needed
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('soundChallengeHighScore', this.highScore.toString());
        }
        
        // Save game results
        this.saveGameResults();
        
        // Update leaderboard
        this.updateLeaderboard();
        
        // Show results screen
        this.showResults();
    }

    showResults() {
        document.getElementById('gameScreen').style.display = 'none';
        document.getElementById('resultsScreen').style.display = 'block';
        
        // Calculate stats
        const correctAnswers = this.gameHistory.filter(q => q.correct).length;
        const accuracy = Math.round((correctAnswers / this.totalRounds) * 100);
        
        // Update results
        document.getElementById('finalScore').textContent = this.score;
        document.getElementById('correctAnswers').textContent = `${correctAnswers}/${this.totalRounds}`;
        document.getElementById('accuracy').textContent = `${accuracy}%`;
        document.getElementById('timeTaken').textContent = `${60 - this.timer}s`;
        
        // Update breakdown
        this.updateResultsBreakdown();
        
        // Update personal stats
        this.updatePersonalStats();
    }

    updateResultsBreakdown() {
        const breakdownList = document.getElementById('resultsDetails');
        breakdownList.innerHTML = '';
        
        this.gameHistory.forEach((question, index) => {
            const div = document.createElement('div');
            div.className = `question-result ${question.correct ? 'correct' : 'incorrect'}`;
            div.innerHTML = `
                <div class="question-number">${index + 1}</div>
                <div class="question-info">
                    <div class="question-car">${question.sound.name}</div>
                    <div class="question-answer">Your answer: ${question.userAnswer}</div>
                </div>
                <div class="question-status">
                    ${question.correct ? '✓' : question.userAnswer === 'Skipped' ? '⏭️' : '✗'}
                </div>
            `;
            breakdownList.appendChild(div);
        });
    }

    updatePersonalStats() {
        const gameHistory = JSON.parse(localStorage.getItem('gameHistory') || '[]');
        
        document.getElementById('personalHighScore').textContent = this.highScore;
        document.getElementById('gamesPlayed').textContent = gameHistory.length;
        
        if (gameHistory.length > 0) {
            const totalScore = gameHistory.reduce((sum, game) => sum + game.score, 0);
            const averageScore = Math.round(totalScore / gameHistory.length);
            document.getElementById('averageScore').textContent = averageScore;
        }
    }

    saveGameResults() {
        const gameResults = {
            player: this.playerName,
            score: this.score,
            difficulty: this.currentDifficulty,
            category: this.currentCategory,
            correctAnswers: this.gameHistory.filter(q => q.correct).length,
            date: new Date().toISOString(),
            rounds: this.totalRounds
        };
        
        const history = JSON.parse(localStorage.getItem('gameHistory') || '[]');
        history.push(gameResults);
        
        // Keep only last 100 games
        const trimmedHistory = history.slice(-100);
        localStorage.setItem('gameHistory', JSON.stringify(trimmedHistory));
    }

    updateLeaderboard() {
        const leaderboard = JSON.parse(localStorage.getItem('leaderboard') || '[]');
        
        leaderboard.push({
            player: this.playerName,
            score: this.score,
            difficulty: this.currentDifficulty,
            category: this.currentCategory,
            date: new Date().toISOString()
        });
        
        // Sort by score (descending)
        leaderboard.sort((a, b) => b.score - a.score);
        
        // Keep only top 50 entries
        const trimmedLeaderboard = leaderboard.slice(0, 50);
        localStorage.setItem('leaderboard', JSON.stringify(trimmedLeaderboard));
        
        // Update leaderboard display
        this.loadLeaderboard();
    }

    loadLeaderboard() {
        const leaderboard = JSON.parse(localStorage.getItem('leaderboard') || '[]');
        const entriesContainer = document.getElementById('leaderboardEntries');
        
        if (leaderboard.length === 0) {
            entriesContainer.innerHTML = `
                <div class="no-entries">
                    <i class="fas fa-trophy"></i>
                    <p>No scores yet. Be the first to play!</p>
                </div>
            `;
            return;
        }
        
        entriesContainer.innerHTML = leaderboard.map((entry, index) => `
            <div class="leaderboard-entry">
                <div class="rank">${index + 1}</div>
                <div class="player">${entry.player}</div>
                <div class="score">${entry.score}</div>
                <div class="difficulty">${entry.difficulty.toUpperCase()}</div>
                <div class="date">${new Date(entry.date).toLocaleDateString()}</div>
            </div>
        `).join('');
    }

    restartGame() {
        document.getElementById('resultsScreen').style.display = 'none';
        document.getElementById('startScreen').style.display = 'block';
        
        // Reset game state
        this.score = 0;
        this.currentRound = 0;
        this.gameHistory = [];
        this.playCount = 3;
        
        // Update UI
        this.updateGameUI();
    }

    selectDifficulty(difficulty) {
        this.currentDifficulty = difficulty;
        
        // Update UI
        document.querySelectorAll('.difficulty-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.difficulty === difficulty) {
                btn.classList.add('active');
            }
        });
    }

    selectCategory(category) {
        this.currentCategory = category;
        
        // Update UI
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.category === category) {
                btn.classList.add('active');
            }
        });
    }

    setVolume(level) {
        const audio = document.getElementById('gameAudio');
        audio.volume = Math.max(0, Math.min(1, level));
    }

    updateGameUI() {
        this.updateScoreDisplay();
        this.updateTimerDisplay();
        this.updateTotalSounds();
    }

    updateScoreDisplay() {
        document.getElementById('currentScore').textContent = this.score;
    }

    updateTotalSounds() {
        document.getElementById('totalSounds').textContent = this.sounds.length;
    }

    showFeedback(message, type = 'info') {
        const feedback = document.getElementById('gameFeedback');
        feedback.textContent = message;
        feedback.className = `game-feedback ${type}`;
        feedback.style.display = 'block';
        
        setTimeout(() => {
            feedback.style.display = 'none';
        }, 2000);
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // Admin function to add sound (called from admin panel)
    addSound(soundData) {
        const newSound = {
            id: 'sound_' + Date.now(),
            ...soundData,
            points: this.difficulties[soundData.difficulty]?.points || 10
        };
        
        this.sounds.push(newSound);
        localStorage.setItem('soundChallengeSounds', JSON.stringify(this.sounds));
        
        console.log('Sound added:', newSound);
        this.updateTotalSounds();
        
        return newSound;
    }

    // Admin function to remove sound
    removeSound(soundId) {
        this.sounds = this.sounds.filter(sound => sound.id !== soundId);
        localStorage.setItem('soundChallengeSounds', JSON.stringify(this.sounds));
        this.updateTotalSounds();
    }

    // Admin function to update sound
    updateSound(soundId, updates) {
        const index = this.sounds.findIndex(sound => sound.id === soundId);
        if (index !== -1) {
            this.sounds[index] = { ...this.sounds[index], ...updates };
            localStorage.setItem('soundChallengeSounds', JSON.stringify(this.sounds));
        }
    }
}

// Initialize game
let gameInstance;

document.addEventListener('DOMContentLoaded', function() {
    gameInstance = new SoundChallenge();
    window.SoundChallenge = gameInstance;
    
    // Hide preloader
    setTimeout(() => {
        const preloader = document.getElementById('preloader');
        if (preloader) {
            preloader.style.opacity = '0';
            setTimeout(() => preloader.style.display = 'none', 500);
        }
    }, 1500);
});