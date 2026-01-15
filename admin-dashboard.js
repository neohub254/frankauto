/**
 * FRANK AUTO DEALS - Admin Dashboard
 * Complete Management System for Cars, Brands, Elite Clients, and Sound Challenge
 */

class AdminDashboard {
    constructor() {
        // Initialize data from localStorage
        this.cars = JSON.parse(localStorage.getItem('frankCars')) || [];
        this.brands = JSON.parse(localStorage.getItem('frankBrands')) || this.getDefaultBrands();
        this.eliteClients = JSON.parse(localStorage.getItem('frankEliteClients')) || [];
        this.sounds = JSON.parse(localStorage.getItem('soundChallengeSounds')) || [];
        
        // Current state
        this.currentCarId = null;
        this.currentSoundId = null;
        this.maxImages = 3;
        this.uploadedImages = [];
        this.currentBrandLogo = null;
        this.currentSoundFile = null;
        
        // Initialize
        this.init();
    }

    init() {
        console.log('🚀 Initializing Admin Dashboard...');
        
        if (!this.checkAuth()) return;
        
        this.setupEventListeners();
        this.loadDashboardData();
        this.setupDataTables();
        this.loadBrands();
        this.setupImageUpload();
        this.updateStats();
        this.setupSessionTimer();
        this.setupSoundManagement();
        
        console.log('✅ Admin Dashboard initialized successfully');
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
        console.log('🔧 Setting up event listeners...');
        
        // Navigation
        document.querySelectorAll('.dashboard-nav a').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = e.target.closest('a').getAttribute('href').substring(1);
                this.scrollToSection(target);
                
                // Update active nav
                document.querySelectorAll('.dashboard-nav li').forEach(li => {
                    li.classList.remove('active');
                });
                link.closest('li').classList.add('active');
            });
        });

        // ========== CAR MANAGEMENT ==========
        // Add Car Button - FIXED
        const addCarBtn = document.getElementById('addCarBtn');
        if (addCarBtn) {
            console.log('✅ Found Add Car Button');
            addCarBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('🎯 Add Car Button clicked');
                this.openAddCarModal();
            });
            
            // Add visual feedback
            addCarBtn.style.cursor = 'pointer';
            addCarBtn.addEventListener('mouseenter', () => {
                addCarBtn.style.transform = 'translateY(-2px)';
            });
            addCarBtn.addEventListener('mouseleave', () => {
                addCarBtn.style.transform = 'translateY(0)';
            });
        } else {
            console.error('❌ Add Car Button not found!');
        }

        // Save Car Form
        document.getElementById('carForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveCar();
        });

        // Car Status Change
        document.getElementById('carStatus').addEventListener('change', (e) => {
            this.toggleClientDetails(e.target.value === 'sold');
        });

        // Car Image Upload
        document.getElementById('carImagesInput').addEventListener('change', (e) => {
            this.handleCarImageUpload(e.target.files);
        });

        // ========== BRAND MANAGEMENT ==========
        // Brand Logo Upload
        document.getElementById('brandLogoInput').addEventListener('change', (e) => {
            this.handleBrandLogoUpload(e.target.files[0]);
        });

        document.getElementById('saveBrandBtn').addEventListener('click', () => {
            this.saveBrand();
        });

        // ========== SOUND MANAGEMENT ==========
        // Add Sound Button
        const addSoundBtn = document.getElementById('addSoundBtn');
        if (addSoundBtn) {
            addSoundBtn.addEventListener('click', () => {
                this.scrollToSection('sound-management');
            });
        }

        // Sound Form
        document.getElementById('addSoundForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveSound();
        });

        // Sound File Upload
        document.getElementById('soundFile').addEventListener('change', (e) => {
            this.handleSoundFileUpload(e.target.files[0]);
        });

        // ========== GENERAL ==========
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

        // Close modal when clicking outside
        document.querySelectorAll('.modal-overlay').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeAllModals();
                }
            });
        });

        // Escape key to close modals
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAllModals();
            }
        });

        console.log('✅ Event listeners setup complete');
    }

    getDefaultBrands() {
        return [
            { 
                id: 'bmw', 
                name: 'BMW', 
                tagline: 'The Ultimate Driving Machine', 
                logo: 'assets/images/logos/bmw.png',
                cars: [] // Store cars for this brand
            },
            { 
                id: 'mercedes', 
                name: 'Mercedes-Benz', 
                tagline: 'The Best or Nothing', 
                logo: 'assets/images/logos/mercedes.png',
                cars: []
            },
            { 
                id: 'toyota', 
                name: 'Toyota', 
                tagline: 'Reliability Redefined', 
                logo: 'assets/images/logos/toyota.png',
                cars: []
            },
            { 
                id: 'porsche', 
                name: 'Porsche', 
                tagline: 'There is No Substitute', 
                logo: 'assets/images/logos/porsche.png',
                cars: []
            },
            { 
                id: 'range-rover', 
                name: 'Range Rover', 
                tagline: 'Above and Beyond', 
                logo: 'assets/images/logos/range-rover.png',
                cars: []
            },
            { 
                id: 'ford', 
                name: 'Ford', 
                tagline: 'Built Ford Tough', 
                logo: 'assets/images/logos/ford.png',
                cars: []
            },
            { 
                id: 'nissan', 
                name: 'Nissan', 
                tagline: 'Innovation that excites', 
                logo: 'assets/images/logos/nissan.png',
                cars: []
            },
            { 
                id: 'lexus', 
                name: 'Lexus', 
                tagline: 'The Pursuit of Perfection', 
                logo: 'assets/images/logos/lexus.png',
                cars: []
            },
            { 
                id: 'audi', 
                name: 'Audi', 
                tagline: 'Vorsprung durch Technik', 
                logo: 'assets/images/logos/audi.png',
                cars: []
            },
            { 
                id: 'mitsubishi', 
                name: 'Mitsubishi', 
                tagline: 'Drive your Ambition', 
                logo: 'assets/images/logos/mitsubishi.png',
                cars: []
            },
            { 
                id: 'subaru', 
                name: 'Subaru', 
                tagline: 'Confidence in Motion', 
                logo: 'assets/images/logos/subaru.png',
                cars: []
            },
            { 
                id: 'jeep', 
                name: 'Jeep', 
                tagline: 'Go Anywhere, Do Anything', 
                logo: 'assets/images/logos/jeep.png',
                cars: []
            }
        ];
    }

    loadDashboardData() {
        this.updateStats();
        this.populateBrandSelect();
        this.organizeCarsByBrand(); // Organize cars into their respective brands
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
        if (!select) return;
        
        select.innerHTML = '<option value="">Select Brand</option>';
        
        this.brands.forEach(brand => {
            const option = document.createElement('option');
            option.value = brand.id;
            option.textContent = brand.name;
            select.appendChild(option);
        });
    }

    organizeCarsByBrand() {
        // Clear existing car arrays in brands
        this.brands.forEach(brand => {
            brand.cars = [];
        });

        // Organize cars by brand
        this.cars.forEach(car => {
            const brand = this.brands.find(b => b.id === car.brand);
            if (brand) {
                brand.cars.push(car);
            }
        });

        // Save updated brands to localStorage
        localStorage.setItem('frankBrands', JSON.stringify(this.brands));
    }

    setupDataTables() {
        // Destroy existing tables if they exist
        if ($.fn.DataTable.isDataTable('#carsTable')) {
            $('#carsTable').DataTable().destroy();
        }
        
        if ($.fn.DataTable.isDataTable('#clientsTable')) {
            $('#clientsTable').DataTable().destroy();
        }

        // Cars Table
        this.carsTable = $('#carsTable').DataTable({
            data: this.cars,
            columns: [
                { 
                    data: 'id',
                    render: (data) => data.substring(0, 8) + '...'
                },
                { 
                    data: 'images',
                    render: (data) => {
                        if (data && data.length > 0) {
                            return `<img src="${data[0]}" alt="Car Image" class="car-image" style="width: 60px; height: 40px; object-fit: cover; border-radius: 4px;">`;
                        }
                        return '<i class="fas fa-car" style="font-size: 24px; color: #ccc;"></i>';
                    }
                },
                { 
                    data: 'brand',
                    render: (data) => {
                        const brand = this.brands.find(b => b.id === data);
                        return brand ? brand.name : data;
                    }
                },
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
                                <button class="action-btn sold" onclick="adminDashboard.markAsSold('${row.id}')" ${row.status === 'sold' ? 'disabled style="opacity:0.5"' : ''}>
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
            },
            createdRow: function(row, data, dataIndex) {
                // Add click handler for entire row
                $(row).attr('data-car-id', data.id);
            }
        });

        // Clients Table
        this.clientsTable = $('#clientsTable').DataTable({
            data: this.eliteClients,
            columns: [
                { 
                    data: 'id',
                    render: (data) => data.substring(0, 8) + '...'
                },
                { data: 'name' },
                { 
                    data: null,
                    render: (data) => `${data.carBrand} ${data.carModel}`
                },
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
                                <button class="action-btn view" onclick="adminDashboard.viewClient('${data.id}')">
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
        console.log('Opening Add Car Modal...');
        this.resetCarForm();
        
        const modal = document.getElementById('addCarModal');
        if (modal) {
            modal.style.display = 'flex';
            modal.style.opacity = '1';
            modal.style.visibility = 'visible';
            document.body.style.overflow = 'hidden';
            
            // Add animation
            modal.style.animation = 'fadeIn 0.3s ease';
            
            console.log('✅ Modal opened successfully');
        } else {
            console.error('❌ Modal not found');
            this.showError('Cannot open modal. Please refresh the page.');
        }
    }

    resetCarForm() {
        document.getElementById('carForm').reset();
        this.uploadedImages = [];
        this.updateUploadedImagesDisplay();
        this.currentCarId = null;
        document.getElementById('clientDetailsSection').style.display = 'none';
        
        // Reset required fields for client section
        document.querySelectorAll('#clientDetailsSection input').forEach(input => {
            input.required = false;
        });
    }

    setupImageUpload() {
        const uploadZone = document.getElementById('imageUploadZone');
        if (!uploadZone) return;
        
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

        // Click to open file dialog
        uploadZone.querySelector('.btn-upload').addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('carImagesInput').click();
        });
    }

    handleCarImageUpload(files) {
        if (!files || files.length === 0) return;
        
        const remainingSlots = this.maxImages - this.uploadedImages.length;
        if (remainingSlots <= 0) {
            this.showError(`Maximum ${this.maxImages} images allowed`);
            return;
        }
        
        const images = Array.from(files).slice(0, remainingSlots);
        
        images.forEach(file => {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    this.uploadedImages.push(e.target.result);
                    this.updateUploadedImagesDisplay();
                };
                reader.readAsDataURL(file);
            } else {
                this.showError('Please upload only image files');
            }
        });
    }

    updateUploadedImagesDisplay() {
        const container = document.getElementById('uploadedImages');
        if (!container) return;
        
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
        console.log('Saving car...');
        
        // Get form data
        const carData = {
            id: this.currentCarId || 'car_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
            images: [...this.uploadedImages],
            brand: document.getElementById('carBrandSelect').value,
            model: document.getElementById('carModel').value.trim(),
            year: document.getElementById('carYear').value,
            price: document.getElementById('carPrice').value,
            color: document.getElementById('carColor').value.trim(),
            mileage: document.getElementById('carMileage').value,
            description: document.getElementById('carDescription').value.trim(),
            engine: document.getElementById('carEngine').value.trim(),
            transmission: document.getElementById('carTransmission').value,
            fuel: document.getElementById('carFuel').value,
            seats: document.getElementById('carSeats').value,
            status: document.getElementById('carStatus').value,
            createdAt: this.currentCarId ? 
                (this.cars.find(c => c.id === this.currentCarId)?.createdAt || new Date().toISOString()) : 
                new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        // Validate required fields
        if (!carData.brand || !carData.model || !carData.year || !carData.price) {
            this.showError('Please fill in all required fields: Brand, Model, Year, and Price');
            return;
        }

        // Validate images
        if (carData.images.length === 0) {
            this.showError('Please upload at least one image');
            return;
        }

        // If sold, add to elite clients
        if (carData.status === 'sold') {
            const clientData = {
                id: 'client_' + Date.now(),
                name: document.getElementById('clientName').value.trim() || 'VIP Client',
                email: document.getElementById('clientEmail').value.trim() || '',
                phone: document.getElementById('clientPhone').value.trim() || '',
                carBrand: this.brands.find(b => b.id === carData.brand)?.name || carData.brand,
                carModel: carData.model,
                purchaseDate: new Date().toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                }),
                amount: carData.price,
                status: 'Active'
            };
            
            // Only add if not already in list
            if (!this.eliteClients.some(c => 
                c.name === clientData.name && 
                c.carModel === clientData.carModel
            )) {
                this.eliteClients.push(clientData);
                localStorage.setItem('frankEliteClients', JSON.stringify(this.eliteClients));
            }
        }

        // Update or add car
        if (this.currentCarId) {
            const index = this.cars.findIndex(c => c.id === this.currentCarId);
            if (index !== -1) {
                this.cars[index] = { ...this.cars[index], ...carData };
                console.log('Updated existing car:', carData.id);
            }
        } else {
            this.cars.push(carData);
            console.log('Added new car:', carData.id);
        }

        // Save to localStorage
        localStorage.setItem('frankCars', JSON.stringify(this.cars));
        
        // Organize cars by brand
        this.organizeCarsByBrand();
        
        // Update tables
        this.setupDataTables();
        this.updateStats();
        
        // Show success message
        this.showSuccess('Car saved successfully!');
        
        // Close modal
        this.closeAllModals();
    }

    editCar(carId) {
        console.log('Editing car:', carId);
        const car = this.cars.find(c => c.id === carId);
        if (!car) {
            this.showError('Car not found');
            return;
        }

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
        
        this.openAddCarModal();
        
        // Scroll to top of modal
        document.querySelector('.modal-content').scrollTop = 0;
    }

    markAsSold(carId) {
        if (!confirm('Mark this car as sold? This will move it to elite clients.')) return;
        
        const car = this.cars.find(c => c.id === carId);
        if (!car) {
            this.showError('Car not found');
            return;
        }
        
        car.status = 'sold';
        
        // Add to elite clients
        const clientData = {
            id: 'client_' + Date.now(),
            name: 'VIP Client',
            email: '',
            phone: '',
            carBrand: this.brands.find(b => b.id === car.brand)?.name || car.brand,
            carModel: car.model,
            purchaseDate: new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }),
            amount: car.price,
            status: 'Active'
        };
        
        this.eliteClients.push(clientData);
        
        // Save to localStorage
        localStorage.setItem('frankCars', JSON.stringify(this.cars));
        localStorage.setItem('frankEliteClients', JSON.stringify(this.eliteClients));
        
        // Organize cars by brand
        this.organizeCarsByBrand();
        
        // Update tables
        this.setupDataTables();
        this.updateStats();
        
        this.showSuccess('Car marked as sold and added to elite clients!');
    }

    deleteCar(carId) {
        if (!confirm('Are you sure you want to delete this car? This action cannot be undone.')) return;
        
        this.cars = this.cars.filter(c => c.id !== carId);
        localStorage.setItem('frankCars', JSON.stringify(this.cars));
        
        // Organize cars by brand
        this.organizeCarsByBrand();
        
        // Update tables
        this.setupDataTables();
        this.updateStats();
        
        this.showSuccess('Car deleted successfully!');
    }

    handleBrandLogoUpload(file) {
        if (!file || !file.type.startsWith('image/')) {
            this.showError('Please select a valid image file');
            return;
        }

        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            this.showError('Image size must be less than 5MB');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const uploadZone = document.getElementById('brandUploadZone');
            uploadZone.innerHTML = `
                <img src="${e.target.result}" style="max-width: 100px; max-height: 100px; margin-bottom: 15px; border-radius: 5px;">
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
        const uploadZone = document.getElementById('brandUploadZone');
        uploadZone.innerHTML = `
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
        const tagline = document.getElementById('brandTagline').value.trim();
        
        if (!brandId) {
            this.showError('Please select a brand');
            return;
        }

        if (!tagline) {
            this.showError('Please enter a brand tagline');
            return;
        }

        // Update brand
        const brandIndex = this.brands.findIndex(b => b.id === brandId);
        if (brandIndex !== -1) {
            this.brands[brandIndex].tagline = tagline;
            if (this.currentBrandLogo) {
                this.brands[brandIndex].logo = this.currentBrandLogo;
            }
        } else {
            // Create new brand if not exists
            this.brands.push({
                id: brandId,
                name: brandId.charAt(0).toUpperCase() + brandId.slice(1),
                tagline: tagline,
                logo: this.currentBrandLogo || `assets/images/logos/${brandId}.png`,
                cars: []
            });
        }

        // Save to localStorage
        localStorage.setItem('frankBrands', JSON.stringify(this.brands));
        
        // Reload brands
        this.loadBrands();
        
        // Show success
        this.showSuccess('Brand saved successfully!');
        
        // Reset form
        document.getElementById('brandTagline').value = '';
        this.resetBrandUpload();
    }

    loadBrands() {
        const container = document.getElementById('brandsList');
        if (!container) return;
        
        container.innerHTML = '';
        
        this.brands.forEach(brand => {
            const div = document.createElement('div');
            div.className = 'brand-item-admin';
            div.innerHTML = `
                <div class="brand-logo-admin">
                    <img src="${brand.logo}" alt="${brand.name}" onerror="this.src='https://via.placeholder.com/60x60/333/fff?text=${brand.name.charAt(0)}'">
                </div>
                <div class="brand-info-admin">
                    <h4>${brand.name}</h4>
                    <p>${brand.tagline}</p>
                    <small>Cars in stock: ${brand.cars ? brand.cars.length : 0}</small>
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

    viewClient(clientId) {
        const client = this.eliteClients.find(c => c.id === clientId);
        if (client) {
            const details = `
                Client Details:
                ──────────────
                Name: ${client.name}
                Email: ${client.email || 'Not provided'}
                Phone: ${client.phone || 'Not provided'}
                Car: ${client.carBrand} ${client.carModel}
                Purchase Date: ${client.purchaseDate}
                Amount: KSh ${parseInt(client.amount).toLocaleString()}
                Status: ${client.status}
            `;
            alert(details);
        }
    }

    removeClient(clientId) {
        if (!confirm('Remove this client from elite list?')) return;
        
        this.eliteClients = this.eliteClients.filter(c => c.id !== clientId);
        localStorage.setItem('frankEliteClients', JSON.stringify(this.eliteClients));
        this.setupDataTables();
        this.updateStats();
        this.showSuccess('Client removed from elite list!');
    }

    scrollToSection(sectionId) {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
            });
        }
    }

    showSuccess(message) {
        const successModal = document.getElementById('successModal');
        const messageElement = document.getElementById('successMessage');
        
        if (successModal && messageElement) {
            messageElement.textContent = message;
            successModal.style.display = 'flex';
            
            // Auto-close after 3 seconds
            setTimeout(() => {
                successModal.style.display = 'none';
            }, 3000);
        } else {
            alert('Success: ' + message);
        }
    }

    showError(message) {
        alert('Error: ' + message);
    }

    closeAllModals() {
        document.querySelectorAll('.modal-overlay').forEach(modal => {
            modal.style.display = 'none';
        });
        document.body.style.overflow = '';
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

    // ===== SOUND MANAGEMENT =====
    setupSoundManagement() {
        this.loadSounds();
        this.setupSoundForm();
    }

    loadSounds() {
        const container = document.getElementById('soundsGrid');
        const countElement = document.getElementById('soundsCount');
        
        if (!container) return;
        
        container.innerHTML = '';
        if (countElement) countElement.textContent = this.sounds.length;
        
        if (this.sounds.length === 0) {
            container.innerHTML = `
                <div class="no-sounds" style="grid-column: 1 / -1; text-align: center; padding: 40px; color: #8a8f98;">
                    <i class="fas fa-volume-mute" style="font-size: 3rem; margin-bottom: 15px;"></i>
                    <p>No sounds added yet</p>
                    <button class="btn-browse" onclick="adminDashboard.scrollToSection('sound-management')">
                        Add First Sound
                    </button>
                </div>
            `;
            return;
        }
        
        this.sounds.forEach(sound => {
            const soundCard = document.createElement('div');
            soundCard.className = 'sound-item';
            soundCard.innerHTML = `
                <div class="sound-header">
                    <div class="sound-title">${sound.name || 'Unnamed'}</div>
                    <div class="sound-badge ${sound.difficulty || 'medium'}">${sound.difficulty || 'medium'}</div>
                </div>
                <div class="sound-details">
                    <p><strong>Brand:</strong> ${sound.brand || 'N/A'}</p>
                    <p><strong>Engine:</strong> ${sound.engine || 'N/A'}</p>
                    <p><strong>Category:</strong> ${sound.category || 'N/A'}</p>
                    <p><strong>Points:</strong> ${sound.points || 10}</p>
                    <p><strong>Hints:</strong> ${sound.hints?.join(', ') || 'None'}</p>
                </div>
                <div class="sound-actions">
                    <button class="btn-play-sound" onclick="adminDashboard.playSound('${sound.id}')">
                        <i class="fas fa-play"></i> Play
                    </button>
                    <button class="btn-edit-sound" onclick="adminDashboard.editSound('${sound.id}')">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn-delete-sound" onclick="adminDashboard.deleteSound('${sound.id}')">
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
        
        // Reset form button
        const cancelBtn = form.querySelector('.btn-cancel');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                this.resetSoundForm();
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
                    <button type="button" class="btn-browse" onclick="adminDashboard.resetSoundUpload()">
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
        const name = document.getElementById('soundName').value.trim();
        const brand = document.getElementById('soundBrand').value.trim();
        const engine = document.getElementById('soundEngine').value.trim();
        const category = document.getElementById('soundCategory').value;
        const difficulty = document.getElementById('soundDifficulty').value;
        const points = parseInt(document.getElementById('soundPoints').value) || 10;
        const hintsInput = document.getElementById('soundHints').value.trim() || '';
        const hints = hintsInput.split(',').map(h => h.trim()).filter(h => h.length > 0);
        
        // Validate required fields
        if (!name || !brand || !category || !difficulty) {
            this.showError('Please fill in all required fields (Name, Brand, Category, Difficulty)');
            return;
        }
        
        if (!this.currentSoundFile && !this.currentSoundId) {
            this.showError('Please upload a sound file');
            return;
        }
        
        // Create sound object
        const soundId = this.currentSoundId || 'sound_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        
        const newSound = {
            id: soundId,
            name,
            brand,
            engine,
            category,
            difficulty,
            points,
            hints,
            soundUrl: this.currentSoundFile ? this.currentSoundFile.data : 
                     (this.sounds.find(s => s.id === soundId)?.soundUrl || ''),
            createdAt: this.currentSoundId ? 
                     (this.sounds.find(s => s.id === soundId)?.createdAt || new Date().toISOString()) : 
                     new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            fileName: this.currentSoundFile ? this.currentSoundFile.name : 
                     (this.sounds.find(s => s.id === soundId)?.fileName || ''),
            fileSize: this.currentSoundFile ? this.currentSoundFile.size : 
                     (this.sounds.find(s => s.id === soundId)?.fileSize || 0)
        };
        
        // Save to localStorage
        if (this.currentSoundId) {
            // Update existing sound
            const index = this.sounds.findIndex(s => s.id === this.currentSoundId);
            if (index !== -1) {
                this.sounds[index] = newSound;
            }
        } else {
            // Add new sound
            this.sounds.push(newSound);
        }
        
        localStorage.setItem('soundChallengeSounds', JSON.stringify(this.sounds));
        
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
        this.currentSoundFile = null;
        
        // Reset button text
        const saveBtn = document.querySelector('#addSoundForm .btn-save');
        if (saveBtn) {
            saveBtn.innerHTML = '<i class="fas fa-save"></i> Save Sound';
        }
    }

    playSound(soundId) {
        const sound = this.sounds.find(s => s.id === soundId);
        
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
        const sound = this.sounds.find(s => s.id === soundId);
        
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
        if (uploadZone) {
            if (sound.fileName) {
                uploadZone.innerHTML = `
                    <i class="fas fa-check-circle" style="color: #00FF9D;"></i>
                    <p>${sound.fileName}</p>
                    <p class="file-size">${sound.fileSize ? (sound.fileSize / 1024 / 1024).toFixed(2) + ' MB' : 'File loaded'}</p>
                    <button type="button" class="btn-browse" onclick="adminDashboard.resetSoundUpload()">
                        Change File
                    </button>
                `;
            }
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
        
        this.sounds = this.sounds.filter(s => s.id !== soundId);
        localStorage.setItem('soundChallengeSounds', JSON.stringify(this.sounds));
        this.loadSounds();
        this.showSuccess('Sound deleted successfully!');
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('📋 DOM Content Loaded - Starting Admin Dashboard');
    
    // Create global reference
    window.adminDashboard = new AdminDashboard();
    
    // Add emergency debug button
    const debugBtn = document.createElement('button');
    debugBtn.innerHTML = '🐛 DEBUG';
    debugBtn.style.cssText = `
        position: fixed;
        bottom: 70px;
        right: 20px;
        background: #ff4444;
        color: white;
        padding: 8px 15px;
        border: none;
        border-radius: 5px;
        font-size: 12px;
        font-weight: bold;
        z-index: 9999;
        cursor: pointer;
        opacity: 0.8;
        transition: opacity 0.3s;
    `;
    debugBtn.addEventListener('click', () => {
        console.log('=== DEBUG INFO ===');
        console.log('Cars:', window.adminDashboard.cars.length);
        console.log('Brands:', window.adminDashboard.brands.length);
        console.log('Clients:', window.adminDashboard.eliteClients.length);
        console.log('Sounds:', window.adminDashboard.sounds.length);
        console.log('Current Car ID:', window.adminDashboard.currentCarId);
        console.log('Uploaded Images:', window.adminDashboard.uploadedImages.length);
        console.log('LocalStorage Keys:', Object.keys(localStorage));
        alert('Check console for debug info');
    });
    document.body.appendChild(debugBtn);
    
    console.log('🎉 Admin Dashboard Ready!');
});

// Add CSS styles for modals if needed
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-20px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    .modal-overlay {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        backdrop-filter: blur(5px);
        z-index: 9998;
        align-items: center;
        justify-content: center;
        padding: 20px;
        box-sizing: border-box;
    }
    
    .modal-content {
        background: #1a1a2e;
        border-radius: 10px;
        padding: 30px;
        max-width: 800px;
        width: 100%;
        max-height: 90vh;
        overflow-y: auto;
        animation: fadeIn 0.3s ease;
        border: 1px solid #00FF9D33;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
    }
    
    .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 25px;
        padding-bottom: 15px;
        border-bottom: 1px solid #333;
    }
    
    .modal-header h3 {
        color: #00FF9D;
        margin: 0;
        font-size: 1.5rem;
    }
    
    .close-modal {
        background: none;
        border: none;
        color: #fff;
        font-size: 1.8rem;
        cursor: pointer;
        padding: 0;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: background 0.3s;
    }
    
    .close-modal:hover {
        background: rgba(255, 255, 255, 0.1);
    }
    
    .uploaded-images {
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
        margin: 15px 0;
    }
    
    .uploaded-image {
        position: relative;
        width: 100px;
        height: 100px;
        border-radius: 5px;
        overflow: hidden;
        border: 2px solid #333;
    }
    
    .uploaded-image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
    
    .remove-image {
        position: absolute;
        top: 5px;
        right: 5px;
        background: rgba(255, 0, 0, 0.8);
        color: white;
        border: none;
        width: 25px;
        height: 25px;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
    }
    
    .status-badge {
        padding: 4px 12px;
        border-radius: 20px;
        font-size: 12px;
        font-weight: bold;
        text-transform: uppercase;
        display: inline-block;
    }
    
    .status-available {
        background: rgba(0, 255, 157, 0.2);
        color: #00FF9D;
    }
    
    .status-reserved {
        background: rgba(255, 193, 7, 0.2);
        color: #FFC107;
    }
    
    .status-sold {
        background: rgba(255, 87, 87, 0.2);
        color: #FF5757;
    }
    
    .table-actions {
        display: flex;
        gap: 8px;
        justify-content: center;
    }
    
    .action-btn {
        background: none;
        border: none;
        color: #fff;
        width: 35px;
        height: 35px;
        border-radius: 5px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        transition: all 0.3s;
    }
    
    .action-btn.edit {
        background: rgba(0, 123, 255, 0.2);
        color: #007BFF;
    }
    
    .action-btn.edit:hover {
        background: rgba(0, 123, 255, 0.4);
    }
    
    .action-btn.sold {
        background: rgba(40, 167, 69, 0.2);
        color: #28A745;
    }
    
    .action-btn.sold:hover {
        background: rgba(40, 167, 69, 0.4);
    }
    
    .action-btn.delete {
        background: rgba(220, 53, 69, 0.2);
        color: #DC3545;
    }
    
    .action-btn.delete:hover {
        background: rgba(220, 53, 69, 0.4);
    }
    
    .action-btn.view {
        background: rgba(111, 66, 193, 0.2);
        color: #6F42C1;
    }
    
    .action-btn.view:hover {
        background: rgba(111, 66, 193, 0.4);
    }
    
    .brand-item-admin {
        background: rgba(255, 255, 255, 0.05);
        border-radius: 8px;
        padding: 15px;
        display: flex;
        align-items: center;
        gap: 15px;
        border: 1px solid rgba(255, 255, 255, 0.1);
        transition: transform 0.3s;
    }
    
    .brand-item-admin:hover {
        transform: translateY(-2px);
        border-color: #00FF9D;
    }
    
    .brand-logo-admin img {
        width: 60px;
        height: 60px;
        object-fit: contain;
    }
    
    .sound-item {
        background: rgba(255, 255, 255, 0.05);
        border-radius: 8px;
        padding: 20px;
        border: 1px solid rgba(255, 255, 255, 0.1);
        transition: all 0.3s;
    }
    
    .sound-item:hover {
        border-color: #00FF9D;
        transform: translateY(-2px);
    }
    
    .sound-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 15px;
    }
    
    .sound-title {
        font-weight: bold;
        font-size: 1.1rem;
        color: #fff;
    }
    
    .sound-badge {
        padding: 4px 12px;
        border-radius: 20px;
        font-size: 11px;
        font-weight: bold;
        text-transform: uppercase;
    }
    
    .sound-badge.easy {
        background: rgba(0, 255, 157, 0.2);
        color: #00FF9D;
    }
    
    .sound-badge.medium {
        background: rgba(255, 193, 7, 0.2);
        color: #FFC107;
    }
    
    .sound-badge.hard {
        background: rgba(255, 87, 87, 0.2);
        color: #FF5757;
    }
    
    .sound-actions {
        display: flex;
        gap: 10px;
        margin-top: 15px;
    }
    
    .btn-play-sound, .btn-edit-sound, .btn-delete-sound {
        flex: 1;
        padding: 8px 12px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 13px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        transition: all 0.3s;
    }
    
    .btn-play-sound {
        background: rgba(0, 123, 255, 0.2);
        color: #007BFF;
    }
    
    .btn-play-sound:hover {
        background: rgba(0, 123, 255, 0.4);
    }
    
    .btn-edit-sound {
        background: rgba(40, 167, 69, 0.2);
        color: #28A745;
    }
    
    .btn-edit-sound:hover {
        background: rgba(40, 167, 69, 0.4);
    }
    
    .btn-delete-sound {
        background: rgba(220, 53, 69, 0.2);
        color: #DC3545;
    }
    
    .btn-delete-sound:hover {
        background: rgba(220, 53, 69, 0.4);
    }
`;
document.head.appendChild(style);
