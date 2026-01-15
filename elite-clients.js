/**
 * ELITE CLIENTS - JavaScript
 * VIP client portal functionality
 */

class EliteClients {
    constructor() {
        this.clientData = {};
        this.clientCars = [];
        this.serviceHistory = [];
        this.events = [];
        this.init();
    }

    init() {
        this.loadClientData();
        this.loadClientCars();
        this.loadServiceHistory();
        this.loadEvents();
        this.setupEventListeners();
        this.setupFormHandlers();
        this.setupTabs();
        this.renderCars();
        this.renderEvents();
        this.updateClientStats();
    }

    // Load client data from localStorage
    loadClientData() {
        this.clientData = JSON.parse(localStorage.getItem('eliteClientData')) || {
            id: 'VIP-' + Date.now(),
            name: 'Elite Client',
            tier: 'DIAMOND',
            joinDate: '2022-01-15',
            totalCars: 3,
            totalServices: 12,
            points: 12500,
            nextService: '2024-01-20',
            personalConcierge: 'Michael K.',
            conciergePhone: '+254 742 436 155',
            conciergeEmail: 'concierge@frankautodeals.co.ke'
        };
    }

    // Load client cars
    loadClientCars() {
        this.clientCars = JSON.parse(localStorage.getItem('clientCars')) || [
            {
                id: 'CAR-001',
                brand: 'BMW',
                model: 'X5 M Competition',
                year: 2023,
                color: 'Black Sapphire',
                plate: 'KDA 567X',
                purchaseDate: '2023-03-15',
                serviceDue: '2024-01-20',
                image: 'bmw',
                status: 'active'
            },
            {
                id: 'CAR-002',
                brand: 'Mercedes-Benz',
                model: 'S-Class',
                year: 2022,
                color: 'Obsidian Black',
                plate: 'KBC 789Y',
                purchaseDate: '2022-08-10',
                serviceDue: '2024-02-15',
                image: 'mercedes',
                status: 'active'
            },
            {
                id: 'CAR-003',
                brand: 'Toyota',
                model: 'Land Cruiser V8',
                year: 2021,
                color: 'White Pearl',
                plate: 'KCA 123A',
                purchaseDate: '2021-11-05',
                serviceDue: '2024-03-01',
                image: 'toyota',
                status: 'active'
            }
        ];
    }

    // Load service history
    loadServiceHistory() {
        this.serviceHistory = JSON.parse(localStorage.getItem('serviceHistory')) || [
            {
                id: 'SERV-001',
                carId: 'CAR-001',
                serviceType: 'Premium Maintenance',
                date: '2023-12-15',
                cost: 'KSh 85,000',
                status: 'completed',
                notes: 'Full service with oil change, filter replacement'
            },
            {
                id: 'SERV-002',
                carId: 'CAR-002',
                serviceType: 'Executive Detailing',
                date: '2023-11-20',
                cost: 'KSh 45,000',
                status: 'completed',
                notes: 'Ceramic coating application'
            }
        ];
    }

    // Load events
    loadEvents() {
        this.events = JSON.parse(localStorage.getItem('vipEvents')) || [
            {
                id: 'EVENT-001',
                title: 'Luxury Car Launch',
                date: '2023-12-15',
                time: '6:00 PM',
                location: 'Nairobi Showroom',
                description: 'Exclusive preview of latest luxury models',
                rsvpStatus: 'confirmed',
                attendees: 25
            },
            {
                id: 'EVENT-002',
                title: 'VIP Test Drive Day',
                date: '2023-12-22',
                time: '9:00 AM - 5:00 PM',
                location: 'Private Track',
                description: 'Private test drive event',
                rsvpStatus: 'pending',
                attendees: 15
            }
        ];
    }

    // Setup event listeners
    setupEventListeners() {
        // Navigation links
        document.querySelectorAll('.vip-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleNavigation(link.getAttribute('href').substring(1));
            });
        });

        // Service tabs
        document.querySelectorAll('.service-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const service = e.target.dataset.service;
                this.showServiceInfo(service);
            });
        });

        // Close modals on backdrop click
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal(modal.id);
                }
            });
        });

        // Escape key to close modals
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                document.querySelectorAll('.modal').forEach(modal => {
                    if (modal.style.display === 'flex') {
                        this.closeModal(modal.id);
                    }
                });
            }
        });
    }

    // Setup form handlers
    setupFormHandlers() {
        // Add car form
        const addCarForm = document.getElementById('addCarForm');
        if (addCarForm) {
            addCarForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.addNewCar();
            });
        }

        // Contact form
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.submitContactRequest();
            });
        }
    }

    // Setup tabs
    setupTabs() {
        this.showServiceInfo('maintenance');
    }

    // Handle navigation
    handleNavigation(sectionId) {
        // Update active link
        document.querySelectorAll('.vip-link').forEach(link => {
            link.classList.remove('active');
        });
        event.target.classList.add('active');

        // Scroll to section
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
    }

    // Show service info
    showServiceInfo(service) {
        // Update active tab
        document.querySelectorAll('.service-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        event.target.classList.add('active');

        // Show corresponding content
        document.querySelectorAll('.service-info').forEach(info => {
            info.classList.remove('active');
        });
        document.getElementById(service).classList.add('active');
    }

    // Render cars
    renderCars() {
        const carsGrid = document.getElementById('carsGrid');
        if (!carsGrid) return;

        if (this.clientCars.length === 0) {
            carsGrid.innerHTML = `
                <div class="no-cars">
                    <i class="fas fa-car"></i>
                    <h3>No cars in your garage yet</h3>
                    <p>Add your first vehicle to get started</p>
                    <button class="btn-primary" onclick="eliteClients.showAddCarModal()">
                        ADD YOUR FIRST CAR
                    </button>
                </div>
            `;
            return;
        }

        carsGrid.innerHTML = this.clientCars.map(car => `
            <div class="car-card">
                <div class="car-image" style="background: linear-gradient(135deg, ${this.getCarColor(car.brand)});">
                    <i class="fas fa-car"></i>
                </div>
                <div class="car-info">
                    <div class="car-brand">${car.brand}</div>
                    <div class="car-model">${car.model}</div>
                    <div class="car-details">
                        <div class="car-detail">
                            <i class="fas fa-calendar"></i>
                            ${car.year}
                        </div>
                        <div class="car-detail">
                            <i class="fas fa-palette"></i>
                            ${car.color}
                        </div>
                        <div class="car-detail">
                            <i class="fas fa-tag"></i>
                            ${car.plate}
                        </div>
                        <div class="car-detail">
                            <i class="fas fa-wrench"></i>
                            Service: ${this.formatDate(car.serviceDue)}
                        </div>
                    </div>
                    <div class="car-actions">
                        <button class="car-btn" onclick="eliteClients.viewCar('${car.id}')">
                            <i class="fas fa-eye"></i>
                            View
                        </button>
                        <button class="car-btn" onclick="eliteClients.serviceCar('${car.id}')">
                            <i class="fas fa-wrench"></i>
                            Service
                        </button>
                        <button class="car-btn" onclick="eliteClients.removeCar('${car.id}')">
                            <i class="fas fa-trash"></i>
                            Remove
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Get car color gradient
    getCarColor(brand) {
        const colors = {
            'BMW': '#0066B3, #1C69D4',
            'Mercedes-Benz': '#00A0E3, #000000',
            'Toyota': '#EB0A1E, #FFFFFF',
            'Porsche': '#CCCCCC, #000000',
            'Range Rover': '#005A8B, #C9B074',
            'Ford': '#003478, #FFFFFF',
            'Audi': '#BB0A30, #FFFFFF'
        };
        return colors[brand] || '#0066B3, #00F3FF';
    }

    // Render events
    renderEvents() {
        // Events are already static in HTML, but we could add dynamic updates here
        console.log('Events loaded:', this.events.length);
    }

    // Update client stats
    updateClientStats() {
        // Update stats in welcome section
        document.getElementById('clientYears')?.textContent = this.calculateYearsWithUs();
        document.getElementById('carsOwned')?.textContent = this.clientCars.length;
        document.getElementById('servicesUsed')?.textContent = this.serviceHistory.length;
    }

    // Calculate years with us
    calculateYearsWithUs() {
        const joinDate = new Date(this.clientData.joinDate);
        const now = new Date();
        const years = now.getFullYear() - joinDate.getFullYear();
        return years > 0 ? years : 1;
    }

    // Format date
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric',
            year: 'numeric'
        });
    }

    // Show add car modal
    showAddCarModal() {
        document.getElementById('addCarModal').style.display = 'flex';
    }

    // Add new car
    addNewCar() {
        const brand = document.getElementById('carBrand').value;
        const model = document.getElementById('carModel').value;
        const year = document.getElementById('carYear').value;
        const color = document.getElementById('carColor').value;
        const plate = document.getElementById('carPlate').value;

        if (!brand || !model || !year || !color || !plate) {
            this.showMessage('Please fill in all fields', 'error');
            return;
        }

        const newCar = {
            id: 'CAR-' + Date.now().toString().slice(-6),
            brand: brand.charAt(0).toUpperCase() + brand.slice(1),
            model: model,
            year: parseInt(year),
            color: color,
            plate: plate.toUpperCase(),
            purchaseDate: new Date().toISOString().split('T')[0],
            serviceDue: this.calculateNextServiceDate(),
            image: brand.toLowerCase(),
            status: 'active'
        };

        this.clientCars.push(newCar);
        this.saveClientCars();
        this.renderCars();
        this.updateClientStats();
        
        this.closeModal('addCarModal');
        this.showMessage(`${newCar.brand} ${newCar.model} added to your garage!`, 'success');
        
        // Reset form
        document.getElementById('addCarForm').reset();
    }

    // Calculate next service date (6 months from now)
    calculateNextServiceDate() {
        const now = new Date();
        now.setMonth(now.getMonth() + 6);
        return now.toISOString().split('T')[0];
    }

    // View car details
    viewCar(carId) {
        const car = this.clientCars.find(c => c.id === carId);
        if (!car) return;

        const modalContent = `
            <div class="car-detail-modal">
                <div class="car-header" style="background: linear-gradient(135deg, ${this.getCarColor(car.brand)});">
                    <i class="fas fa-car"></i>
                    <h3>${car.brand} ${car.model}</h3>
                </div>
                <div class="car-details-list">
                    <div class="detail-item">
                        <span class="detail-label">Year:</span>
                        <span class="detail-value">${car.year}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Color:</span>
                        <span class="detail-value">${car.color}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">License Plate:</span>
                        <span class="detail-value">${car.plate}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Purchase Date:</span>
                        <span class="detail-value">${this.formatDate(car.purchaseDate)}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Next Service:</span>
                        <span class="detail-value">${this.formatDate(car.serviceDue)}</span>
                    </div>
                </div>
                <div class="car-actions-modal">
                    <button class="btn-service" onclick="eliteClients.serviceCar('${car.id}')">
                        <i class="fas fa-wrench"></i>
                        Schedule Service
                    </button>
                    <button class="btn-secondary" onclick="eliteClients.closeModal('carDetailModal')">
                        Close
                    </button>
                </div>
            </div>
        `;

        this.showCustomModal('Car Details', modalContent, 'carDetailModal');
    }

    // Service car
    serviceCar(carId) {
        const car = this.clientCars.find(c => c.id === carId);
        if (!car) return;

        const modalContent = `
            <div class="service-modal">
                <h3>Schedule Service for ${car.brand} ${car.model}</h3>
                <p>Plate: ${car.plate}</p>
                
                <div class="service-options">
                    <div class="service-option">
                        <input type="radio" id="service-premium" name="serviceType" value="premium" checked>
                        <label for="service-premium">
                            <i class="fas fa-star"></i>
                            <span>Premium Maintenance</span>
                            <small>Full service with genuine parts</small>
                        </label>
                    </div>
                    <div class="service-option">
                        <input type="radio" id="service-detailing" name="serviceType" value="detailing">
                        <label for="service-detailing">
                            <i class="fas fa-spray-can"></i>
                            <span>Executive Detailing</span>
                            <small>Professional cleaning & protection</small>
                        </label>
                    </div>
                    <div class="service-option">
                        <input type="radio" id="service-repair" name="serviceType" value="repair">
                        <label for="service-repair">
                            <i class="fas fa-tools"></i>
                            <span>Repair Service</span>
                            <small>Diagnostic & repair work</small>
                        </label>
                    </div>
                </div>
                
                <div class="form-group">
                    <label for="serviceDate">Preferred Date:</label>
                    <input type="date" id="serviceDate" min="${new Date().toISOString().split('T')[0]}" required>
                </div>
                
                <div class="form-group">
                    <label for="serviceNotes">Special Instructions:</label>
                    <textarea id="serviceNotes" rows="3" placeholder="Any specific requirements..."></textarea>
                </div>
                
                <div class="form-actions">
                    <button class="btn-primary" onclick="eliteClients.confirmService('${car.id}')">
                        <i class="fas fa-calendar-check"></i>
                        Schedule Service
                    </button>
                    <button class="btn-secondary" onclick="eliteClients.closeModal('serviceModal')">
                        Cancel
                    </button>
                </div>
            </div>
        `;

        this.showCustomModal('Schedule Service', modalContent, 'serviceModal');
    }

    // Confirm service booking
    confirmService(carId) {
        const car = this.clientCars.find(c => c.id === carId);
        if (!car) return;

        const serviceType = document.querySelector('input[name="serviceType"]:checked').value;
        const serviceDate = document.getElementById('serviceDate').value;
        const serviceNotes = document.getElementById('serviceNotes').value;

        if (!serviceDate) {
            this.showMessage('Please select a service date', 'error');
            return;
        }

        const serviceTypes = {
            'premium': 'Premium Maintenance',
            'detailing': 'Executive Detailing',
            'repair': 'Repair Service'
        };

        const newService = {
            id: 'SERV-' + Date.now().toString().slice(-6),
            carId: carId,
            serviceType: serviceTypes[serviceType],
            date: serviceDate,
            cost: 'Pending',
            status: 'scheduled',
            notes: serviceNotes || 'No special instructions'
        };

        this.serviceHistory.push(newService);
        this.saveServiceHistory();

        // Update car's next service date
        const carIndex = this.clientCars.findIndex(c => c.id === carId);
        if (carIndex > -1) {
            const nextService = new Date(serviceDate);
            nextService.setMonth(nextService.getMonth() + 6);
            this.clientCars[carIndex].serviceDue = nextService.toISOString().split('T')[0];
            this.saveClientCars();
        }

        this.closeModal('serviceModal');
        this.showMessage(`Service scheduled for ${car.brand} ${car.model} on ${this.formatDate(serviceDate)}`, 'success');
        
        // Send WhatsApp notification
        this.sendServiceConfirmation(car, newService);
    }

    // Remove car
    removeCar(carId) {
        if (!confirm('Are you sure you want to remove this car from your garage?')) {
            return;
        }

        const carIndex = this.clientCars.findIndex(c => c.id === carId);
        if (carIndex > -1) {
            const removedCar = this.clientCars[carIndex];
            this.clientCars.splice(carIndex, 1);
            this.saveClientCars();
            this.renderCars();
            this.updateClientStats();
            this.showMessage(`${removedCar.brand} ${removedCar.model} removed from garage`, 'info');
        }
    }

    // Submit contact request
    submitContactRequest() {
        const subject = document.getElementById('contactSubject').value;
        const message = document.getElementById('contactMessage').value;
        const phone = document.getElementById('contactPhone').value;

        if (!subject || !message || !phone) {
            this.showMessage('Please fill in all fields', 'error');
            return;
        }

        const subjects = {
            'service': 'Service Request',
            'booking': 'Event Booking',
            'purchase': 'Vehicle Purchase',
            'support': 'Technical Support',
            'other': 'Other Inquiry'
        };

        const request = {
            id: 'REQ-' + Date.now().toString().slice(-6),
            subject: subjects[subject] || subject,
            message: message,
            phone: phone,
            timestamp: new Date().toISOString(),
            status: 'submitted'
        };

        // Save to localStorage
        const requests = JSON.parse(localStorage.getItem('contactRequests') || '[]');
        requests.push(request);
        localStorage.setItem('contactRequests', JSON.stringify(requests));

        this.closeModal('contactModal');
        this.showMessage('Your request has been submitted. Our concierge will contact you shortly.', 'success');

        // Reset form
        document.getElementById('contactForm').reset();

        // Send WhatsApp notification to concierge
        this.sendContactNotification(request);
    }

    // Show custom modal
    showCustomModal(title, content, modalId = 'customModal') {
        // Create modal if it doesn't exist
        let modal = document.getElementById(modalId);
        if (!modal) {
            modal = document.createElement('div');
            modal.id = modalId;
            modal.className = 'modal';
            modal.innerHTML = `
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>${title}</h3>
                        <button class="close-modal" onclick="eliteClients.closeModal('${modalId}')">&times;</button>
                    </div>
                    <div class="modal-body">
                        ${content}
                    </div>
                </div>
            `;
            document.body.appendChild(modal);
        } else {
            modal.querySelector('.modal-header h3').textContent = title;
            modal.querySelector('.modal-body').innerHTML = content;
        }

        modal.style.display = 'flex';
    }

    // Close modal
    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
        }
    }

    // Save client cars
    saveClientCars() {
        localStorage.setItem('clientCars', JSON.stringify(this.clientCars));
    }

    // Save service history
    saveServiceHistory() {
        localStorage.setItem('serviceHistory', JSON.stringify(this.serviceHistory));
    }

    // Show message
    showMessage(text, type = 'info') {
        const message = document.createElement('div');
        message.className = `elite-message ${type}`;
        message.textContent = text;
        message.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 25px;
            background: ${type === 'success' ? '#00FF9D' : 
                        type === 'error' ? '#FF003C' : 
                        type === 'warning' ? '#FFD700' : '#00F3FF'};
            color: #000;
            border-radius: 10px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.2);
            z-index: 1000;
            animation: slideIn 0.3s ease;
        `;

        document.body.appendChild(message);

        setTimeout(() => {
            message.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => message.remove(), 300);
        }, 3000);
    }

    // Send service confirmation via WhatsApp
    sendServiceConfirmation(car, service) {
        const message = encodeURIComponent(
            `🔧 *SERVICE CONFIRMATION - Frank Auto Deals*\n\n` +
            `*Vehicle:* ${car.brand} ${car.model}\n` +
            `*Plate:* ${car.plate}\n` +
            `*Service Type:* ${service.serviceType}\n` +
            `*Scheduled Date:* ${this.formatDate(service.date)}\n` +
            `*Reference:* ${service.id}\n\n` +
            `Your service has been scheduled successfully. Our team will contact you to confirm details.`
        );
        
        window.open(`https://wa.me/254742436155?text=${message}`, '_blank');
    }

    // Send contact notification via WhatsApp
    sendContactNotification(request) {
        const message = encodeURIComponent(
            `📞 *VIP CONTACT REQUEST - Frank Auto Deals*\n\n` +
            `*Subject:* ${request.subject}\n` +
            `*Client Phone:* ${request.phone}\n` +
            `*Message:* ${request.message}\n` +
            `*Reference:* ${request.id}\n\n` +
            `Please contact the VIP client regarding their request.`
        );
        
        window.open(`https://wa.me/254742436155?text=${message}`, '_blank');
    }

    // Book service (called from HTML onclick)
    bookService(serviceType) {
        if (this.clientCars.length === 0) {
            this.showMessage('Please add a car to your garage first', 'warning');
            this.showAddCarModal();
            return;
        }

        const modalContent = `
            <div class="book-service-modal">
                <h3>Book ${serviceType === 'maintenance' ? 'Maintenance' : 'Detailing'} Service</h3>
                
                <div class="form-group">
                    <label for="selectCar">Select Vehicle:</label>
                    <select id="selectCar">
                        ${this.clientCars.map(car => `
                            <option value="${car.id}">${car.brand} ${car.model} (${car.plate})</option>
                        `).join('')}
                    </select>
                </div>
                
                <div class="form-group">
                    <label for="preferredDate">Preferred Date:</label>
                    <input type="date" id="preferredDate" min="${new Date().toISOString().split('T')[0]}" required>
                </div>
                
                <div class="form-actions">
                    <button class="btn-primary" onclick="eliteClients.submitBooking('${serviceType}')">
                        <i class="fas fa-check-circle"></i>
                        Confirm Booking
                    </button>
                    <button class="btn-secondary" onclick="eliteClients.closeModal('bookServiceModal')">
                        Cancel
                    </button>
                </div>
            </div>
        `;

        this.showCustomModal('Book Service', modalContent, 'bookServiceModal');
    }

    // Submit booking
    submitBooking(serviceType) {
        const carId = document.getElementById('selectCar').value;
        const date = document.getElementById('preferredDate').value;

        if (!date) {
            this.showMessage('Please select a date', 'error');
            return;
        }

        const car = this.clientCars.find(c => c.id === carId);
        if (!car) return;

        const serviceTypes = {
            'maintenance': 'Premium Maintenance',
            'detailing': 'Executive Detailing'
        };

        const booking = {
            id: 'BOOK-' + Date.now().toString().slice(-6),
            carId: carId,
            serviceType: serviceTypes[serviceType],
            date: date,
            status: 'pending'
        };

        this.closeModal('bookServiceModal');
        this.showMessage(`${serviceTypes[serviceType]} booked for ${this.formatDate(date)}`, 'success');
        
        // Here you would typically send to backend
        console.log('Booking submitted:', booking);
    }

    // RSVP to event (called from HTML onclick)
    rsvpEvent(eventId) {
        const event = this.events.find(e => e.id === eventId);
        if (!event) {
            // For static events in HTML
            event = {
                title: eventId === 'luxury-launch' ? 'Luxury Car Launch' : 
                       eventId === 'test-drive-day' ? 'VIP Test Drive Day' : 
                       'New Year Celebration'
            };
        }

        const modalContent = `
            <div class="rsvp-modal">
                <h3>RSVP Confirmation</h3>
                <p>You are confirming your attendance for:</p>
                <div class="event-details">
                    <h4>${event.title}</h4>
                    ${event.date ? `<p><i class="fas fa-calendar"></i> ${this.formatDate(event.date)}</p>` : ''}
                    ${event.time ? `<p><i class="fas fa-clock"></i> ${event.time}</p>` : ''}
                    ${event.location ? `<p><i class="fas fa-map-marker-alt"></i> ${event.location}</p>` : ''}
                </div>
                
                <div class="form-group">
                    <label for="guests">Number of Guests (including you):</label>
                    <input type="number" id="guests" min="1" max="5" value="1">
                </div>
                
                <div class="form-group">
                    <label for="specialRequests">Special Requests:</label>
                    <textarea id="specialRequests" rows="3" placeholder="Dietary restrictions, accessibility needs, etc."></textarea>
                </div>
                
                <div class="form-actions">
                    <button class="btn-primary" onclick="eliteClients.confirmRsvp('${eventId}')">
                        <i class="fas fa-check-circle"></i>
                        Confirm RSVP
                    </button>
                    <button class="btn-secondary" onclick="eliteClients.closeModal('rsvpModal')">
                        Cancel
                    </button>
                </div>
            </div>
        `;

        this.showCustomModal('RSVP to Event', modalContent, 'rsvpModal');
    }

    // Confirm RSVP
    confirmRsvp(eventId) {
        const guests = document.getElementById('guests').value;
        const requests = document.getElementById('specialRequests').value;

        const rsvpData = {
            eventId: eventId,
            guests: parseInt(guests),
            requests: requests,
            timestamp: new Date().toISOString()
        };

        // Save RSVP
        const rsvps = JSON.parse(localStorage.getItem('eventRsvps') || '[]');
        rsvps.push(rsvpData);
        localStorage.setItem('eventRsvps', JSON.stringify(rsvps));

        this.closeModal('rsvpModal');
        this.showMessage('RSVP confirmed! Event details will be sent to you.', 'success');
    }
}

// Initialize Elite Clients
document.addEventListener('DOMContentLoaded', () => {
    const eliteClients = new EliteClients();
    window.eliteClients = eliteClients;
});

// Add CSS animations for messages
const eliteStyles = document.createElement('style');
eliteStyles.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    .car-detail-modal {
        padding: 20px;
    }
    
    .car-header {
        padding: 30px;
        border-radius: 10px;
        text-align: center;
        margin-bottom: 20px;
    }
    
    .car-header i {
        font-size: 60px;
        margin-bottom: 15px;
        opacity: 0.8;
    }
    
    .car-details-list {
        display: flex;
        flex-direction: column;
        gap: 15px;
        margin-bottom: 30px;
    }
    
    .detail-item {
        display: flex;
        justify-content: space-between;
        padding: 10px 0;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .detail-label {
        font-weight: 600;
        color: #FFD700;
    }
    
    .car-actions-modal {
        display: flex;
        gap: 15px;
    }
    
    .service-modal, .book-service-modal, .rsvp-modal {
        padding: 20px;
    }
    
    .service-options {
        display: flex;
        flex-direction: column;
        gap: 10px;
        margin: 20px 0;
    }
    
    .service-option {
        display: flex;
        align-items: center;
        gap: 15px;
        padding: 15px;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .service-option:hover {
        background: rgba(255, 215, 0, 0.1);
    }
    
    .service-option input[type="radio"] {
        margin: 0;
    }
    
    .service-option label {
        flex: 1;
        cursor: pointer;
        display: flex;
        flex-direction: column;
        gap: 5px;
    }
    
    .service-option i {
        color: #FFD700;
        font-size: 20px;
    }
    
    .service-option small {
        opacity: 0.7;
        font-size: 12px;
    }
    
    .event-details {
        background: rgba(255, 255, 255, 0.05);
        padding: 20px;
        border-radius: 10px;
        margin: 20px 0;
    }
    
    .event-details h4 {
        color: #FFD700;
        margin-bottom: 15px;
    }
    
    .event-details p {
        display: flex;
        align-items: center;
        gap: 10px;
        margin: 10px 0;
    }
    
    .event-details i {
        color: #FFD700;
    }
`;
document.head.appendChild(eliteStyles);