/**
 * FRANK AUTO DEALS - Admin Dashboard
 * Complete car, brand, and client management system
 */

class AdminDashboard {
    constructor() {
        this.cars = JSON.parse(localStorage.getItem('frankCars')) || [];
        this.brands = JSON.parse(localStorage.getItem('frankBrands')) || this.getDefaultBrands();
        this.eliteClients = JSON.parse(localStorage.getItem('frankEliteClients')) || [];
        this.currentCarId = null;
        this.maxImages = 3;
        this.uploadedImages = [];
        
        this.init();
    }

    init() {
        this.checkAuth();
        this.setupEventListeners();
        this.loadDashboardData();
        this.setupDataTables();
        this.loadBrands();
        this.setupImageUpload();
        this.updateStats();
        this.setupSessionTimer();
    }

    checkAuth() {
        const sessionToken = localStorage.getItem('adminSession');
        const expiryTime = localStorage.getItem('sessionExpiry');
        
        if (!sessionToken || !expiryTime || Date.now() > parseInt(expiryTime)) {
            window.location.href = 'admin-login.html';
            return false;
        }
        return true;
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.dashboard-nav a').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = e.target.closest('a').getAttribute('href').substring(1);
                this.scrollToSection(target);
            });
        });

        // Add Car Button
        document.getElementById('addCarBtn').addEventListener('click', () => {
            this.openAddCarModal();
        });

        // Save Car Form
        document.getElementById('carForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveCar();
        });

        // Car Status Change
        document.getElementById('carStatus').addEventListener('change', (e) => {
            this.toggleClientDetails(e.target.value === 'sold');
        });

        // Brand Upload
        document.getElementById('brandLogoInput').addEventListener('change', (e) => {
            this.handleBrandLogoUpload(e.target.files[0]);
        });

        document.getElementById('saveBrandBtn').addEventListener('click', () => {
            this.saveBrand();
        });

        // Logout
        document.getElementById('logoutBtn').addEventListener('click', () => {
            this.logout();
        });

        // Modal Close Buttons
        document.querySelectorAll('.close-modal').forEach(btn => {
            btn.addEventListener('click', () => {
                this.closeAllModals();
            });
        });

        // Image Upload
        document.getElementById('carImagesInput').addEventListener('change', (e) => {
            this.handleCarImageUpload(e.target.files);
        });
    }

    getDefaultBrands() {
        return [
            { id: 'bmw', name: 'BMW', tagline: 'The Ultimate Driving Machine', logo: 'assets/images/logos/bmw.png' },
            { id: 'mercedes', name: 'Mercedes-Benz', tagline: 'The Best or Nothing', logo: 'assets/images/logos/mercedes.png' },
            { id: 'toyota', name: 'Toyota', tagline: 'Reliability Redefined', logo: 'assets/images/logos/toyota.png' },
            { id: 'porsche', name: 'Porsche', tagline: 'There is No Substitute', logo: 'assets/images/logos/porsche.png' },
            { id: 'range-rover', name: 'Range Rover', tagline: 'Above and Beyond', logo: 'assets/images/logos/range-rover.png' },
            { id: 'ford', name: 'Ford', tagline: 'Built Ford Tough', logo: 'assets/images/logos/ford.png' },
            { id: 'nissan', name: 'Nissan', tagline: 'Innovation that excites', logo: 'assets/images/logos/nissan.png' },
            { id: 'lexus', name: 'Lexus', tagline: 'The Pursuit of Perfection', logo: 'assets/images/logos/lexus.png' },
            { id: 'audi', name: 'Audi', tagline: 'Vorsprung durch Technik', logo: 'assets/images/logos/audi.png' }
        ];
    }

    loadDashboardData() {
        this.updateStats();
        this.populateBrandSelect();
    }

    updateStats() {
        const totalCars = this.cars.length;
        const availableCars = this.cars.filter(car => car.status === 'available').length;
        const totalValue = this.cars.reduce((sum, car) => sum + (parseInt(car.price) || 0), 0);
        const eliteClientsCount = this.eliteClients.length;

        document.getElementById('totalCars').textContent = totalCars;
        document.getElementById('availableCars').textContent = availableCars;
        document.getElementById('totalValue').textContent = `KSh ${totalValue.toLocaleString()}`;
        document.getElementById('eliteClients').textContent = eliteClientsCount;
    }

    populateBrandSelect() {
        const select = document.getElementById('carBrandSelect');
        select.innerHTML = '<option value="">Select Brand</option>';
        
        this.brands.forEach(brand => {
            const option = document.createElement('option');
            option.value = brand.id;
            option.textContent = brand.name;
            select.appendChild(option);
        });
    }

    setupDataTables() {
        // Cars Table
        if ($.fn.DataTable.isDataTable('#carsTable')) {
            $('#carsTable').DataTable().destroy();
        }
        
        this.carsTable = $('#carsTable').DataTable({
            data: this.cars,
            columns: [
                { data: 'id' },
                { 
                    data: 'images',
                    render: (data) => {
                        if (data && data.length > 0) {
                            return `<img src="${data[0]}" alt="Car Image" class="car-image">`;
                        }
                        return '<i class="fas fa-car"></i>';
                    }
                },
                { data: 'brand' },
                { data: 'model' },
                { data: 'year' },
                { 
                    data: 'price',
                    render: (data) => `KSh ${parseInt(data).toLocaleString()}`
                },
                { 
                    data: 'status',
                    render: (data) => {
                        const statusClass = data === 'available' ? 'status-available' : 
                                          data === 'reserved' ? 'status-reserved' : 'status-sold';
                        return `<span class="status-badge ${statusClass}">${data.toUpperCase()}</span>`;
                    }
                },
                {
                    data: null,
                    render: (data, type, row) => {
                        return `
                            <div class="table-actions">
                                <button class="action-btn edit" onclick="adminDashboard.editCar('${row.id}')">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="action-btn sold" onclick="adminDashboard.markAsSold('${row.id}')">
                                    <i class="fas fa-check-circle"></i>
                                </button>
                                <button class="action-btn delete" onclick="adminDashboard.deleteCar('${row.id}')">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        `;
                    }
                }
            ],
            responsive: true,
            pageLength: 10,
            language: {
                search: "Search cars:",
                lengthMenu: "Show _MENU_ cars per page",
                info: "Showing _START_ to _END_ of _TOTAL_ cars",
                paginate: {
                    first: "First",
                    last: "Last",
                    next: "Next",
                    previous: "Previous"
                }
            }
        });

        // Clients Table
        if ($.fn.DataTable.isDataTable('#clientsTable')) {
            $('#clientsTable').DataTable().destroy();
        }
        
        this.clientsTable = $('#clientsTable').DataTable({
            data: this.eliteClients,
            columns: [
                { data: 'id' },
                { data: 'name' },
                { data: 'carModel' },
                { data: 'purchaseDate' },
                { 
                    data: 'amount',
                    render: (data) => `KSh ${parseInt(data).toLocaleString()}`
                },
                { 
                    data: 'status',
                    render: (data) => `<span class="status-badge status-sold">${data}</span>`
                },
                {
                    data: null,
                    render: (data) => {
                        return `
                            <div class="table-actions">
                                <button class="action-btn edit" onclick="adminDashboard.viewClient('${data.id}')">
                                    <i class="fas fa-eye"></i>
                                </button>
                                <button class="action-btn delete" onclick="adminDashboard.removeClient('${data.id}')">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        `;
                    }
                }
            ],
            responsive: true,
            pageLength: 10
        });
    }

    openAddCarModal() {
        this.resetCarForm();
        document.getElementById('addCarModal').style.display = 'flex';
    }

    resetCarForm() {
        document.getElementById('carForm').reset();
        this.uploadedImages = [];
        this.updateUploadedImagesDisplay();
        this.currentCarId = null;
        document.getElementById('clientDetailsSection').style.display = 'none';
    }

    setupImageUpload() {
        const uploadZone = document.getElementById('imageUploadZone');
        
        // Drag and drop
        uploadZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadZone.style.borderColor = '#00ff9d';
            uploadZone.style.background = 'rgba(0, 255, 157, 0.05)';
        });

        uploadZone.addEventListener('dragleave', () => {
            uploadZone.style.borderColor = '';
            uploadZone.style.background = '';
        });

        uploadZone.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadZone.style.borderColor = '';
            uploadZone.style.background = '';
            this.handleCarImageUpload(e.dataTransfer.files);
        });
    }

    handleCarImageUpload(files) {
        const images = Array.from(files).slice(0, this.maxImages - this.uploadedImages.length);
        
        images.forEach(file => {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    this.uploadedImages.push(e.target.result);
                    this.updateUploadedImagesDisplay();
                };
                reader.readAsDataURL(file);
            }
        });
    }

    updateUploadedImagesDisplay() {
        const container = document.getElementById('uploadedImages');
        container.innerHTML = '';
        
        this.uploadedImages.forEach((image, index) => {
            const div = document.createElement('div');
            div.className = 'uploaded-image';
            div.innerHTML = `
                <img src="${image}" alt="Car image ${index + 1}">
                <button type="button" class="remove-image" onclick="adminDashboard.removeImage(${index})">
                    <i class="fas fa-times"></i>
                </button>
            `;
            container.appendChild(div);
        });
    }

    removeImage(index) {
        this.uploadedImages.splice(index, 1);
        this.updateUploadedImagesDisplay();
    }

    saveCar() {
        const carData = {
            id: this.currentCarId || 'car_' + Date.now(),
            images: [...this.uploadedImages],
            brand: document.getElementById('carBrandSelect').value,
            model: document.getElementById('carModel').value,
            year: document.getElementById('carYear').value,
            price: document.getElementById('carPrice').value,
            color: document.getElementById('carColor').value,
            mileage: document.getElementById('carMileage').value,
            description: document.getElementById('carDescription').value,
            engine: document.getElementById('carEngine').value,
            transmission: document.getElementById('carTransmission').value,
            fuel: document.getElementById('carFuel').value,
            seats: document.getElementById('carSeats').value,
            status: document.getElementById('carStatus').value,
            createdAt: new Date().toISOString()
        };

        // If sold, add to elite clients
        if (carData.status === 'sold') {
            const clientData = {
                id: 'client_' + Date.now(),
                name: document.getElementById('clientName').value || 'VIP Client',
                email: document.getElementById('clientEmail').value || '',
                phone: document.getElementById('clientPhone').value || '',
                carBrand: this.brands.find(b => b.id === carData.brand)?.name || carData.brand,
                carModel: carData.model,
                purchaseDate: new Date().toLocaleDateString(),
                amount: carData.price,
                status: 'Active'
            };
            this.eliteClients.push(clientData);
            localStorage.setItem('frankEliteClients', JSON.stringify(this.eliteClients));
        }

        // Update or add car
        if (this.currentCarId) {
            const index = this.cars.findIndex(c => c.id === this.currentCarId);
            if (index !== -1) {
                this.cars[index] = { ...this.cars[index], ...carData };
            }
        } else {
            this.cars.push(carData);
        }

        // Save to localStorage
        localStorage.setItem('frankCars', JSON.stringify(this.cars));
        
        // Update tables
        this.setupDataTables();
        this.updateStats();
        
        // Show success message
        this.showSuccess('Car saved successfully!');
        
        // Close modal
        this.closeAllModals();
    }

    editCar(carId) {
        const car = this.cars.find(c => c.id === carId);
        if (!car) return;

        this.currentCarId = carId;
        this.uploadedImages = [...car.images];
        
        // Populate form
        document.getElementById('carBrandSelect').value = car.brand;
        document.getElementById('carModel').value = car.model;
        document.getElementById('carYear').value = car.year;
        document.getElementById('carPrice').value = car.price;
        document.getElementById('carColor').value = car.color || '';
        document.getElementById('carMileage').value = car.mileage || '';
        document.getElementById('carDescription').value = car.description || '';
        document.getElementById('carEngine').value = car.engine || '';
        document.getElementById('carTransmission').value = car.transmission || '';
        document.getElementById('carFuel').value = car.fuel || '';
        document.getElementById('carSeats').value = car.seats || '';
        document.getElementById('carStatus').value = car.status;
        
        this.updateUploadedImagesDisplay();
        this.toggleClientDetails(car.status === 'sold');
        
        document.getElementById('addCarModal').style.display = 'flex';
    }

    markAsSold(carId) {
        if (confirm('Mark this car as sold? This will move it to elite clients.')) {
            const car = this.cars.find(c => c.id === carId);
            if (car) {
                car.status = 'sold';
                
                // Add to elite clients
                const clientData = {
                    id: 'client_' + Date.now(),
                    name: 'VIP Client',
                    email: '',
                    phone: '',
                    carBrand: this.brands.find(b => b.id === car.brand)?.name || car.brand,
                    carModel: car.model,
                    purchaseDate: new Date().toLocaleDateString(),
                    amount: car.price,
                    status: 'Active'
                };
                this.eliteClients.push(clientData);
                
                // Save to localStorage
                localStorage.setItem('frankCars', JSON.stringify(this.cars));
                localStorage.setItem('frankEliteClients', JSON.stringify(this.eliteClients));
                
                // Update tables
                this.setupDataTables();
                this.updateStats();
                
                this.showSuccess('Car marked as sold and added to elite clients!');
            }
        }
    }

    deleteCar(carId) {
        if (confirm('Are you sure you want to delete this car?')) {
            this.cars = this.cars.filter(c => c.id !== carId);
            localStorage.setItem('frankCars', JSON.stringify(this.cars));
            
            this.setupDataTables();
            this.updateStats();
            
            this.showSuccess('Car deleted successfully!');
        }
    }

    handleBrandLogoUpload(file) {
        if (!file || !file.type.startsWith('image/')) {
            this.showError('Please select a valid image file');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const uploadZone = document.getElementById('brandUploadZone');
            uploadZone.innerHTML = `
                <img src="${e.target.result}" style="max-width: 100px; max-height: 100px; margin-bottom: 15px;">
                <p>Logo loaded successfully</p>
                <button class="btn-browse" onclick="adminDashboard.resetBrandUpload()">
                    Change Logo
                </button>
            `;
            
            // Store the image data
            this.currentBrandLogo = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    resetBrandUpload() {
        document.getElementById('brandUploadZone').innerHTML = `
            <i class="fas fa-cloud-upload-alt"></i>
            <p>Drag & drop brand logo here or click to browse</p>
            <button class="btn-browse" onclick="document.getElementById('brandLogoInput').click()">
                Browse Files
            </button>
        `;
        this.currentBrandLogo = null;
    }

    saveBrand() {
        const brandId = document.getElementById('brandName').value;
        const tagline = document.getElementById('brandTagline').value;
        
        if (!brandId) {
            this.showError('Please select a brand');
            return;
        }

        // Update brand
        const brandIndex = this.brands.findIndex(b => b.id === brandId);
        if (brandIndex !== -1) {
            this.brands[brandIndex].tagline = tagline;
            if (this.currentBrandLogo) {
                this.brands[brandIndex].logo = this.currentBrandLogo;
            }
        }

        // Save to localStorage
        localStorage.setItem('frankBrands', JSON.stringify(this.brands));
        
        // Reload brands
        this.loadBrands();
        
        // Show success
        this.showSuccess('Brand updated successfully!');
        
        // Reset form
        document.getElementById('brandTagline').value = '';
        this.resetBrandUpload();
    }

    loadBrands() {
        const container = document.getElementById('brandsList');
        container.innerHTML = '';
        
        this.brands.forEach(brand => {
            const div = document.createElement('div');
            div.className = 'brand-item-admin';
            div.innerHTML = `
                <div class="brand-logo-admin">
                    <img src="${brand.logo}" alt="${brand.name}">
                </div>
                <div class="brand-info-admin">
                    <h4>${brand.name}</h4>
                    <p>${brand.tagline}</p>
                </div>
            `;
            container.appendChild(div);
        });
    }

    toggleClientDetails(show) {
        const section = document.getElementById('clientDetailsSection');
        section.style.display = show ? 'block' : 'none';
        
        if (show) {
            section.querySelectorAll('input').forEach(input => input.required = true);
        } else {
            section.querySelectorAll('input').forEach(input => input.required = false);
        }
    }

    scrollToSection(sectionId) {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
            
            // Update active nav
            document.querySelectorAll('.dashboard-nav a').forEach(link => {
                link.classList.remove('active');
            });
            document.querySelector(`.dashboard-nav a[href="#${sectionId}"]`).classList.add('active');
        }
    }

    showSuccess(message) {
        document.getElementById('successMessage').textContent = message;
        document.getElementById('successModal').style.display = 'flex';
    }

    showError(message) {
        alert(`Error: ${message}`);
    }

    closeAllModals() {
        document.querySelectorAll('.modal-overlay').forEach(modal => {
            modal.style.display = 'none';
        });
    }

    logout() {
        localStorage.removeItem('adminSession');
        localStorage.removeItem('sessionExpiry');
        window.location.href = 'admin-login.html';
    }

    setupSessionTimer() {
        const updateTimer = () => {
            const expiryTime = localStorage.getItem('sessionExpiry');
            if (!expiryTime) return;

            const timeLeft = parseInt(expiryTime) - Date.now();
            if (timeLeft <= 0) {
                this.logout();
                return;
            }

            const minutes = Math.floor(timeLeft / 60000);
            const seconds = Math.floor((timeLeft % 60000) / 1000);
            
            const timerElement = document.getElementById('sessionTimer');
            if (timerElement) {
                timerElement.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
            }
        };

        // Update every second
        setInterval(updateTimer, 1000);
        updateTimer(); // Initial call
    }

    viewClient(clientId) {
        const client = this.eliteClients.find(c => c.id === clientId);
        if (client) {
            alert(`Client Details:\nName: ${client.name}\nEmail: ${client.email}\nPhone: ${client.phone}\nCar: ${client.carBrand} ${client.carModel}\nAmount: KSh ${parseInt(client.amount).toLocaleString()}`);
        }
    }

    removeClient(clientId) {
        if (confirm('Remove this client from elite list?')) {
            this.eliteClients = this.eliteClients.filter(c => c.id !== clientId);
            localStorage.setItem('frankEliteClients', JSON.stringify(this.eliteClients));
            this.setupDataTables();
            this.updateStats();
            this.showSuccess('Client removed from elite list!');
        }
    }
}

// Initialize the dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.adminDashboard = new AdminDashboard();
});

// ===== SOUND MANAGEMENT =====
setupSoundManagement() {
    this.loadSounds();
    this.setupSoundForm();
}

loadSounds() {
    const sounds = JSON.parse(localStorage.getItem('soundChallengeSounds')) || [];
    const container = document.getElementById('soundsGrid');
    const countElement = document.getElementById('soundsCount');
    
    if (!container) return;
    
    container.innerHTML = '';
    if (countElement) countElement.textContent = sounds.length;
    
    if (sounds.length === 0) {
        container.innerHTML = `
            <div class="no-sounds" style="grid-column: 1 / -1; text-align: center; padding: 40px; color: #8a8f98;">
                <i class="fas fa-volume-mute" style="font-size: 3rem; margin-bottom: 15px;"></i>
                <p>No sounds added yet</p>
            </div>
        `;
        return;
    }
    
    sounds.forEach(sound => {
        const soundCard = document.createElement('div');
        soundCard.className = 'sound-item';
        soundCard.innerHTML = `
            <div class="sound-header">
                <div class="sound-title">${sound.name || 'Unnamed'}</div>
                <div class="sound-badge">${sound.difficulty || 'medium'}</div>
            </div>
            <div class="sound-details">
                <p><strong>Brand:</strong> ${sound.brand || 'N/A'}</p>
                <p><strong>Engine:</strong> ${sound.engine || 'N/A'}</p>
                <p><strong>Category:</strong> ${sound.category || 'N/A'}</p>
                <p><strong>Points:</strong> ${sound.points || 10}</p>
                <p><strong>Hints:</strong> ${sound.hints?.join(', ') || 'None'}</p>
            </div>
            <div class="sound-actions">
                <button class="btn-play-sound" onclick="window.adminDashboard.playSound('${sound.id}')">
                    <i class="fas fa-play"></i> Play
                </button>
                <button class="btn-edit-sound" onclick="window.adminDashboard.editSound('${sound.id}')">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="btn-delete-sound" onclick="window.adminDashboard.deleteSound('${sound.id}')">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        `;
        container.appendChild(soundCard);
    });
}

setupSoundForm() {
    const form = document.getElementById('addSoundForm');
    if (!form) return;
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.saveSound();
    });
    
    // File upload
    const fileInput = document.getElementById('soundFile');
    if (fileInput) {
        fileInput.addEventListener('change', (e) => {
            this.handleSoundFileUpload(e.target.files[0]);
        });
    }
}

handleSoundFileUpload(file) {
    if (!file || !file.type.startsWith('audio/')) {
        this.showError('Please select a valid audio file (MP3, WAV, etc.)');
        return;
    }
    
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
        this.showError('File size must be less than 5MB');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
        this.currentSoundFile = {
            name: file.name,
            type: file.type,
            data: e.target.result,
            size: file.size
        };
        
        const uploadZone = document.getElementById('soundUploadZone');
        if (uploadZone) {
            uploadZone.innerHTML = `
                <i class="fas fa-check-circle" style="color: #00FF9D; font-size: 2rem;"></i>
                <p style="margin: 10px 0;">${file.name}</p>
                <p class="file-size" style="color: #8a8f98;">${(file.size / 1024 / 1024).toFixed(2)} MB</p>
                <button type="button" class="btn-browse" onclick="window.adminDashboard.resetSoundUpload()">
                    Change File
                </button>
            `;
        }
    };
    reader.readAsDataURL(file);
}

resetSoundUpload() {
    const uploadZone = document.getElementById('soundUploadZone');
    if (uploadZone) {
        uploadZone.innerHTML = `
            <i class="fas fa-cloud-upload-alt"></i>
            <p>Upload MP3 file (Max: 5MB)</p>
            <button type="button" class="btn-browse" onclick="document.getElementById('soundFile').click()">
                Browse Files
            </button>
        `;
    }
    this.currentSoundFile = null;
}

saveSound() {
    const name = document.getElementById('soundName')?.value;
    const brand = document.getElementById('soundBrand')?.value;
    const engine = document.getElementById('soundEngine')?.value;
    const category = document.getElementById('soundCategory')?.value;
    const difficulty = document.getElementById('soundDifficulty')?.value;
    const points = parseInt(document.getElementById('soundPoints')?.value) || 10;
    const hintsInput = document.getElementById('soundHints')?.value || '';
    const hints = hintsInput.split(',').map(h => h.trim()).filter(h => h.length > 0);
    
    // Validate required fields
    if (!name || !brand || !category || !difficulty) {
        this.showError('Please fill in all required fields (Name, Brand, Category, Difficulty)');
        return;
    }
    
    if (!this.currentSoundFile) {
        this.showError('Please upload a sound file');
        return;
    }
    
    // Create sound object
    const soundId = this.currentSoundId || 'sound_' + Date.now() + Math.random().toString(36).substr(2, 9);
    
    const newSound = {
        id: soundId,
        name,
        brand,
        engine,
        category,
        difficulty,
        points,
        hints,
        soundUrl: this.currentSoundFile.data,
        createdAt: new Date().toISOString(),
        fileName: this.currentSoundFile.name,
        fileSize: this.currentSoundFile.size
    };
    
    // Save to localStorage
    const sounds = JSON.parse(localStorage.getItem('soundChallengeSounds')) || [];
    
    if (this.currentSoundId) {
        // Update existing sound
        const index = sounds.findIndex(s => s.id === this.currentSoundId);
        if (index !== -1) {
            sounds[index] = newSound;
        }
    } else {
        // Add new sound
        sounds.push(newSound);
    }
    
    localStorage.setItem('soundChallengeSounds', JSON.stringify(sounds));
    
    // Reload sounds
    this.loadSounds();
    
    // Reset form
    this.resetSoundForm();
    
    // Show success
    this.showSuccess(`Sound ${this.currentSoundId ? 'updated' : 'added'} successfully!`);
}

resetSoundForm() {
    const form = document.getElementById('addSoundForm');
    if (form) {
        form.reset();
    }
    this.resetSoundUpload();
    this.currentSoundId = null;
    
    // Reset button text
    const saveBtn = form?.querySelector('.btn-save');
    if (saveBtn) {
        saveBtn.innerHTML = '<i class="fas fa-save"></i> Save Sound';
    }
}

playSound(soundId) {
    const sounds = JSON.parse(localStorage.getItem('soundChallengeSounds')) || [];
    const sound = sounds.find(s => s.id === soundId);
    
    if (!sound || !sound.soundUrl) {
        this.showError('Sound not found or no audio data');
        return;
    }
    
    const audio = new Audio(sound.soundUrl);
    audio.volume = 0.7;
    audio.play().catch(error => {
        console.error('Error playing sound:', error);
        this.showError('Could not play sound. Make sure the audio file is valid.');
    });
}

editSound(soundId) {
    const sounds = JSON.parse(localStorage.getItem('soundChallengeSounds')) || [];
    const sound = sounds.find(s => s.id === soundId);
    
    if (!sound) {
        this.showError('Sound not found');
        return;
    }
    
    // Populate form
    document.getElementById('soundName').value = sound.name || '';
    document.getElementById('soundBrand').value = sound.brand || '';
    document.getElementById('soundEngine').value = sound.engine || '';
    document.getElementById('soundCategory').value = sound.category || '';
    document.getElementById('soundDifficulty').value = sound.difficulty || 'medium';
    document.getElementById('soundPoints').value = sound.points || 10;
    document.getElementById('soundHints').value = sound.hints?.join(', ') || '';
    
    // Set current sound for update
    this.currentSoundId = soundId;
    
    // Update upload zone to show current file
    const uploadZone = document.getElementById('soundUploadZone');
    if (uploadZone && sound.fileName) {
        uploadZone.innerHTML = `
            <i class="fas fa-check-circle" style="color: #00FF9D;"></i>
            <p>${sound.fileName}</p>
            <p class="file-size">${sound.fileSize ? (sound.fileSize / 1024 / 1024).toFixed(2) + ' MB' : 'File loaded'}</p>
            <button type="button" class="btn-browse" onclick="window.adminDashboard.resetSoundUpload()">
                Change File
            </button>
        `;
    }
    
    // Update button text
    const saveBtn = document.querySelector('#addSoundForm .btn-save');
    if (saveBtn) {
        saveBtn.innerHTML = '<i class="fas fa-save"></i> Update Sound';
    }
    
    // Scroll to form
    this.scrollToSection('sound-management');
}

deleteSound(soundId) {
    if (!confirm('Are you sure you want to delete this sound? This action cannot be undone.')) return;
    
    let sounds = JSON.parse(localStorage.getItem('soundChallengeSounds')) || [];
    sounds = sounds.filter(s => s.id !== soundId);
    
    localStorage.setItem('soundChallengeSounds', JSON.stringify(sounds));
    this.loadSounds();
    
    this.showSuccess('Sound deleted successfully!');
}

init() {
    if (!this.checkAuth()) return;
    this.setupEventListeners();
    this.loadDashboardData();
    this.setupDataTables();
    this.loadBrands();
    this.setupImageUpload();
    this.updateStats();
    this.setupSessionTimer();
    this.setupSoundManagement(); // <-- ADD THIS LINE
}

constructor() {
    this.cars = JSON.parse(localStorage.getItem('frankCars')) || [];
    this.brands = JSON.parse(localStorage.getItem('frankBrands')) || this.getDefaultBrands();
    this.eliteClients = JSON.parse(localStorage.getItem('frankEliteClients')) || [];
    this.currentCarId = null;
    this.maxImages = 3;
    this.uploadedImages = [];
    this.currentBrandLogo = null;
    
    // Add these for sound management
    this.currentSoundFile = null;
    this.currentSoundId = null;
    
    this.init();

}



// ===== QUICK FIX FOR ADD CAR BUTTON =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('Admin Dashboard Add Car Fix Loaded');
    
    // 1. Fix Add Car Button
    const addCarBtn = document.getElementById('addCarBtn');
    if (addCarBtn) {
        console.log('✅ Found Add Car Button');
        
        addCarBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('🎯 Add Car Button Clicked!');
            
            const modal = document.getElementById('addCarModal');
            if (modal) {
                // Show modal
                modal.style.display = 'flex';
                modal.style.opacity = '1';
                modal.style.visibility = 'visible';
                
                // Add animation
                modal.style.animation = 'fadeIn 0.3s ease';
                
                // Prevent body scroll
                document.body.style.overflow = 'hidden';
                
                console.log('✅ Modal opened successfully');
            } else {
                console.error('❌ Modal not found!');
                alert('Error: Modal not found. Check console.');
            }
        });
        
        // Add visual indicator
        addCarBtn.style.position = 'relative';
    } else {
        console.error('❌ Add Car Button not found! Check HTML id="addCarBtn"');
    }
    
    // 2. Fix Close Modal Buttons
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', function() {
            console.log('🔒 Closing modal');
            document.querySelectorAll('.modal-overlay').forEach(modal => {
                modal.style.display = 'none';
                modal.style.opacity = '0';
                modal.style.visibility = 'hidden';
            });
            document.body.style.overflow = '';
        });
    });
    
    // 3. Close modal when clicking outside
    document.querySelectorAll('.modal-overlay').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.style.display = 'none';
                document.body.style.overflow = '';
            }
        });
    });
    
    // 4. Escape key to close
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal-overlay').forEach(modal => {
                modal.style.display = 'none';
            });
            document.body.style.overflow = '';
        }
    });
    
    // 5. Debug: Add test button
    const debugBtn = document.createElement('button');
    debugBtn.textContent = '🚀 TEST MODAL';
    debugBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #00FF9D;
        color: #000;
        padding: 10px 20px;
        border: none;
        border-radius: 5px;
        font-weight: bold;
        z-index: 9999;
        cursor: pointer;
    `;
    debugBtn.addEventListener('click', function() {
        const modal = document.getElementById('addCarModal');
        if (modal) {
            modal.style.display = 'flex';
            console.log('Test: Modal opened via debug button');
        }
    });
    document.body.appendChild(debugBtn);
    
    console.log('🎉 Add Car fix installed successfully');
});

// Add CSS for modal if missing
const style = document.createElement('style');
style.textContent = `
    .modal-overlay {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.85);
        backdrop-filter: blur(5px);
        z-index: 9999;
        align-items: center;
        justify-content: center;
        padding: 20px;
        box-sizing: border-box;
        opacity: 0;
        transition: opacity 0.3s ease;
    }
    
    .modal-overlay[style*="display: flex"] {
        opacity: 1;
    }
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    .modal-content {
        animation: fadeIn 0.3s ease;
        max-width: 90%;
        max-height: 90vh;
        overflow-y: auto;
    }
`;
document.head.appendChild(style);  
