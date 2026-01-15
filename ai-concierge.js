/**
 * FRANK AUTO DEALS - AI Concierge JS
 * Interactive AI assistant for car inquiries
 */

class AIConcierge {
    constructor() {
        this.isOpen = false;
        this.messages = [];
        this.conversationId = this.generateConversationId();
        this.init();
    }

    init() {
        this.loadConversation();
        this.setupEventListeners();
        this.setupQuickQuestions();
        this.setupSpeechRecognition();
        this.setupTypingIndicator();
        
        // Auto-open if first visit
        if (!localStorage.getItem('ai-first-interaction')) {
            setTimeout(() => this.open(), 30000); // Open after 30 seconds
        }
    }

    // Generate unique conversation ID
    generateConversationId() {
        return 'conv_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // Load previous conversation
    loadConversation() {
        const saved = localStorage.getItem('ai-conversation');
        if (saved) {
            this.messages = JSON.parse(saved);
            this.renderMessages();
        } else {
            // Initial greeting
            this.addMessage('ai', 'Hello! I\'m Frank\'s AI Concierge. How can I help you find your dream car today?');
        }
    }

    // Save conversation
    saveConversation() {
        localStorage.setItem('ai-conversation', JSON.stringify(this.messages.slice(-50))); // Keep last 50 messages
    }

    // Setup event listeners
    setupEventListeners() {
        // Open/close concierge
        document.querySelectorAll('.ai-concierge-btn, .ai-btn').forEach(btn => {
            btn.addEventListener('click', () => this.open());
        });

        document.querySelector('.close-concierge')?.addEventListener('click', () => this.close());

        // Send message on enter
        const aiInput = document.getElementById('aiInput');
        const sendBtn = document.getElementById('sendMessage');

        if (aiInput && sendBtn) {
            aiInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendMessage();
                }
            });

            sendBtn.addEventListener('click', () => this.sendMessage());

            // Auto-focus when opened
            aiInput.addEventListener('focus', () => {
                localStorage.setItem('ai-first-interaction', 'true');
            });
        }

        // Close on escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });
    }

    // Setup quick questions
    setupQuickQuestions() {
        document.querySelectorAll('.quick-question').forEach(btn => {
            btn.addEventListener('click', () => {
                const question = btn.dataset.question;
                this.processQuickQuestion(question);
            });
        });
    }

    // Setup speech recognition
    setupSpeechRecognition() {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.recognition = new SpeechRecognition();
            this.recognition.continuous = false;
            this.recognition.interimResults = false;
            this.recognition.lang = 'en-US';

            // Add voice input button
            this.addVoiceInputButton();
        }
    }

    // Add voice input button
    addVoiceInputButton() {
        const inputContainer = document.querySelector('.concierge-input');
        if (!inputContainer) return;

        const voiceBtn = document.createElement('button');
        voiceBtn.className = 'voice-input-btn';
        voiceBtn.innerHTML = '<i class="fas fa-microphone"></i>';
        voiceBtn.title = 'Voice Input';
        
        voiceBtn.addEventListener('click', () => this.startVoiceInput());
        inputContainer.appendChild(voiceBtn);
    }

    // Start voice input
    startVoiceInput() {
        if (!this.recognition) return;

        const aiInput = document.getElementById('aiInput');
        aiInput.placeholder = 'Listening...';

        this.recognition.start();

        this.recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            aiInput.value = transcript;
            aiInput.placeholder = 'Ask about cars, prices, availability...';
        };

        this.recognition.onerror = () => {
            aiInput.placeholder = 'Ask about cars, prices, availability...';
        };
    }

    // Setup typing indicator
    setupTypingIndicator() {
        this.typingIndicator = document.createElement('div');
        this.typingIndicator.className = 'message ai typing';
        this.typingIndicator.innerHTML = `
            <div class="message-content">
                <div class="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        `;
    }

    // Open AI concierge
    open() {
        const concierge = document.getElementById('aiConcierge');
        if (concierge) {
            concierge.style.display = 'block';
            this.isOpen = true;
            
            // Animate in
            setTimeout(() => {
                concierge.classList.add('open');
            }, 10);
            
            // Focus input
            const aiInput = document.getElementById('aiInput');
            if (aiInput) aiInput.focus();
            
            // Track opening
            this.trackEvent('ai_concierge_opened');
        }
    }

    // Close AI concierge
    close() {
        const concierge = document.getElementById('aiConcierge');
        if (concierge) {
            concierge.classList.remove('open');
            setTimeout(() => {
                concierge.style.display = 'none';
                this.isOpen = false;
            }, 300);
        }
    }

    // Send message
    async sendMessage() {
        const aiInput = document.getElementById('aiInput');
        const message = aiInput.value.trim();
        
        if (!message) return;
        
        // Add user message
        this.addMessage('user', message);
        aiInput.value = '';
        
        // Show typing indicator
        this.showTypingIndicator();
        
        try {
            // Get AI response
            const response = await this.getAIResponse(message);
            
            // Remove typing indicator
            this.hideTypingIndicator();
            
            // Add AI response
            this.addMessage('ai', response);
            
            // Save conversation
            this.saveConversation();
            
        } catch (error) {
            console.error('AI Error:', error);
            this.hideTypingIndicator();
            this.addMessage('ai', 'I apologize, but I\'m having trouble connecting. Please try again or contact us directly via WhatsApp.');
        }
    }

    // Process quick question
    async processQuickQuestion(question) {
        // Add user question
        this.addMessage('user', question);
        
        // Show typing indicator
        this.showTypingIndicator();
        
        try {
            const response = await this.getAIResponse(question);
            this.hideTypingIndicator();
            this.addMessage('ai', response);
            this.saveConversation();
        } catch (error) {
            this.hideTypingIndicator();
            this.addMessage('ai', 'I apologize, but I\'m having trouble connecting. Please try again or contact us directly via WhatsApp.');
        }
    }

    // Show typing indicator
    showTypingIndicator() {
        const messagesContainer = document.getElementById('conciergeMessages');
        if (messagesContainer) {
            messagesContainer.appendChild(this.typingIndicator);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    }

    // Hide typing indicator
    hideTypingIndicator() {
        if (this.typingIndicator.parentElement) {
            this.typingIndicator.remove();
        }
    }

    // Add message to chat
    addMessage(sender, content) {
        const message = {
            id: Date.now(),
            sender,
            content,
            timestamp: new Date().toISOString()
        };
        
        this.messages.push(message);
        this.renderMessage(message);
        
        // Scroll to bottom
        const messagesContainer = document.getElementById('conciergeMessages');
        if (messagesContainer) {
            setTimeout(() => {
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            }, 100);
        }
    }

    // Render message
    renderMessage(message) {
        const messagesContainer = document.getElementById('conciergeMessages');
        if (!messagesContainer) return;
        
        const messageElement = document.createElement('div');
        messageElement.className = `message ${message.sender}`;
        messageElement.innerHTML = `
            <div class="message-content">
                ${message.content}
                <div class="message-time">
                    ${new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
            </div>
        `;
        
        messagesContainer.appendChild(messageElement);
        
        // Auto-scroll
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // Render all messages
    renderMessages() {
        const messagesContainer = document.getElementById('conciergeMessages');
        if (!messagesContainer) return;
        
        messagesContainer.innerHTML = '';
        this.messages.forEach(message => this.renderMessage(message));
    }

    // Get AI response (simulated - in production would call an API)
    async getAIResponse(userMessage) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
        
        // Parse user message
        const message = userMessage.toLowerCase();
        
        // Car database simulation
        const carDatabase = {
            'toyota': [
                { name: 'Toyota Land Cruiser V8', price: 'KSh 25,000,000', year: 2023, type: 'SUV' },
                { name: 'Toyota Prado TX', price: 'KSh 8,500,000', year: 2022, type: 'SUV' },
                { name: 'Toyota Hilux', price: 'KSh 4,500,000', year: 2024, type: 'Pickup' }
            ],
            'bmw': [
                { name: 'BMW M5 Competition', price: 'KSh 18,500,000', year: 2024, type: 'Sports Sedan' },
                { name: 'BMW X5', price: 'KSh 12,000,000', year: 2023, type: 'SUV' }
            ],
            'mercedes': [
                { name: 'Mercedes S-Class', price: 'KSh 32,000,000', year: 2024, type: 'Luxury Sedan' },
                { name: 'Mercedes G-Wagon', price: 'KSh 45,000,000', year: 2024, type: 'SUV' }
            ]
        };
        
        // Response patterns
        if (message.includes('hello') || message.includes('hi')) {
            return 'Hello! Welcome to Frank Auto Deals. How can I assist you today?';
        }
        
        if (message.includes('price') || message.includes('cost') || message.includes('how much')) {
            return 'Our cars range from KSh 1.2M to KSh 45M depending on the make, model, and specifications. Could you specify which car or budget range you\'re interested in?';
        }
        
        if (message.includes('toyota')) {
            const cars = carDatabase.toyota;
            const response = `We have several Toyota models available:\n\n${cars.map(car => 
                `• ${car.name} - ${car.price} (${car.year}, ${car.type})`
            ).join('\n')}\n\nWould you like more details about any specific model?`;
            return response;
        }
        
        if (message.includes('bmw')) {
            const cars = carDatabase.bmw;
            return `We have premium BMW models:\n\n${cars.map(car => 
                `• ${car.name} - ${car.price} (${car.year})`
            ).join('\n')}\n\nThe BMW M5 Competition is our latest sports sedan with a 4.4L V8 engine.`;
        }
        
        if (message.includes('mercedes')) {
            const cars = carDatabase.mercedes;
            return `Our Mercedes collection includes:\n\n${cars.map(car => 
                `• ${car.name} - ${car.price}`
            ).join('\n')}\n\nThe G-Wagon is our top luxury SUV with superior off-road capabilities.`;
        }
        
        if (message.includes('suv') || message.includes('4x4')) {
            return 'We have a wide range of SUVs from Toyota Land Cruiser (KSh 25M), Range Rover (from KSh 12M), BMW X5 (KSh 12M), to more affordable options like Toyota Prado (KSh 8.5M). What\'s your budget range?';
        }
        
        if (message.includes('budget') || message.includes('cheap') || message.includes('affordable')) {
            return 'For budget-friendly options, we have:\n• Toyota RAV4 - KSh 3.2M\n• Nissan X-Trail - KSh 3.8M\n• Ford Ranger - KSh 4.5M\n• Toyota Hilux - KSh 4.5M\n\nWould you like to see more options under KSh 5M?';
        }
        
        if (message.includes('luxury') || message.includes('expensive') || message.includes('premium')) {
            return 'Our luxury collection features:\n• Mercedes S-Class - KSh 32M\n• Porsche 911 - KSh 45M\n• Range Rover Autobiography - KSh 38M\n• BMW M5 - KSh 18.5M\n\nThese come with premium features like leather interiors, advanced safety systems, and superior performance.';
        }
        
        if (message.includes('contact') || message.includes('call') || message.includes('whatsapp')) {
            return 'You can reach us directly at:\n📞 +254 742 436 155\n📱 WhatsApp: https://wa.me/254742436155\n📧 info@frankautodeals.co.ke\n\nWe\'re available 24/7 for your inquiries!';
        }
        
        if (message.includes('location') || message.includes('where') || message.includes('address')) {
            return 'Our showroom is located in Nairobi, Kenya. We offer nationwide delivery and test drives by appointment. Would you like to schedule a visit?';
        }
        
        if (message.includes('test drive') || message.includes('drive')) {
            return 'Absolutely! We offer test drives for all our vehicles. Please provide:\n1. Your preferred car model\n2. Preferred date and time\n3. Your location\n\nI can schedule it for you right away!';
        }
        
        if (message.includes('finance') || message.includes('loan') || message.includes('payment')) {
            return 'We offer flexible financing options:\n• Bank financing partnerships\n• Payment plans (up to 60 months)\n• Trade-in options\n• Insurance services\n\nWhat\'s your preferred payment method?';
        }
        
        // Default response
        const responses = [
            "I understand you're interested in cars. Could you tell me what specific make, model, or budget range you're looking for?",
            "That's a great question! At Frank Auto Deals, we specialize in luxury and premium vehicles. Are you looking for something specific like an SUV, sedan, or sports car?",
            "I'd be happy to help you find the perfect vehicle. Could you share more details about what you're looking for?",
            "Based on your inquiry, I recommend checking our latest arrivals or the luxury collection. Is there a particular brand you prefer?",
            "We have over 500 cars in our inventory. To better assist you, could you specify:\n• Your budget range\n• Preferred car type (SUV, sedan, etc.)\n• Must-have features"
        ];
        
        return responses[Math.floor(Math.random() * responses.length)];
    }

    // Track events
    trackEvent(eventName, data = {}) {
        const eventData = {
            event: eventName,
            timestamp: new Date().toISOString(),
            conversationId: this.conversationId,
            ...data
        };
        
        // Log to console (in production, send to analytics)
        console.log('AI Event:', eventData);
        
        // Save to localStorage for analytics
        const events = JSON.parse(localStorage.getItem('ai-events') || '[]');
        events.push(eventData);
        localStorage.setItem('ai-events', JSON.stringify(events.slice(-100))); // Keep last 100 events
    }

    // Export conversation
    exportConversation() {
        const blob = new Blob([JSON.stringify(this.messages, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `frank-ai-conversation-${this.conversationId}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    // Clear conversation
    clearConversation() {
        this.messages = [];
        this.conversationId = this.generateConversationId();
        localStorage.removeItem('ai-conversation');
        this.renderMessages();
        this.addMessage('ai', 'Hello! I\'m Frank\'s AI Concierge. How can I help you find your dream car today?');
    }
}

// Initialize AI Concierge
document.addEventListener('DOMContentLoaded', () => {
    const aiConcierge = new AIConcierge();
    window.AIConcierge = aiConcierge;
    
    // Global functions for HTML onclick handlers
    window.openAIConcierge = () => aiConcierge.open();
    window.closeAIConcierge = () => aiConcierge.close();
});

// Add AI Concierge styles
const aiStyles = document.createElement('style');
aiStyles.textContent = `
    .ai-concierge {
        display: none;
        position: fixed;
        bottom: 100px;
        right: 30px;
        width: 400px;
        max-width: 90vw;
        height: 600px;
        max-height: 70vh;
        background: rgba(10, 10, 20, 0.95);
        border-radius: 20px;
        backdrop-filter: blur(20px);
        border: 1px solid rgba(0, 243, 255, 0.3);
        box-shadow: 0 10px 40px rgba(0, 243, 255, 0.2);
        z-index: 9999;
        overflow: hidden;
        transform: translateY(20px);
        opacity: 0;
        transition: all 0.3s ease;
    }
    
    .ai-concierge.open {
        transform: translateY(0);
        opacity: 1;
    }
    
    .concierge-header {
        padding: 20px;
        background: linear-gradient(135deg, #0a0a14 0%, #151530 100%);
        border-bottom: 1px solid rgba(0, 243, 255, 0.2);
        display: flex;
        align-items: center;
        gap: 15px;
    }
    
    .ai-avatar {
        position: relative;
        width: 50px;
        height: 50px;
        background: linear-gradient(135deg, #00F3FF, #9D00FF);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
    }
    
    .avatar-glow {
        position: absolute;
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background: inherit;
        filter: blur(10px);
        opacity: 0.5;
        animation: pulse 2s infinite;
    }
    
    @keyframes pulse {
        0%, 100% { transform: scale(1); opacity: 0.5; }
        50% { transform: scale(1.1); opacity: 0.3; }
    }
    
    .ai-info h4 {
        margin: 0;
        color: #00F3FF;
        font-size: 18px;
    }
    
    .ai-status {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-top: 5px;
    }
    
    .status-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #00FF9D;
    }
    
    .status-dot.online {
        background: #00FF9D;
        animation: blink 2s infinite;
    }
    
    @keyframes blink {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.3; }
    }
    
    .close-concierge {
        margin-left: auto;
        background: none;
        border: none;
        color: #fff;
        font-size: 20px;
        cursor: pointer;
        opacity: 0.7;
        transition: opacity 0.3s;
    }
    
    .close-concierge:hover {
        opacity: 1;
    }
    
    .concierge-messages {
        height: calc(100% - 200px);
        overflow-y: auto;
        padding: 20px;
        display: flex;
        flex-direction: column;
        gap: 15px;
    }
    
    .message {
        max-width: 80%;
        animation: messageIn 0.3s ease;
    }
    
    @keyframes messageIn {
        from {
            opacity: 0;
            transform: translateY(10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .message.user {
        align-self: flex-end;
    }
    
    .message.ai {
        align-self: flex-start;
    }
    
    .message-content {
        padding: 15px;
        border-radius: 15px;
        position: relative;
        white-space: pre-line;
        line-height: 1.5;
    }
    
    .message.user .message-content {
        background: linear-gradient(135deg, #00F3FF, #9D00FF);
        color: #000;
        border-bottom-right-radius: 5px;
    }
    
    .message.ai .message-content {
        background: rgba(255, 255, 255, 0.1);
        color: #fff;
        border-bottom-left-radius: 5px;
        border: 1px solid rgba(0, 243, 255, 0.2);
    }
    
    .message-time {
        font-size: 11px;
        opacity: 0.7;
        margin-top: 5px;
        text-align: right;
    }
    
    .concierge-input {
        padding: 20px;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
        display: flex;
        gap: 10px;
        background: rgba(0, 0, 0, 0.5);
    }
    
    .concierge-input input {
        flex: 1;
        padding: 12px 15px;
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(0, 243, 255, 0.3);
        border-radius: 10px;
        color: #fff;
        font-size: 14px;
    }
    
    .concierge-input input:focus {
        outline: none;
        border-color: #00F3FF;
        box-shadow: 0 0 10px rgba(0, 243, 255, 0.3);
    }
    
    .concierge-input button {
        padding: 12px 20px;
        background: linear-gradient(135deg, #00F3FF, #9D00FF);
        border: none;
        border-radius: 10px;
        color: #000;
        font-weight: bold;
        cursor: pointer;
        transition: transform 0.3s;
    }
    
    .concierge-input button:hover {
        transform: scale(1.05);
    }
    
    .voice-input-btn {
        padding: 12px;
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(0, 243, 255, 0.3);
        border-radius: 10px;
        color: #00F3FF;
        cursor: pointer;
    }
    
    .quick-questions {
        padding: 0 20px 20px;
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
    }
    
    .quick-question {
        padding: 8px 15px;
        background: rgba(0, 243, 255, 0.1);
        border: 1px solid rgba(0, 243, 255, 0.3);
        border-radius: 20px;
        color: #00F3FF;
        font-size: 12px;
        cursor: pointer;
        transition: all 0.3s;
    }
    
    .quick-question:hover {
        background: rgba(0, 243, 255, 0.2);
        transform: translateY(-2px);
    }
    
    .typing-dots {
        display: flex;
        gap: 4px;
    }
    
    .typing-dots span {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #00F3FF;
        opacity: 0.3;
        animation: typing 1.4s infinite;
    }
    
    .typing-dots span:nth-child(2) {
        animation-delay: 0.2s;
    }
    
    .typing-dots span:nth-child(3) {
        animation-delay: 0.4s;
    }
    
    @keyframes typing {
        0%, 100% { opacity: 0.3; transform: translateY(0); }
        50% { opacity: 1; transform: translateY(-5px); }
    }
`;
document.head.appendChild(aiStyles);