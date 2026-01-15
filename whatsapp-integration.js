/**
 * FRANK AUTO DEALS - WhatsApp Integration JS
 * Complete WhatsApp ordering and communication system
 */

class WhatsAppIntegration {
    constructor() {
        this.phoneNumber = '254742436155';
        this.defaultMessage = 'Hello Frank Auto Deals, I am interested in your cars.';
        this.orderTemplates = {};
        this.cart = [];
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadTemplates();
        this.setupFloatingButton();
        this.setupOrderModal();
        this.setupCartSystem();
        this.setupQuickMessages();
        this.setupAutoResponse();
        this.trackWhatsAppClicks();
    }

    // Setup event listeners
    setupEventListeners() {
        // WhatsApp buttons
        document.querySelectorAll('.whatsapp-btn, .whatsapp-float, .whatsapp-enquiry').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const carName = btn.dataset.carName;
                const carPrice = btn.dataset.carPrice;
                const carImage = btn.dataset.carImage;
                
                if (carName && carPrice) {
                    this.openCarEnquiryModal(carName, carPrice, carImage);
                } else {
                    this.openGeneralEnquiry();
                }
            });
        });

        // WhatsApp modal
        document.querySelector('.close-modal')?.addEventListener('click', () => this.closeModal());
        
        // Form submissions
        document.querySelectorAll('.whatsapp-form').forEach(form => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.processFormSubmission(form);
            });
        });

        // Quick action buttons
        document.querySelectorAll('[data-whatsapp-action]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.currentTarget.dataset.whatsappAction;
                this.handleQuickAction(action);
            });
        });
    }

    // Load message templates
    loadTemplates() {
        this.orderTemplates = {
            car_enquiry: `🚗 *FRANK AUTO DEALS - CAR ENQUIRY*

*Car Details:*
• Car: {{car_name}}
• Price: {{car_price}}
• Reference ID: {{car_id}}

*Customer Information:*
• Name: {{customer_name}}
• Phone: {{customer_phone}}
• Email: {{customer_email}}

*Message:*
{{customer_message}}

*Preferred Contact:* {{contact_method}}
*Best Time:* {{contact_time}}`,

            general_enquiry: `🤝 *FRANK AUTO DEALS - GENERAL ENQUIRY*

*Customer Information:*
• Name: {{customer_name}}
• Phone: {{customer_phone}}
• Email: {{customer_email}}

*Enquiry Type:* {{enquiry_type}}
*Message:*
{{customer_message}}

*Preferred Contact:* {{contact_method}}
*Best Time:* {{contact_time}}`,

            test_drive: `🚘 *FRANK AUTO DEALS - TEST DRIVE REQUEST*

*Car Details:*
• Car: {{car_name}}
• Price: {{car_price}}

*Customer Information:*
• Name: {{customer_name}}
• Phone: {{customer_phone}}
• Email: {{customer_email}}
• ID Number: {{customer_id}}

*Test Drive Details:*
• Preferred Date: {{test_date}}
• Preferred Time: {{test_time}}
• Location: {{test_location}}

*Driving License:* {{has_license}}
*Message:* {{customer_message}}`,

            finance_enquiry: `💰 *FRANK AUTO DEALS - FINANCE ENQUIRY*

*Car Details:*
• Car: {{car_name}}
• Price: {{car_price}}

*Customer Information:*
• Name: {{customer_name}}
• Phone: {{customer_phone}}
• Email: {{customer_email}}

*Financial Details:*
• Employment Status: {{employment}}
• Monthly Income: {{income}}
• Down Payment: {{down_payment}}
• Loan Duration: {{loan_duration}}

*Message:* {{customer_message}}`,

            trade_in: `🔄 *FRANK AUTO DEALS - TRADE-IN REQUEST*

*New Car Details:*
• Car: {{car_name}}
• Price: {{car_price}}

*Current Vehicle:*
• Make: {{current_make}}
• Model: {{current_model}}
• Year: {{current_year}}
• Mileage: {{current_mileage}}
• Condition: {{current_condition}}

*Customer Information:*
• Name: {{customer_name}}
• Phone: {{customer_phone}}
• Email: {{customer_email}}

*Message:* {{customer_message}}`
        };
    }

    // Setup floating WhatsApp button
    setupFloatingButton() {
        // Create floating button if not exists
        if (!document.querySelector('.whatsapp-float')) {
            const floatBtn = document.createElement('a');
            floatBtn.href = '#';
            floatBtn.className = 'whatsapp-float pulse-animation';
            floatBtn.innerHTML = '<i class="fab fa-whatsapp"></i>';
            floatBtn.title = 'Chat on WhatsApp';
            
            floatBtn.style.cssText = `
                position: fixed;
                bottom: 80px;
                right: 20px;
                width: 60px;
                height: 60px;
                background: #25D366;
                color: white;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 30px;
                text-decoration: none;
                box-shadow: 0 4px 20px rgba(37, 211, 102, 0.3);
                z-index: 999;
                transition: all 0.3s ease;
            `;

            floatBtn.addEventListener('mouseenter', () => {
                floatBtn.style.transform = 'scale(1.1)';
                floatBtn.style.boxShadow = '0 6px 25px rgba(37, 211, 102, 0.4)';
            });

            floatBtn.addEventListener('mouseleave', () => {
                floatBtn.style.transform = 'scale(1)';
                floatBtn.style.boxShadow = '0 4px 20px rgba(37, 211, 102, 0.3)';
            });

            floatBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.openGeneralEnquiry();
            });

            document.body.appendChild(floatBtn);

            // Add pulse animation
            this.addPulseAnimation(floatBtn);
        }
    }

    // Add pulse animation
    addPulseAnimation(element) {
        const pulse = document.createElement('div');
        pulse.className = 'whatsapp-pulse';
        pulse.style.cssText = `
            position: absolute;
            width: 100%;
            height: 100%;
            border-radius: 50%;
            background: #25D366;
            animation: whatsappPulse 2s infinite;
            z-index: -1;
        `;

        element.style.position = 'relative';
        element.appendChild(pulse);

        // Add CSS for animation
        if (!document.querySelector('#whatsapp-pulse-style')) {
            const style = document.createElement('style');
            style.id = 'whatsapp-pulse-style';
            style.textContent = `
                @keyframes whatsappPulse {
                    0% {
                        transform: scale(1);
                        opacity: 1;
                    }
                    100% {
                        transform: scale(1.5);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    // Setup order modal
    setupOrderModal() {
        // Create modal if not exists
        if (!document.querySelector('#whatsappModal')) {
            const modal = document.createElement('div');
            modal.id = 'whatsappModal';
            modal.className = 'whatsapp-modal';
            modal.style.display = 'none';

            modal.innerHTML = `
                <div class="modal-backdrop"></div>
                <div class="modal-content">
                    <div class="modal-header">
                        <div class="modal-icon">
                            <i class="fab fa-whatsapp"></i>
                        </div>
                        <h3>CONTACT US VIA WHATSAPP</h3>
                        <button class="close-modal">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="modal-body" id="whatsappModalBody">
                        <!-- Content will be loaded here -->
                    </div>
                </div>
            `;

            document.body.appendChild(modal);

            // Close modal on backdrop click
            modal.querySelector('.modal-backdrop').addEventListener('click', () => this.closeModal());
            modal.querySelector('.close-modal').addEventListener('click', () => this.closeModal());
        }
    }

    // Setup cart system
    setupCartSystem() {
        this.cart = JSON.parse(localStorage.getItem('frank-cart') || '[]');
        this.updateCartCount();
    }

    // Setup quick messages
    setupQuickMessages() {
        this.quickMessages = [
            {
                text: "Hello, I'd like to know more about your car collection",
                icon: "🚗"
            },
            {
                text: "Do you have any SUVs available under KSh 5M?",
                icon: "💰"
            },
            {
                text: "I'm interested in booking a test drive",
                icon: "🚘"
            },
            {
                text: "Can you send me the latest price list?",
                icon: "📋"
            },
            {
                text: "Do you offer financing options?",
                icon: "🏦"
            },
            {
                text: "I'd like to trade in my current vehicle",
                icon: "🔄"
            }
        ];

        this.renderQuickMessages();
    }

    // Render quick messages
    renderQuickMessages() {
        const container = document.querySelector('.quick-messages');
        if (!container) return;

        container.innerHTML = this.quickMessages.map(msg => `
            <button class="quick-message" data-text="${msg.text}">
                <span class="msg-icon">${msg.icon}</span>
                <span class="msg-text">${msg.text}</span>
            </button>
        `).join('');

        // Add event listeners
        document.querySelectorAll('.quick-message').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const text = e.currentTarget.dataset.text;
                this.sendQuickMessage(text);
            });
        });
    }

    // Setup auto-response tracking
    setupAutoResponse() {
        // Check for WhatsApp response parameters
        const urlParams = new URLSearchParams(window.location.search);
        const whatsappStatus = urlParams.get('whatsapp');
        
        if (whatsappStatus === 'sent') {
            this.showSuccessMessage('Message sent successfully! We will respond shortly.');
        } else if (whatsappStatus === 'failed') {
            this.showErrorMessage('Failed to send message. Please try again.');
        }
    }

    // Track WhatsApp clicks
    trackWhatsAppClicks() {
        document.addEventListener('click', (e) => {
            const whatsappBtn = e.target.closest('.whatsapp-btn, .whatsapp-float, [href*="whatsapp"]');
            if (whatsappBtn) {
                this.trackAnalytics('whatsapp_click', {
                    button_type: whatsappBtn.className,
                    page_url: window.location.pathname,
                    timestamp: new Date().toISOString()
                });
            }
        });
    }

    // Open car enquiry modal
    openCarEnquiryModal(carName, carPrice, carImage) {
        const modal = document.getElementById('whatsappModal');
        const modalBody = document.getElementById('whatsappModalBody');

        if (!modal || !modalBody) return;

        modalBody.innerHTML = `
            <div class="enquiry-form">
                <div class="car-preview">
                    <img src="${carImage || 'assets/images/cars/default-car.jpg'}" 
                         alt="${carName}" 
                         class="car-image">
                    <div class="car-info">
                        <h4>${carName}</h4>
                        <div class="car-price">${carPrice}</div>
                    </div>
                </div>

                <form class="whatsapp-form" data-car-name="${carName}" data-car-price="${carPrice}">
                    <div class="form-group">
                        <label for="customerName">
                            <i class="fas fa-user"></i>
                            Full Name *
                        </label>
                        <input type="text" id="customerName" name="name" required 
                               placeholder="Enter your full name">
                    </div>

                    <div class="form-group">
                        <label for="customerPhone">
                            <i class="fas fa-phone"></i>
                            WhatsApp Number *
                        </label>
                        <input type="tel" id="customerPhone" name="phone" required 
                               placeholder="e.g., 07XX XXX XXX">
                    </div>

                    <div class="form-group">
                        <label for="customerEmail">
                            <i class="fas fa-envelope"></i>
                            Email Address
                        </label>
                        <input type="email" id="customerEmail" name="email" 
                               placeholder="Enter your email (optional)">
                    </div>

                    <div class="form-group">
                        <label for="enquiryType">
                            <i class="fas fa-question-circle"></i>
                            Enquiry Type
                        </label>
                        <select id="enquiryType" name="enquiry_type">
                            <option value="price">Price Inquiry</option>
                            <option value="availability">Availability Check</option>
                            <option value="test_drive">Test Drive Request</option>
                            <option value="finance">Financing Options</option>
                            <option value="trade_in">Trade-In Inquiry</option>
                            <option value="other">Other</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="customerMessage">
                            <i class="fas fa-comment"></i>
                            Your Message *
                        </label>
                        <textarea id="customerMessage" name="message" required rows="4"
                                  placeholder="Tell us more about your inquiry...">Hello, I'm interested in the ${carName}. Please provide more details.</textarea>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label for="contactMethod">
                                <i class="fas fa-comments"></i>
                                Preferred Contact
                            </label>
                            <select id="contactMethod" name="contact_method">
                                <option value="whatsapp">WhatsApp</option>
                                <option value="call">Phone Call</option>
                                <option value="email">Email</option>
                            </select>
                        </div>

                        <div class="form-group">
                            <label for="contactTime">
                                <i class="fas fa-clock"></i>
                                Best Time to Contact
                            </label>
                            <select id="contactTime" name="contact_time">
                                <option value="anytime">Anytime</option>
                                <option value="morning">Morning (8AM - 12PM)</option>
                                <option value="afternoon">Afternoon (12PM - 5PM)</option>
                                <option value="evening">Evening (5PM - 8PM)</option>
                            </select>
                        </div>
                    </div>

                    <div class="form-actions">
                        <button type="submit" class="btn-whatsapp">
                            <i class="fab fa-whatsapp"></i>
                            SEND VIA WHATSAPP
                        </button>
                        <button type="button" class="btn-call" onclick="window.location.href='tel:${this.phoneNumber}'">
                            <i class="fas fa-phone"></i>
                            CALL INSTEAD
                        </button>
                    </div>

                    <div class="form-note">
                        <i class="fas fa-info-circle"></i>
                        We typically respond within 5-10 minutes during business hours.
                    </div>
                </form>

                <div class="quick-actions">
                    <h4>Quick Actions:</h4>
                    <div class="quick-buttons">
                        <button class="btn-quick" data-action="test_drive">
                            <i class="fas fa-car"></i>
                            Request Test Drive
                        </button>
                        <button class="btn-quick" data-action="finance">
                            <i class="fas fa-hand-holding-usd"></i>
                            Ask About Financing
                        </button>
                        <button class="btn-quick" data-action="trade_in">
                            <i class="fas fa-exchange-alt"></i>
                            Trade-In Inquiry
                        </button>
                    </div>
                </div>
            </div>
        `;

        // Add event listeners to quick buttons
        modalBody.querySelectorAll('.btn-quick').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.currentTarget.dataset.action;
                this.handleQuickAction(action, carName, carPrice);
            });
        });

        // Show modal
        modal.style.display = 'flex';
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);

        // Focus on first input
        setTimeout(() => {
            modalBody.querySelector('input')?.focus();
        }, 100);
    }

    // Open general enquiry
    openGeneralEnquiry() {
        const modal = document.getElementById('whatsappModal');
        const modalBody = document.getElementById('whatsappModalBody');

        if (!modal || !modalBody) return;

        modalBody.innerHTML = `
            <div class="enquiry-form">
                <div class="form-header">
                    <h4>Get in Touch with Frank Auto Deals</h4>
                    <p>Fill out the form below and we'll contact you via WhatsApp</p>
                </div>

                <form class="whatsapp-form">
                    <div class="form-row">
                        <div class="form-group">
                            <label for="genCustomerName">
                                <i class="fas fa-user"></i>
                                Full Name *
                            </label>
                            <input type="text" id="genCustomerName" name="name" required 
                                   placeholder="Enter your full name">
                        </div>

                        <div class="form-group">
                            <label for="genCustomerPhone">
                                <i class="fas fa-phone"></i>
                                WhatsApp Number *
                            </label>
                            <input type="tel" id="genCustomerPhone" name="phone" required 
                                   placeholder="e.g., 07XX XXX XXX">
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="genCustomerEmail">
                            <i class="fas fa-envelope"></i>
                            Email Address
                        </label>
                        <input type="email" id="genCustomerEmail" name="email" 
                               placeholder="Enter your email (optional)">
                    </div>

                    <div class="form-group">
                        <label for="genEnquiryType">
                            <i class="fas fa-question-circle"></i>
                            What are you interested in?
                        </label>
                        <select id="genEnquiryType" name="enquiry_type">
                            <option value="">Select an option</option>
                            <option value="new_cars">New Cars</option>
                            <option value="used_cars">Used Cars</option>
                            <option value="luxury_cars">Luxury Cars</option>
                            <option value="suv">SUVs & 4x4s</option>
                            <option value="sports">Sports Cars</option>
                            <option value="test_drive">Test Drive</option>
                            <option value="finance">Financing</option>
                            <option value="trade_in">Trade-In</option>
                            <option value="service">Service & Maintenance</option>
                            <option value="other">Other</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="genCustomerMessage">
                            <i class="fas fa-comment"></i>
                            Your Message *
                        </label>
                        <textarea id="genCustomerMessage" name="message" required rows="4"
                                  placeholder="How can we help you today?"></textarea>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label for="genContactMethod">
                                <i class="fas fa-comments"></i>
                                Preferred Contact
                            </label>
                            <select id="genContactMethod" name="contact_method">
                                <option value="whatsapp">WhatsApp</option>
                                <option value="call">Phone Call</option>
                                <option value="email">Email</option>
                            </select>
                        </div>

                        <div class="form-group">
                            <label for="genContactTime">
                                <i class="fas fa-clock"></i>
                                Best Time to Contact
                            </label>
                            <select id="genContactTime" name="contact_time">
                                <option value="anytime">Anytime</option>
                                <option value="morning">Morning (8AM - 12PM)</option>
                                <option value="afternoon">Afternoon (12PM - 5PM)</option>
                                <option value="evening">Evening (5PM - 8PM)</option>
                            </select>
                        </div>
                    </div>

                    <div class="quick-messages">
                        <h5>Quick Messages:</h5>
                        <div class="quick-message-grid">
                            ${this.quickMessages.map(msg => `
                                <button type="button" class="quick-message-btn" data-text="${msg.text}">
                                    ${msg.icon} ${msg.text}
                                </button>
                            `).join('')}
                        </div>
                    </div>

                    <div class="form-actions">
                        <button type="submit" class="btn-whatsapp">
                            <i class="fab fa-whatsapp"></i>
                            SEND VIA WHATSAPP
                        </button>
                        <button type="button" class="btn-call" onclick="window.location.href='tel:${this.phoneNumber}'">
                            <i class="fas fa-phone"></i>
                            CALL INSTEAD
                        </button>
                    </div>

                    <div class="contact-info">
                        <div class="info-item">
                            <i class="fab fa-whatsapp"></i>
                            <span>+${this.phoneNumber}</span>
                        </div>
                        <div class="info-item">
                            <i class="fas fa-clock"></i>
                            <span>Mon-Sun: 8:00 AM - 8:00 PM</span>
                        </div>
                        <div class="info-item">
                            <i class="fas fa-map-marker-alt"></i>
                            <span>Nairobi, Kenya</span>
                        </div>
                    </div>
                </form>
            </div>
        `;

        // Add event listeners to quick message buttons
        modalBody.querySelectorAll('.quick-message-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const text = e.currentTarget.dataset.text;
                const textarea = modalBody.querySelector('#genCustomerMessage');
                if (textarea) {
                    textarea.value = text;
                    textarea.focus();
                }
            });
        });

        // Show modal
        modal.style.display = 'flex';
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);
    }

    // Process form submission
    processFormSubmission(form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        // Add car data if available
        const carName = form.dataset.carName;
        const carPrice = form.dataset.carPrice;
        
        if (carName) {
            data.car_name = carName;
            data.car_price = carPrice;
            data.car_id = this.generateCarId(carName);
        }

        // Validate data
        if (!this.validateFormData(data)) {
            this.showFormError('Please fill in all required fields correctly.');
            return;
        }

        // Generate WhatsApp message
        const templateType = carName ? 'car_enquiry' : 'general_enquiry';
        const message = this.generateWhatsAppMessage(templateType, data);

        // Send via WhatsApp
        this.sendWhatsAppMessage(message, data.phone);

        // Close modal
        this.closeModal();

        // Show success message
        this.showSuccessMessage('Opening WhatsApp... Please complete your message and send it.');

        // Track submission
        this.trackAnalytics('whatsapp_enquiry_submitted', {
            enquiry_type: data.enquiry_type,
            has_car: !!carName,
            timestamp: new Date().toISOString()
        });
    }

    // Generate WhatsApp message from template
    generateWhatsAppMessage(templateType, data) {
        let message = this.orderTemplates[templateType] || this.orderTemplates.general_enquiry;
        
        // Replace placeholders
        for (const [key, value] of Object.entries(data)) {
            const placeholder = `{{${key}}}`;
            message = message.replace(new RegExp(placeholder, 'g'), value || 'Not provided');
        }

        // Remove any remaining placeholders
        message = message.replace(/\{\{.*?\}\}/g, 'Not provided');

        // URL encode the message
        return encodeURIComponent(message);
    }

    // Send WhatsApp message
    sendWhatsAppMessage(message, phoneNumber) {
        const url = `https://wa.me/${this.phoneNumber}?text=${message}`;
        
        // Open in new tab
        window.open(url, '_blank', 'noopener,noreferrer');
        
        // Fallback for mobile devices
        setTimeout(() => {
            window.location.href = url;
        }, 100);
    }

    // Send quick message
    sendQuickMessage(text) {
        const encodedText = encodeURIComponent(text);
        const url = `https://wa.me/${this.phoneNumber}?text=${encodedText}`;
        window.open(url, '_blank');
    }

    // Handle quick action
    handleQuickAction(action, carName = '', carPrice = '') {
        let message = '';
        
        switch(action) {
            case 'test_drive':
                message = `🚘 Test Drive Request\n\nI'd like to schedule a test drive for: ${carName || 'a vehicle'}.\n\nPlease let me know available dates and requirements.`;
                break;
            case 'finance':
                message = `💰 Financing Inquiry\n\nI'm interested in financing options for: ${carName || 'a vehicle'}.\n\nPlease send me details about:\n• Interest rates\n• Down payment\n• Loan duration\n• Requirements`;
                break;
            case 'trade_in':
                message = `🔄 Trade-In Inquiry\n\nI'd like to trade in my current vehicle for: ${carName || 'a new vehicle'}.\n\nPlease advise on:\n• Trade-in valuation process\n• Requirements\n• Timeline`;
                break;
            case 'price_list':
                message = `📋 Price List Request\n\nPlease send me your latest price list for all available vehicles.\n\nI'm particularly interested in:\n• SUVs\n• Luxury sedans\n• Sports cars`;
                break;
            case 'availability':
                message = `📅 Availability Check\n\nI'd like to check availability for: ${carName || 'vehicles in stock'}.\n\nPlease let me know:\n• Current stock\n• Delivery timelines\n• Any waiting periods`;
                break;
        }

        if (message) {
            const encodedMessage = encodeURIComponent(message);
            window.open(`https://wa.me/${this.phoneNumber}?text=${encodedMessage}`, '_blank');
        }
    }

    // Validate form data
    validateFormData(data) {
        // Check required fields
        if (!data.name || !data.phone || !data.message) {
            return false;
        }

        // Validate phone number (Kenyan format)
        const phoneRegex = /^(07\d{8}|01\d{8}|\+2547\d{8}|\+2541\d{8})$/;
        if (!phoneRegex.test(data.phone.replace(/\s/g, ''))) {
            return false;
        }

        // Validate email if provided
        if (data.email && !this.validateEmail(data.email)) {
            return false;
        }

        return true;
    }

    // Validate email
    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Generate car ID
    generateCarId(carName) {
        return 'CAR-' + carName.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().substring(0, 6) + 
               '-' + Math.random().toString(36).substr(2, 4).toUpperCase();
    }

    // Update cart count
    updateCartCount() {
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
            cartCount.textContent = this.cart.length;
            cartCount.style.display = this.cart.length > 0 ? 'flex' : 'none';
        }
    }

    // Add to cart
    addToCart(car) {
        this.cart.push({
            ...car,
            id: this.generateCarId(car.name),
            addedAt: new Date().toISOString()
        });
        
        localStorage.setItem('frank-cart', JSON.stringify(this.cart));
        this.updateCartCount();
        
        this.showSuccessMessage(`${car.name} added to your interest list!`);
    }

    // Remove from cart
    removeFromCart(carId) {
        this.cart = this.cart.filter(item => item.id !== carId);
        localStorage.setItem('frank-cart', JSON.stringify(this.cart));
        this.updateCartCount();
    }

    // Send cart via WhatsApp
    sendCartViaWhatsApp() {
        if (this.cart.length === 0) {
            this.showErrorMessage('Your interest list is empty!');
            return;
        }

        let message = `🛒 *FRANK AUTO DEALS - INTEREST LIST*\n\n`;
        message += `I'm interested in the following vehicles:\n\n`;

        this.cart.forEach((item, index) => {
            message += `${index + 1}. *${item.name}*\n`;
            message += `   Price: ${item.price}\n`;
            message += `   Reference: ${item.id}\n\n`;
        });

        message += `*Customer Details:*\n`;
        message += `Please contact me to discuss these vehicles further.`;

        const encodedMessage = encodeURIComponent(message);
        window.open(`https://wa.me/${this.phoneNumber}?text=${encodedMessage}`, '_blank');
    }

    // Close modal
    closeModal() {
        const modal = document.getElementById('whatsappModal');
        if (modal) {
            modal.classList.remove('show');
            setTimeout(() => {
                modal.style.display = 'none';
            }, 300);
        }
    }

    // Show success message
    showSuccessMessage(text) {
        this.showMessage(text, 'success');
    }

    // Show error message
    showErrorMessage(text) {
        this.showMessage(text, 'error');
    }

    // Show form error
    showFormError(text) {
        this.showMessage(text, 'error');
    }

    // Show message
    showMessage(text, type = 'info') {
        const message = document.createElement('div');
        message.className = `whatsapp-message ${type}`;
        message.textContent = text;
        message.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 25px;
            background: ${type === 'error' ? '#FF003C' : '#25D366'};
            color: white;
            border-radius: 10px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.2);
            z-index: 10000;
            animation: slideInRight 0.3s ease;
        `;

        document.body.appendChild(message);

        setTimeout(() => {
            message.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => message.remove(), 300);
        }, 3000);
    }

    // Track analytics
    trackAnalytics(eventName, data) {
        const analyticsData = {
            event: eventName,
            timestamp: new Date().toISOString(),
            ...data
        };

        // Log to console (in production, send to analytics service)
        console.log('WhatsApp Analytics:', analyticsData);

        // Save to localStorage for tracking
        const events = JSON.parse(localStorage.getItem('whatsapp_events') || '[]');
        events.push(analyticsData);
        localStorage.setItem('whatsapp_events', JSON.stringify(events.slice(-100)));
    }
}

// Initialize WhatsApp Integration
document.addEventListener('DOMContentLoaded', () => {
    const whatsappIntegration = new WhatsAppIntegration();
    window.WhatsAppIntegration = whatsappIntegration;
    
    // Global functions for HTML onclick handlers
    window.orderViaWhatsApp = function(carName, price) {
        whatsappIntegration.openCarEnquiryModal(carName, price);
    };
    
    window.openWhatsAppModal = function(carName, price, image) {
        whatsappIntegration.openCarEnquiryModal(carName, price, image);
    };
    
    window.closeWhatsAppModal = function() {
        whatsappIntegration.closeModal();
    };
});