// Admin Dashboard JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const navLinks = document.querySelectorAll('.admin-nav a');
    const contentSections = document.querySelectorAll('.content-section');
    const actionButtons = document.querySelectorAll('.action-btn[data-target]');
    const logoutBtn = document.getElementById('logoutBtn');
    const refreshDataBtn = document.getElementById('refreshData');
    const carBrandSelect = document.getElementById('carBrand');
    const otherBrandContainer = document.getElementById('otherBrandContainer');
    const carUploadForm = document.getElementById('carUploadForm');
    const imageUploadBoxes = document.querySelectorAll('.image-upload-box');
    const searchInput = document.getElementById('searchCar');
    const filterBrand = document.getElementById('filterBrand');
    const filterStatus = document.getElementById('filterStatus');
    const carsTableBody = document.getElementById('carsTableBody');
    const editCarModal = document.getElementById('editCarModal');
    const closeModalBtn = document.querySelector('.close-modal');
    const passwordForm = document.getElementById('passwordForm');
    const newPasswordInput = document.getElementById('newPassword');
    const passwordStrength = document.getElementById('passwordStrength');

    // State
    let carsData = [];
    let currentEditCarId = null;

    // Initialize
    init();

    function init() {
        setupEventListeners();
        updateTime();
        loadDashboardData();
        checkAdminSession();
    }

    function setupEventListeners() {
        // Navigation
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href').substring(1);
                
                // Update active nav item
                navLinks.forEach(l => l.parentElement.classList.remove('active'));
                this.parentElement.classList.add('active');
                
                // Show target section
                contentSections.forEach(section => {
                    section.classList.remove('active');
                    if (section.id === targetId) {
                        section.classList.add('active');
                    }
                });

                // Load specific section data
                loadSectionData(targetId);
            });
        });

        // Quick action buttons
        actionButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                const targetId = this.dataset.target;
                navLinks.forEach(l => l.parentElement.classList.remove('active'));
                document.querySelector(`.admin-nav a[href="#${targetId}"]`).parentElement.classList.add('active');
                
                contentSections.forEach(section => {
                    section.classList.remove('active');
                    if (section.id === targetId) {
                        section.classList.add('active');
                    }
                });

                loadSectionData(targetId);
            });
        });

        // Logout
        logoutBtn.addEventListener('click', logout);

        // Refresh data
        refreshDataBtn.addEventListener('click', loadDashboardData);

        // Brand selection for "Other"
        carBrandSelect.addEventListener('change', function() {
            if (this.value === 'other') {
                otherBrandContainer.style.display = 'block';
            } else {
                otherBrandContainer.style.display = 'none';
            }
        });

        // Image upload preview
        imageUploadBoxes.forEach(box => {
            const input = box.querySelector('.image-input');
            const preview = box.querySelector('.preview');
            
            input.addEventListener('change', function(e) {
                const file = this.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        preview.src = e.target.result;
                        preview.style.display = 'block';
                        box.querySelector('i').style.display = 'none';
                        box.querySelector('span').style.display = 'none';
                    };
                    reader.readAsDataURL(file);
                }
            });
        });

        // Car upload form
        carUploadForm.addEventListener('submit', handleCarUpload);

        // Search and filter
        searchInput.addEventListener('input', filterCars);
        filterBrand.addEventListener('change', filterCars);
        filterStatus.addEventListener('change', filterCars);

        // Modal
        closeModalBtn.addEventListener('click', () => {
            editCarModal.classList.remove('active');
        });

        // Close modal on outside click
        editCarModal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.remove('active');
            }
        });

        // Password strength indicator
        newPasswordInput.addEventListener('input', updatePasswordStrength);

        // Password form
        passwordForm.addEventListener('submit', handlePasswordChange);
    }

    function updateTime() {
        const timeElement = document.getElementById('currentTime');
        function update() {
            const now = new Date();
            timeElement.textContent = now.toLocaleString('en-US', {
                weekday: 'short',
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true
            });
        }
        update();
        setInterval(update, 1000);
    }

   function checkAdminSession() {
    // Add a small delay to ensure session is saved
    setTimeout(() => {
        const session = localStorage.getItem('adminSession');
        const expiry = localStorage.getItem('sessionExpiry');
        
        console.log('Session check:', { session, expiry, currentTime: Date.now() });
        
        if (!session || !expiry || Date.now() > parseInt(expiry)) {
            console.log('No valid session found, redirecting to login');
            window.location.href = 'admin-login.html';
        } else {
            console.log('Valid session found, access granted');
        }
    }, 100);
}

    console.log('=== ADMIN DASHBOARD LOADING ===');
console.log('Current localStorage:', {
    adminSession: localStorage.getItem('adminSession'),
    sessionExpiry: localStorage.getItem('sessionExpiry'),
    loginAttempts: localStorage.getItem('loginAttempts')
});
console.log('Current time:', Date.now());
console.log('===============================');
    function loadDashboardData() {
        // Simulate API call
        // FIREBASE INTEGRATION MARKER - Load cars data from Firebase
        
        // For demo purposes
        const sampleCars = [
            {
                id: '1',
                model: 'Camry XSE',
                brand: 'toyota',
                year: 2023,
                price: 35000,
                status: 'available',
                images: ['sample1.jpg'],
                color: 'Black',
                mileage: 15000,
                fuel: 'petrol'
            },
            {
                id: '2',
                model: 'X5 M Sport',
                brand: 'bmw',
                year: 2022,
                price: 85000,
                status: 'available',
                images: ['sample2.jpg'],
                color: 'White',
                mileage: 20000,
                fuel: 'diesel'
            }
        ];
        
        carsData = sampleCars;
        updateDashboardStats();
        updateCarsTable();
        updateBrandsOverview();
    }

    function updateDashboardStats() {
        const totalCars = carsData.length;
        const soldCars = carsData.filter(car => car.status === 'sold').length;
        const availableCars = carsData.filter(car => car.status === 'available').length;
        const totalWorth = carsData.reduce((sum, car) => sum + car.price, 0);
        
        document.getElementById('totalCars').textContent = totalCars;
        document.getElementById('soldCars').textContent = soldCars;
        document.getElementById('availableCars').textContent = availableCars;
        document.getElementById('totalWorth').textContent = `$${totalWorth.toLocaleString()}`;
        
        // Update recent activity
        updateActivityList();
        
        // Update top brands
        updateTopBrands();
    }

    function updateActivityList() {
        const activityList = document.getElementById('activityList');
        const activities = [
            { time: '2 mins ago', description: 'New car added: BMW X5 M Sport' },
            { time: '1 hour ago', description: 'Car marked as sold: Toyota Camry XSE' },
            { time: '3 hours ago', description: 'Price updated: Mercedes C-Class' },
            { time: 'Yesterday', description: 'New admin logged in' }
        ];
        
        activityList.innerHTML = activities.map(activity => `
            <div class="activity-item">
                <div class="time">${activity.time}</div>
                <div class="description">${activity.description}</div>
            </div>
        `).join('');
    }

    function updateTopBrands() {
        const brandsList = document.getElementById('brandsList');
        const brandTotals = {};
        
        carsData.forEach(car => {
            if (!brandTotals[car.brand]) {
                brandTotals[car.brand] = 0;
            }
            brandTotals[car.brand] += car.price;
        });
        
        const topBrands = Object.entries(brandTotals)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);
        
        brandsList.innerHTML = topBrands.map(([brand, value]) => `
            <div class="brand-item">
                <div class="brand-name">
                    <i class="fas fa-flag"></i>
                    <span>${brand.charAt(0).toUpperCase() + brand.slice(1)}</span>
                </div>
                <div class="brand-value">$${value.toLocaleString()}</div>
            </div>
        `).join('');
    }

    function loadSectionData(sectionId) {
        switch(sectionId) {
            case 'manage-cars':
                updateCarsTable();
                break;
            case 'brands-overview':
                updateBrandsOverview();
                break;
            case 'sales-analytics':
                loadAnalytics();
                break;
            case 'elite-clients':
                loadEliteClients();
                break;
        }
    }

    function handleCarUpload(e) {
        e.preventDefault();
        
        const formData = new FormData(carUploadForm);
        const carData = {
            model: formData.get('carModel'),
            brand: formData.get('carBrand'),
            otherBrand: formData.get('carBrand') === 'other' ? formData.get('otherBrand') : null,
            year: parseInt(formData.get('carYear')),
            color: formData.get('carColor'),
            mileage: formData.get('carMileage') ? parseInt(formData.get('carMileage')) : null,
            fuel: formData.get('carFuel'),
            transmission: formData.get('carTransmission'),
            price: parseInt(formData.get('carPrice')),
            description: formData.get('carDescription'),
            status: 'available',
            createdAt: new Date().toISOString(),
            images: []
        };
        
        // Get image files
        const images = [];
        for (let i = 1; i <= 3; i++) {
            const file = formData.get(`carImage${i}`);
            if (file) {
                images.push(file);
            }
        }
        
        // FIREBASE INTEGRATION MARKER - Upload images to Firebase Storage
        // FIREBASE INTEGRATION MARKER - Save car data to Firestore
        
        // For demo purposes
        const newCarId = Date.now().toString();
        carData.id = newCarId;
        carsData.push(carData);
        
        // Show success message
        showNotification('Car uploaded successfully!', 'success');
        
        // Reset form
        carUploadForm.reset();
        imageUploadBoxes.forEach(box => {
            const preview = box.querySelector('.preview');
            preview.src = '';
            preview.style.display = 'none';
            box.querySelector('i').style.display = 'block';
            box.querySelector('span').style.display = 'block';
        });
        
        // Update dashboard
        updateDashboardStats();
        updateCarsTable();
    }

    function updateCarsTable() {
        carsTableBody.innerHTML = carsData.map(car => `
            <tr>
                <td class="car-image-cell">
                    <img src="${car.images[0] || 'default-car.jpg'}" alt="${car.model}">
                </td>
                <td>${car.model}</td>
                <td>${car.otherBrand || car.brand}</td>
                <td>${car.year}</td>
                <td>$${car.price.toLocaleString()}</td>
                <td>
                    <span class="status-badge status-${car.status}">
                        ${car.status === 'available' ? 'Available' : 'Sold'}
                    </span>
                </td>
                <td>
                    <div class="action-icons">
                        <button class="action-icon edit-btn" onclick="editCar('${car.id}')">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-icon delete-btn" onclick="deleteCar('${car.id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                        ${car.status === 'available' ? `
                            <button class="action-icon sold-btn" onclick="markAsSold('${car.id}')">
                                <i class="fas fa-check-circle"></i>
                            </button>
                        ` : ''}
                    </div>
                </td>
            </tr>
        `).join('');
    }

    function filterCars() {
        const searchTerm = searchInput.value.toLowerCase();
        const brandFilter = filterBrand.value;
        const statusFilter = filterStatus.value;
        
        const filteredCars = carsData.filter(car => {
            const matchesSearch = car.model.toLowerCase().includes(searchTerm) ||
                                 car.brand.toLowerCase().includes(searchTerm);
            const matchesBrand = !brandFilter || car.brand === brandFilter || 
                                 (brandFilter === 'other' && car.otherBrand);
            const matchesStatus = !statusFilter || car.status === statusFilter;
            
            return matchesSearch && matchesBrand && matchesStatus;
        });
        
        carsTableBody.innerHTML = filteredCars.map(car => `
            <tr>
                <td class="car-image-cell">
                    <img src="${car.images[0] || 'default-car.jpg'}" alt="${car.model}">
                </td>
                <td>${car.model}</td>
                <td>${car.otherBrand || car.brand}</td>
                <td>${car.year}</td>
                <td>$${car.price.toLocaleString()}</td>
                <td>
                    <span class="status-badge status-${car.status}">
                        ${car.status === 'available' ? 'Available' : 'Sold'}
                    </span>
                </td>
                <td>
                    <div class="action-icons">
                        <button class="action-icon edit-btn" onclick="editCar('${car.id}')">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-icon delete-btn" onclick="deleteCar('${car.id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                        ${car.status === 'available' ? `
                            <button class="action-icon sold-btn" onclick="markAsSold('${car.id}')">
                                <i class="fas fa-check-circle"></i>
                            </button>
                        ` : ''}
                    </div>
                </td>
            </tr>
        `).join('');
    }

    function updateBrandsOverview() {
        const brandsOverview = document.getElementById('brandsOverview');
        const brands = [
            { id: 'toyota', name: 'Toyota', count: 12, value: 420000 },
            { id: 'bmw', name: 'BMW', count: 8, value: 980000 },
            { id: 'mercedes', name: 'Mercedes', count: 6, value: 750000 },
            { id: 'porsche', name: 'Porsche', count: 4, value: 1200000 },
            { id: 'range-rover', name: 'Range Rover', count: 5, value: 650000 },
            { id: 'ford', name: 'Ford', count: 10, value: 380000 },
            { id: 'lexus', name: 'Lexus', count: 7, value: 550000 },
            { id: 'nissan', name: 'Nissan', count: 9, value: 320000 },
            { id: 'mitsubishi', name: 'Mitsubishi', count: 3, value: 150000 },
            { id: 'volvo', name: 'Volvo', count: 6, value: 480000 },
            { id: 'audi', name: 'Audi', count: 5, value: 520000 },
            { id: 'jeep', name: 'Jeep', count: 4, value: 280000 },
            { id: 'other', name: 'Other Brands', count: 8, value: 350000 }
        ];
        
        brandsOverview.innerHTML = brands.map(brand => `
            <div class="brand-overview-card">
                <div class="brand-logo-preview">
                    <i class="fas fa-car"></i>
                </div>
                <h4>${brand.name}</h4>
                <div class="brand-stats">
                    <div class="brand-stat">
                        <div class="value">${brand.count}</div>
                        <div class="label">Cars</div>
                    </div>
                    <div class="brand-stat">
                        <div class="value">$${(brand.value / 1000).toFixed(0)}K</div>
                        <div class="label">Value</div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    function loadAnalytics() {
        // Initialize charts
        const monthlySalesCtx = document.getElementById('monthlySalesChart').getContext('2d');
        const revenueCtx = document.getElementById('revenueChart').getContext('2d');
        
        // Monthly Sales Chart
        new Chart(monthlySalesCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Cars Sold',
                    data: [12, 19, 8, 15, 22, 18],
                    borderColor: 'rgba(0, 212, 255, 1)',
                    backgroundColor: 'rgba(0, 212, 255, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: {
                            color: '#fff'
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            color: '#a0a0c0'
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    },
                    x: {
                        ticks: {
                            color: '#a0a0c0'
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    }
                }
            }
        });
        
        // Revenue Chart
        new Chart(revenueCtx, {
            type: 'bar',
            data: {
                labels: ['Toyota', 'BMW', 'Mercedes', 'Porsche', 'Range Rover'],
                datasets: [{
                    label: 'Revenue ($)',
                    data: [420000, 980000, 750000, 1200000, 650000],
                    backgroundColor: [
                        'rgba(255, 215, 0, 0.6)',
                        'rgba(0, 212, 255, 0.6)',
                        'rgba(0, 255, 157, 0.6)',
                        'rgba(255, 0, 60, 0.6)',
                        'rgba(255, 153, 0, 0.6)'
                    ],
                    borderColor: [
                        'rgba(255, 215, 0, 1)',
                        'rgba(0, 212, 255, 1)',
                        'rgba(0, 255, 157, 1)',
                        'rgba(255, 0, 60, 1)',
                        'rgba(255, 153, 0, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: {
                            color: '#fff'
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            color: '#a0a0c0',
                            callback: function(value) {
                                return '$' + (value / 1000) + 'K';
                            }
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    },
                    x: {
                        ticks: {
                            color: '#a0a0c0'
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    }
                }
            }
        });
    }

    function loadEliteClients() {
        const soldCarsList = document.getElementById('soldCarsList');
        const soldCars = carsData.filter(car => car.status === 'sold');
        
        if (soldCars.length === 0) {
            soldCarsList.innerHTML = `
                <div class="no-data">
                    <i class="fas fa-users-slash"></i>
                    <h3>No Elite Clients Yet</h3>
                    <p>Cars marked as sold will appear here</p>
                </div>
            `;
            return;
        }
        
        soldCarsList.innerHTML = soldCars.map(car => `
            <div class="sold-car-card">
                <div class="sold-car-image">
                    <img src="${car.images[0] || 'default-car.jpg'}" alt="${car.model}">
                </div>
                <div class="sold-car-details">
                    <h4>${car.model}</h4>
                    <p><i class="fas fa-flag"></i> ${car.otherBrand || car.brand}</p>
                    <p><i class="fas fa-calendar"></i> ${car.year}</p>
                    <p><i class="fas fa-tag"></i> Sold for $${car.price.toLocaleString()}</p>
                    <p><i class="fas fa-clock"></i> Sold on ${new Date(car.soldAt || car.createdAt).toLocaleDateString()}</p>
                </div>
            </div>
        `).join('');
    }

    function updatePasswordStrength() {
        const password = newPasswordInput.value;
        let strength = 'weak';
        
        if (password.length >= 8) {
            strength = 'medium';
        }
        if (password.length >= 12 && /[A-Z]/.test(password) && /[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password)) {
            strength = 'strong';
        }
        
        passwordStrength.className = `password-strength ${strength}`;
    }

    function handlePasswordChange(e) {
        e.preventDefault();
        
        const currentPassword = document.getElementById('currentPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        // Basic validation
        if (newPassword !== confirmPassword) {
            showNotification('New passwords do not match!', 'error');
            return;
        }
        
        if (newPassword.length < 8) {
            showNotification('Password must be at least 8 characters long!', 'error');
            return;
        }
        
        // FIREBASE INTEGRATION MARKER - Update password in Firebase
        
        showNotification('Password updated successfully!', 'success');
        passwordForm.reset();
        passwordStrength.className = 'password-strength';
    }

    function logout() {
        localStorage.removeItem('adminSession');
        localStorage.removeItem('sessionExpiry');
        window.location.href = 'admin-login.html';
    }

    function showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;
        
        // Style notification
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background: rgba(21, 26, 45, 0.95);
            color: #fff;
            padding: 15px 20px;
            border-radius: 8px;
            border-left: 4px solid ${type === 'success' ? '#00ff9d' : type === 'error' ? '#ff003c' : '#00d4ff'};
            display: flex;
            align-items: center;
            gap: 10px;
            z-index: 1000;
            animation: slideIn 0.3s ease;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
            max-width: 400px;
        `;
        
        document.body.appendChild(notification);
        
        // Remove after 5 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }

    // Make functions available globally for inline onclick handlers
    window.editCar = function(carId) {
        const car = carsData.find(c => c.id === carId);
        if (!car) return;
        
        currentEditCarId = carId;
        
        const modalBody = document.querySelector('.modal-body');
        modalBody.innerHTML = `
            <form id="editCarForm">
                <div class="form-grid">
                    <div class="form-section">
                        <div class="form-group">
                            <label for="editModel">Car Model</label>
                            <input type="text" id="editModel" value="${car.model}" required>
                        </div>
                        <div class="form-group">
                            <label for="editBrand">Brand</label>
                            <input type="text" id="editBrand" value="${car.otherBrand || car.brand}" required>
                        </div>
                        <div class="form-group">
                            <label for="editYear">Year</label>
                            <input type="number" id="editYear" value="${car.year}" required>
                        </div>
                    </div>
                    <div class="form-section">
                        <div class="form-group">
                            <label for="editPrice">Price ($)</label>
                            <input type="number" id="editPrice" value="${car.price}" required>
                        </div>
                        <div class="form-group">
                            <label for="editStatus">Status</label>
                            <select id="editStatus">
                                <option value="available" ${car.status === 'available' ? 'selected' : ''}>Available</option>
                                <option value="sold" ${car.status === 'sold' ? 'selected' : ''}>Sold</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div class="form-actions">
                    <button type="submit" class="submit-btn">
                        <i class="fas fa-save"></i> Save Changes
                    </button>
                </div>
            </form>
        `;
        
        editCarModal.classList.add('active');
        
        // Handle edit form submission
        document.getElementById('editCarForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const updatedCar = {
                ...car,
                model: document.getElementById('editModel').value,
                brand: car.brand === 'other' ? 'other' : car.brand,
                otherBrand: document.getElementById('editBrand').value,
                year: parseInt(document.getElementById('editYear').value),
                price: parseInt(document.getElementById('editPrice').value),
                status: document.getElementById('editStatus').value
            };
            
            // FIREBASE INTEGRATION MARKER - Update car in Firebase
            
            // Update local data
            const index = carsData.findIndex(c => c.id === carId);
            if (index !== -1) {
                carsData[index] = updatedCar;
            }
            
            // Update UI
            updateDashboardStats();
            updateCarsTable();
            
            showNotification('Car updated successfully!', 'success');
            editCarModal.classList.remove('active');
        });
    };

    window.deleteCar = function(carId) {
        if (!confirm('Are you sure you want to delete this car? This action cannot be undone.')) {
            return;
        }
        
        // FIREBASE INTEGRATION MARKER - Delete car from Firebase
        
        // Update local data
        carsData = carsData.filter(car => car.id !== carId);
        
        // Update UI
        updateDashboardStats();
        updateCarsTable();
        
        showNotification('Car deleted successfully!', 'success');
    };

    window.markAsSold = function(carId) {
        const car = carsData.find(c => c.id === carId);
        if (!car) return;
        
        // FIREBASE INTEGRATION MARKER - Update car status in Firebase
        
        // Update local data
        car.status = 'sold';
        car.soldAt = new Date().toISOString();
        
        // Update UI
        updateDashboardStats();
        updateCarsTable();
        
        showNotification('Car marked as sold! It will now appear in Elite Clients.', 'success');
    };
});

