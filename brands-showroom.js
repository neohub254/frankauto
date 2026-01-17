// brands-showroom.js
// Import Firebase
import { db } from './firebase-config.js';
import { 
  collection, 
  getDocs, 
  query, 
  where,
  orderBy 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

class BrandsShowroom {
  constructor() {
    this.cars = [];
    this.filteredCars = [];
    this.currentBrand = 'all';
    this.init();
  }

  async init() {
    this.setupEventListeners();
    await this.loadCars();
    this.renderAllCars();
    this.updateStats();
    this.setupParticles();
    this.setupBackToTop();
    this.setupWhatsAppFloat();
  }

  async loadCars() {
    try {
      // Only load available cars
      const carsQuery = query(
        collection(db, 'cars'), 
        where('status', '==', 'available'),
        orderBy('createdAt', 'desc')
      );
      
      const snapshot = await getDocs(carsQuery);
      this.cars = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      this.filteredCars = [...this.cars];
      
    } catch (error) {
      console.error('Error loading cars:', error);
      this.showMessage('Error loading cars. Please try again.', 'error');
    }
  }

  renderAllCars() {
    // Group cars by brand
    const carsByBrand = {};
    this.cars.forEach(car => {
      if (!carsByBrand[car.brand]) {
        carsByBrand[car.brand] = [];
      }
      carsByBrand[car.brand].push(car);
    });

    // Render each brand section
    this.brands.forEach(brand => {
      const brandCars = carsByBrand[brand] || [];
      this.renderBrandSection(brand, brandCars);
    });

    // Update brand counts
    this.updateBrandCounts(carsByBrand);
  }

  renderBrandSection(brand, cars) {
    const section = document.getElementById(`${brand}Cars`);
    if (!section) return;

    if (cars.length === 0) {
      section.innerHTML = `
        <div class="no-cars-message">
          <i class="fas fa-car"></i>
          <p>No ${brand} cars available at the moment</p>
          <p class="subtext">Check back soon for new arrivals</p>
        </div>
      `;
      return;
    }

    section.innerHTML = cars.map(car => this.createCarCard(car)).join('');
  }

  createCarCard(car) {
    return `
      <div class="car-card" data-id="${car.id}">
        <div class="car-image-container">
          <div class="car-image-slider">
            ${car.images && car.images.length > 0 ? 
              car.images.map(img => `
                <img src="${img}" alt="${car.model}" class="car-image">
              `).join('') : 
              `<div class="car-image-placeholder">
                <i class="fas fa-car"></i>
              </div>`
            }
          </div>
          <div class="car-badge">${car.status === 'available' ? 'Available' : 'Sold'}</div>
          <div class="car-actions">
            <button class="quick-view-btn" onclick="brandsShowroom.quickView('${car.id}')">
              <i class="fas fa-eye"></i>
            </button>
            <button class="whatsapp-btn" onclick="brandsShowroom.contactWhatsApp('${car.id}')">
              <i class="fab fa-whatsapp"></i>
            </button>
          </div>
        </div>
        <div class="car-info">
          <div class="car-brand">${car.brand.charAt(0).toUpperCase() + car.brand.slice(1)}</div>
          <h4 class="car-model">${car.model}</h4>
          <div class="car-specs">
            <div class="spec">
              <i class="fas fa-calendar"></i>
              <span>${car.year}</span>
            </div>
            <div class="spec">
              <i class="fas fa-tachometer-alt"></i>
              <span>${car.mileage ? car.mileage.toLocaleString() + ' km' : 'N/A'}</span>
            </div>
            <div class="spec">
              <i class="fas fa-gas-pump"></i>
              <span>${car.fuelType || 'N/A'}</span>
            </div>
            <div class="spec">
              <i class="fas fa-cog"></i>
              <span>${car.transmission || 'N/A'}</span>
            </div>
          </div>
          <div class="car-price">$${parseFloat(car.price).toLocaleString()}</div>
          <button class="inquiry-btn" onclick="brandsShowroom.showInquiryModal('${car.id}')">
            <i class="fas fa-info-circle"></i>
            More Details
          </button>
        </div>
      </div>
    `;
  }

  updateBrandCounts(carsByBrand) {
    this.brands.forEach(brand => {
      const countElement = document.getElementById(`${brand}Count`);
      if (countElement) {
        const count = carsByBrand[brand] ? carsByBrand[brand].length : 0;
        countElement.textContent = count;
      }
    });

    // Update overall stats
    const totalCars = this.cars.length;
    const availableCars = this.cars.filter(car => car.status === 'available').length;
    
    document.getElementById('totalCarsCount').textContent = `${totalCars}+`;
    document.getElementById('availableCarsCount').textContent = `${availableCars}+`;
    document.getElementById('brandsCount').textContent = `${Object.keys(carsByBrand).length}+`;
  }

  updateStats() {
    // This is already handled in updateBrandCounts
  }

  filterByBrand(brand) {
    this.currentBrand = brand;
    
    // Update active pill
    document.querySelectorAll('.brand-pill').forEach(pill => {
      pill.classList.remove('active');
    });
    document.querySelector(`.brand-pill[data-brand="${brand}"]`).classList.add('active');
    
    // Scroll to brand section if not 'all'
    if (brand !== 'all') {
      const section = document.getElementById(brand);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // Show all cars
      this.filteredCars = [...this.cars];
      this.renderAllCars();
    }
  }

  searchCars(searchTerm) {
    if (!searchTerm.trim()) {
      this.filteredCars = [...this.cars];
      this.renderAllCars();
      return;
    }

    const term = searchTerm.toLowerCase();
    this.filteredCars = this.cars.filter(car =>
      car.model.toLowerCase().includes(term) ||
      car.brand.toLowerCase().includes(term) ||
      car.color.toLowerCase().includes(term) ||
      car.description?.toLowerCase().includes(term)
    );

    // Re-render all sections with filtered cars
    this.renderFilteredCars();
  }

  renderFilteredCars() {
    if (this.currentBrand === 'all') {
      const carsByBrand = {};
      this.filteredCars.forEach(car => {
        if (!carsByBrand[car.brand]) {
          carsByBrand[car.brand] = [];
        }
        carsByBrand[car.brand].push(car);
      });

      this.brands.forEach(brand => {
        const brandCars = carsByBrand[brand] || [];
        this.renderBrandSection(brand, brandCars);
      });
    } else {
      const brandCars = this.filteredCars.filter(car => car.brand === this.currentBrand);
      this.renderBrandSection(this.currentBrand, brandCars);
    }
  }

  quickView(carId) {
    const car = this.cars.find(c => c.id === carId);
    if (!car) return;

    const modalContent = `
      <div class="quick-view-modal">
        <div class="quick-view-images">
          ${car.images && car.images.length > 0 ? 
            car.images.map((img, index) => `
              <img src="${img}" alt="${car.model} - Image ${index + 1}" class="${index === 0 ? 'active' : ''}">
            `).join('') : 
            `<div class="no-image">
              <i class="fas fa-car"></i>
            </div>`
          }
        </div>
        <div class="quick-view-info">
          <h3>${car.brand} ${car.model}</h3>
          <div class="quick-view-details">
            <div class="detail">
              <span class="label">Year:</span>
              <span class="value">${car.year}</span>
            </div>
            <div class="detail">
              <span class="label">Color:</span>
              <span class="value">${car.color}</span>
            </div>
            <div class="detail">
              <span class="label">Fuel Type:</span>
              <span class="value">${car.fuelType || 'N/A'}</span>
            </div>
            <div class="detail">
              <span class="label">Transmission:</span>
              <span class="value">${car.transmission || 'N/A'}</span>
            </div>
            <div class="detail">
              <span class="label">Mileage:</span>
              <span class="value">${car.mileage ? car.mileage.toLocaleString() + ' km' : 'N/A'}</span>
            </div>
          </div>
          <div class="quick-view-price">$${parseFloat(car.price).toLocaleString()}</div>
          <p class="quick-view-description">${car.description || 'No description available.'}</p>
          <div class="quick-view-actions">
            <button class="whatsapp-action" onclick="brandsShowroom.contactWhatsApp('${car.id}')">
              <i class="fab fa-whatsapp"></i> WhatsApp Inquiry
            </button>
            <button class="close-action" onclick="brandsShowroom.closeModal()">
              Close
            </button>
          </div>
        </div>
      </div>
    `;

    this.showModal('Quick View', modalContent, 'quickViewModal');
  }

  showInquiryModal(carId) {
    const car = this.cars.find(c => c.id === carId);
    if (!car) return;

    const modalContent = `
      <div class="inquiry-modal">
        <h4>Inquiry about ${car.brand} ${car.model}</h4>
        <form id="inquiryForm">
          <div class="form-group">
            <label for="inquiryName">Your Name *</label>
            <input type="text" id="inquiryName" required>
          </div>
          <div class="form-group">
            <label for="inquiryPhone">Phone Number *</label>
            <input type="tel" id="inquiryPhone" required>
          </div>
          <div class="form-group">
            <label for="inquiryMessage">Message</label>
            <textarea id="inquiryMessage" rows="4" placeholder="Any specific questions about this vehicle?"></textarea>
          </div>
          <div class="form-actions">
            <button type="submit" class="submit-btn">
              <i class="fab fa-whatsapp"></i> Send via WhatsApp
            </button>
            <button type="button" class="cancel-btn" onclick="brandsShowroom.closeModal()">
              Cancel
            </button>
          </div>
        </form>
      </div>
    `;

    this.showModal('Send Inquiry', modalContent, 'inquiryModal');

    // Handle form submission
    document.getElementById('inquiryForm').addEventListener('submit', (e) => {
      e.preventDefault();
      this.submitInquiry(car);
    });
  }

  submitInquiry(car) {
    const name = document.getElementById('inquiryName').value;
    const phone = document.getElementById('inquiryPhone').value;
    const message = document.getElementById('inquiryMessage').value;

    const whatsappMessage = encodeURIComponent(
      `🚗 *INQUIRY - Luxury Auto Gallery*\n\n` +
      `*Vehicle:* ${car.brand} ${car.model}\n` +
      `*Year:* ${car.year}\n` +
      `*Price:* $${car.price}\n\n` +
      `*From:* ${name}\n` +
      `*Phone:* ${phone}\n\n` +
      `*Message:* ${message || 'No additional message'}\n\n` +
      `_This inquiry was sent via Luxury Auto Gallery website_`
    );

    window.open(`https://wa.me/254742436155?text=${whatsappMessage}`, '_blank');
    this.closeModal();
    this.showMessage('Opening WhatsApp...', 'success');
  }

  contactWhatsApp(carId) {
    const car = this.cars.find(c => c.id === carId);
    if (!car) return;

    const message = encodeURIComponent(
      `Hello! I'm interested in the ${car.brand} ${car.model} (${car.year}) listed for $${car.price}.`
    );

    window.open(`https://wa.me/254742436155?text=${message}`, '_blank');
  }

  showModal(title, content, modalId = 'customModal') {
    // Create or update modal
    let modal = document.getElementById(modalId);
    if (!modal) {
      modal = document.createElement('div');
      modal.id = modalId;
      modal.className = 'modal';
      modal.innerHTML = `
        <div class="modal-content">
          <div class="modal-header">
            <h3>${title}</h3>
            <button class="close-modal" onclick="brandsShowroom.closeModal()">&times;</button>
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

  closeModal() {
    document.querySelectorAll('.modal').forEach(modal => {
      modal.style.display = 'none';
    });
  }

  showMessage(text, type = 'info') {
    const message = document.createElement('div');
    message.className = `brands-message ${type}`;
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

  setupEventListeners() {
    // Brand filter pills
    document.querySelectorAll('.brand-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        const brand = pill.dataset.brand;
        this.filterByBrand(brand);
      });
    });

    // Global search
    const searchInput = document.getElementById('globalSearch');
    if (searchInput) {
      let searchTimeout;
      searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
          this.searchCars(e.target.value);
        }, 300);
      });
    }

    // WhatsApp contact button
    const contactBtn = document.querySelector('.contact-btn');
    if (contactBtn) {
      contactBtn.addEventListener('click', () => {
        window.open('https://wa.me/254742436155', '_blank');
      });
    }

    // Close modal on backdrop click
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('modal')) {
        this.closeModal();
      }
    });

    // Escape key to close modal
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeModal();
      }
    });
  }

  setupParticles() {
    const container = document.getElementById('particles');
    if (!container) return;

    const particleCount = 30;
    for (let i = 0; i < particleCount; i++) {
      this.createParticle(container);
    }
  }

  createParticle(container) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.cssText = `
      position: absolute;
      width: 2px;
      height: 2px;
      background: rgba(0, 255, 157, ${Math.random() * 0.3 + 0.1});
      border-radius: 50%;
      z-index: 1;
    `;

    const x = Math.random() * 100;
    const y = Math.random() * 100;
    particle.style.left = `${x}%`;
    particle.style.top = `${y}%`;

    container.appendChild(particle);
    this.animateParticle(particle, x, y);
  }

  animateParticle(particle, startX, startY) {
    const duration = Math.random() * 10 + 10;
    const amplitude = Math.random() * 20 + 10;

    let start = null;
    const animate = (timestamp) => {
      if (!start) start = timestamp;
      const progress = (timestamp - start) / (duration * 1000);

      if (progress < 1) {
        const x = startX + Math.sin(progress * Math.PI * 2) * amplitude;
        const y = startY + progress * 100;
        
        particle.style.left = `${x}%`;
        particle.style.top = `${y}%`;
        particle.style.opacity = 1 - progress;
        
        requestAnimationFrame(animate);
      } else {
        particle.remove();
        this.createParticle(particle.parentNode);
      }
    };

    requestAnimationFrame(animate);
  }

  setupBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');
    if (!backToTopBtn) return;

    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 300) {
        backToTopBtn.style.display = 'flex';
      } else {
        backToTopBtn.style.display = 'none';
      }
    });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  setupWhatsAppFloat() {
    const whatsappFloat = document.getElementById('whatsappFloat');
    if (!whatsappFloat) return;

    // Show tooltip on hover
    whatsappFloat.addEventListener('mouseenter', () => {
      const tooltip = whatsappFloat.querySelector('.whatsapp-tooltip');
      if (tooltip) {
        tooltip.style.opacity = '1';
        tooltip.style.transform = 'translateX(0)';
      }
    });

    whatsappFloat.addEventListener('mouseleave', () => {
      const tooltip = whatsappFloat.querySelector('.whatsapp-tooltip');
      if (tooltip) {
        tooltip.style.opacity = '0';
        tooltip.style.transform = 'translateX(10px)';
      }
    });
  }
}

// Initialize Brands Showroom
document.addEventListener('DOMContentLoaded', () => {
  const brandsShowroom = new BrandsShowroom();
  window.brandsShowroom = brandsShowroom;
});

// Add CSS styles
const brandsStyles = document.createElement('style');
brandsStyles.textContent = `
  @keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  
  @keyframes slideOut {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
  }
  
  .car-card {
    background: rgba(255, 255, 255, 0.02);
    border-radius: 12px;
    overflow: hidden;
    border: 1px solid rgba(255, 255, 255, 0.05);
    transition: all 0.3s ease;
  }
  
  .car-card:hover {
    transform: translateY(-5px);
    border-color: rgba(0, 255, 157, 0.3);
    box-shadow: 0 10px 30px rgba(0, 255, 157, 0.1);
  }
  
  .car-image-container {
    position: relative;
    height: 200px;
    overflow: hidden;
  }
  
  .car-image-slider {
    width: 100%;
    height: 100%;
    position: relative;
  }
  
  .car-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .car-image-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #0066ff, #00f3ff);
  }
  
  .car-image-placeholder i {
    font-size: 60px;
    color: white;
    opacity: 0.7;
  }
  
  .car-badge {
    position: absolute;
    top: 15px;
    left: 15px;
    background: rgba(0, 255, 157, 0.9);
    color: #000;
    padding: 5px 15px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
  }
  
  .car-actions {
    position: absolute;
    top: 15px;
    right: 15px;
    display: flex;
    gap: 10px;
  }
  
  .quick-view-btn, .whatsapp-btn {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border: none;
    background: rgba(0, 0, 0, 0.7);
    color: white;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .quick-view-btn:hover {
    background: rgba(0, 102, 255, 0.9);
  }
  
  .whatsapp-btn:hover {
    background: rgba(37, 211, 102, 0.9);
  }
  
  .car-info {
    padding: 20px;
  }
  
  .car-brand {
    color: #00f3ff;
    font-size: 14px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 5px;
  }
  
  .car-model {
    font-size: 18px;
    font-weight: 700;
    margin: 0 0 15px 0;
  }
  
  .car-specs {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
    margin-bottom: 15px;
  }
  
  .spec {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    opacity: 0.8;
  }
  
  .spec i {
    color: #00f3ff;
    width: 16px;
  }
  
  .car-price {
    font-size: 24px;
    font-weight: 700;
    color: #00ff9d;
    margin-bottom: 15px;
  }
  
  .inquiry-btn {
    width: 100%;
    padding: 12px;
    background: linear-gradient(135deg, #0066ff, #00f3ff);
    color: white;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }
  
  .inquiry-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 102, 255, 0.3);
  }
  
  .no-cars-message {
    text-align: center;
    padding: 40px 20px;
    color: rgba(255, 255, 255, 0.5);
  }
  
  .no-cars-message i {
    font-size: 40px;
    margin-bottom: 15px;
    display: block;
    opacity: 0.3;
  }
  
  .no-cars-message .subtext {
    font-size: 14px;
    opacity: 0.7;
  }
  
  .brand-pill.active {
    background: linear-gradient(135deg, #0066ff, #00f3ff);
    color: white;
    border-color: transparent;
  }
  
  .modal {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.9);
    z-index: 10000;
    align-items: center;
    justify-content: center;
  }
  
  .modal-content {
    background: linear-gradient(135deg, #0a0f1e, #151a2d);
    border-radius: 16px;
    width: 90%;
    max-width: 800px;
    max-height: 90vh;
    overflow-y: auto;
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 30px 80px rgba(0, 0, 0, 0.7);
  }
  
  .modal-header {
    padding: 25px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .close-modal {
    background: none;
    border: none;
    color: #fff;
    font-size: 28px;
    cursor: pointer;
    opacity: 0.7;
    transition: opacity 0.3s ease;
  }
  
  .close-modal:hover {
    opacity: 1;
  }
  
  .quick-view-modal {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 30px;
    padding: 25px;
  }
  
  .quick-view-images {
    position: relative;
    height: 400px;
    border-radius: 12px;
    overflow: hidden;
  }
  
  .quick-view-images img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .no-image {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #0066ff, #00f3ff);
  }
  
  .no-image i {
    font-size: 80px;
    color: white;
    opacity: 0.7;
  }
  
  .quick-view-info h3 {
    font-size: 28px;
    margin-bottom: 20px;
    color: white;
  }
  
  .quick-view-details {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
    margin-bottom: 25px;
  }
  
  .detail {
    padding: 15px;
    background: rgba(255, 255, 255, 0.03);
    border-radius: 8px;
  }
  
  .label {
    display: block;
    font-size: 12px;
    opacity: 0.7;
    margin-bottom: 5px;
  }
  
  .value {
    font-size: 16px;
    font-weight: 600;
    color: #00f3ff;
  }
  
  .quick-view-price {
    font-size: 32px;
    font-weight: 700;
    color: #00ff9d;
    margin-bottom: 20px;
  }
  
  .quick-view-description {
    line-height: 1.6;
    opacity: 0.9;
    margin-bottom: 25px;
  }
  
  .quick-view-actions {
    display: flex;
    gap: 15px;
  }
  
  .whatsapp-action {
    flex: 1;
    padding: 15px;
    background: linear-gradient(135deg, #25D366, #128C7E);
    color: white;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
  }
  
  .whatsapp-action:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 20px rgba(37, 211, 102, 0.3);
  }
  
  .close-action {
    padding: 15px 30px;
    background: rgba(255, 255, 255, 0.1);
    color: white;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .close-action:hover {
    background: rgba(255, 255, 255, 0.2);
  }
  
  .inquiry-modal {
    padding: 25px;
  }
  
  .form-group {
    margin-bottom: 20px;
  }
  
  .form-group label {
    display: block;
    margin-bottom: 8px;
    font-weight: 600;
  }
  
  .form-group input,
  .form-group textarea {
    width: 100%;
    padding: 12px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    color: white;
    font-size: 16px;
  }
  
  .form-group input:focus,
  .form-group textarea:focus {
    outline: none;
    border-color: #00f3ff;
  }
  
  .form-actions {
    display: flex;
    gap: 15px;
    margin-top: 25px;
  }
  
  .submit-btn {
    flex: 1;
    padding: 15px;
    background: linear-gradient(135deg, #25D366, #128C7E);
    color: white;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
  }
  
  .submit-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 20px rgba(37, 211, 102, 0.3);
  }
  
  .cancel-btn {
    padding: 15px 30px;
    background: rgba(255, 255, 255, 0.1);
    color: white;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .cancel-btn:hover {
    background: rgba(255, 255, 255, 0.2);
  }
  
  .back-to-top {
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: linear-gradient(135deg, #0066ff, #00f3ff);
    color: white;
    border: none;
    cursor: pointer;
    display: none;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    z-index: 100;
    transition: all 0.3s ease;
  }
  
  .back-to-top:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(0, 102, 255, 0.3);
  }
  
  .whatsapp-float {
    position: fixed;
    bottom: 100px;
    right: 30px;
    z-index: 100;
  }
  
  .whatsapp-tooltip {
    position: absolute;
    right: 70px;
    top: 50%;
    transform: translateY(-50%) translateX(10px);
    background: #25D366;
    color: white;
    padding: 8px 15px;
    border-radius: 8px;
    font-size: 14px;
    white-space: nowrap;
    opacity: 0;
    transition: all 0.3s ease;
    pointer-events: none;
  }
  
  .whatsapp-tooltip:after {
    content: '';
    position: absolute;
    top: 50%;
    right: -5px;
    transform: translateY(-50%);
    border-left: 5px solid #25D366;
    border-top: 5px solid transparent;
    border-bottom: 5px solid transparent;
  }
  
  .whatsapp-btn {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: #25D366;
    color: white;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 30px;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 10px 25px rgba(37, 211, 102, 0.3);
  }
  
  .whatsapp-btn:hover {
    transform: scale(1.1);
    box-shadow: 0 15px 35px rgba(37, 211, 102, 0.4);
  }
`;
document.head.appendChild(brandsStyles);
