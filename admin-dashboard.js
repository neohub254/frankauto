// admin-dashboard.js - COMPLETE WORKING VERSION WITH FIREBASE
import { db, storage } from './firebase-config.js';
import { 
  collection, 
  addDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  orderBy,
  serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { 
  ref, 
  uploadBytes, 
  getDownloadURL 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";





console.log('🚀 ADMIN DASHBOARD LOADING...');
console.log('Firebase db:', db ? '✅ Connected' : '❌ Not connected');
console.log('Firebase storage:', storage ? '✅ Connected' : '❌ Not connected');

document.addEventListener('DOMContentLoaded', async function() {
    console.log('✅ DOM Loaded - Starting Admin Dashboard');
    
// ========== 1. UPDATED SESSION CHECK ==========
function checkSession() {
    console.log('🔐 Checking admin session...');
    
    // Check ALL possible session storage methods
    const sessionChecks = [
        // Method 1: Your current method
        localStorage.getItem('adminSession'),
        
        // Method 2: Check for session data from admin-login.js
        localStorage.getItem('sessionExpiry'),
        
        // Method 3: Check if admin is logged in (from login.js logic)
        JSON.parse(localStorage.getItem('adminSessionData'))?.username,
        
        // Method 4: Check for any admin-related data
        Array.from({ length: localStorage.length }, (_, i) => 
            localStorage.key(i)
        ).find(key => key.toLowerCase().includes('admin'))
    ];
    
    console.log('Session checks:', sessionChecks);
    console.log('All localStorage:');
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        console.log(`${key}: ${localStorage.getItem(key)}`);
    }
    
    // If ANY session check passes, allow access
    const hasValidSession = sessionChecks.some(check => check !== null && check !== undefined);
    
    if (hasValidSession) {
        console.log('✅ Session validated (using flexible check)');
        
        // Update admin name display if available
        const adminData = JSON.parse(localStorage.getItem('adminSessionData'));
        if (adminData && adminData.username) {
            document.getElementById('adminName').textContent = adminData.username;
        }
        
        return true;
    }
    
    // Check if coming directly from login page
    if (document.referrer.includes('admin-login.html')) {
        console.log('✅ Came directly from login page - allowing access');
        
        // Create session data for consistency
        localStorage.setItem('adminSession', 'direct_login_' + Date.now());
        localStorage.setItem('sessionExpiry', (Date.now() + 30 * 60 * 1000).toString());
        localStorage.setItem('adminSessionData', JSON.stringify({
            username: 'FrankAdmin',
            lastLogin: new Date().toISOString()
        }));
        
        return true;
    }
    
    // No valid session found
    console.log('❌ No valid session data found');
    console.log('Redirecting to login page...');
    
    // Optional: Save current URL to return here after login
    sessionStorage.setItem('returnUrl', window.location.href);
    
    window.location.href = 'admin-login.html';
    return false;
}
    // ========== 2. SETUP ALL EVENT LISTENERS ==========
    console.log('Setting up event listeners...');
    
    // A. LOGOUT BUTTON
    document.getElementById('logoutBtn').addEventListener('click', function() {
        if (confirm('Are you sure you want to logout?')) {
            localStorage.removeItem('adminSession');
            localStorage.removeItem('sessionExpiry');
            window.location.href = 'admin-login.html';
        }
    });
  
    // B. SIDEBAR NAVIGATION
    document.querySelectorAll('.admin-nav a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            
            // Update active state
            document.querySelectorAll('.admin-nav li').forEach(li => {
                li.classList.remove('active');
            });
            this.parentElement.classList.add('active');
            
            // Show section
            showSection(targetId);
        });
    });
    
    // C. QUICK ACTION BUTTONS
    document.querySelectorAll('.action-btn[data-target]').forEach(btn => {
        btn.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            showSection(targetId);
            
            // Update nav
            document.querySelectorAll('.admin-nav li').forEach(li => {
                li.classList.remove('active');
            });
            const navLink = document.querySelector(`.admin-nav a[href="#${targetId}"]`);
            if (navLink) navLink.parentElement.classList.add('active');
        });
    });
    
    // D. REFRESH DATA BUTTON
    document.getElementById('refreshData').addEventListener('click', function() {
        console.log('Refreshing data...');
        updateDashboard();
        loadCars();
        showNotification('Data refreshed!', 'success');
    });
    
    // E. CAR FORM SUBMISSION
    const carForm = document.getElementById('carUploadForm');
    if (carForm) {
        carForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            console.log('📦 Car form submitted!');
            
            try {
                // Get form data
                const formData = new FormData(carForm);
                const carData = {
                    model: formData.get('carModel'),
                    brand: formData.get('carBrand') === 'other' ? 
                           formData.get('otherBrand') : formData.get('carBrand'),
                    year: parseInt(formData.get('carYear')),
                    color: formData.get('carColor'),
                    price: parseFloat(formData.get('carPrice')),
                    mileage: formData.get('carMileage') ? parseInt(formData.get('carMileage')) : null,
                    fuelType: formData.get('carFuel'),
                    transmission: formData.get('carTransmission'),
                    description: formData.get('carDescription'),
                    status: 'available',
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp()
                };
                
                console.log('Car data:', carData);
                
                // Upload images
                const imageUrls = [];
                const imageFiles = [
                    formData.get('carImage1'),
                    formData.get('carImage2'),
                    formData.get('carImage3')
                ];
                
                for (let i = 0; i < imageFiles.length; i++) {
                    if (imageFiles[i] && imageFiles[i].size > 0) {
                        console.log(`Uploading image ${i + 1}...`);
                        const fileName = `cars/${Date.now()}_${i}_${imageFiles[i].name}`;
                        const storageRef = ref(storage, fileName);
                        await uploadBytes(storageRef, imageFiles[i]);
                        const url = await getDownloadURL(storageRef);
                        imageUrls.push(url);
                        console.log(`Image ${i + 1} uploaded:`, url);
                    }
                }
                
                carData.images = imageUrls;
                
                // Save to Firestore
                console.log('Saving to Firestore...');
                await addDoc(collection(db, 'cars'), carData);
                
                // Success
                showNotification('Car added successfully!', 'success');
                carForm.reset();
                document.querySelectorAll('.preview').forEach(img => {
                    img.src = '';
                    img.style.display = 'none';
                });
                
                // Update dashboard
                updateDashboard();
                loadCars();
                
                // Show manage cars section
                showSection('manage-cars');
                
            } catch (error) {
                console.error('Error adding car:', error);
                showNotification('Error: ' + error.message, 'error');
            }
        });
    }
    
    // F. IMAGE UPLOAD PREVIEW
    document.querySelectorAll('.image-upload-box').forEach(box => {
        const input = box.querySelector('.image-input');
        const preview = box.querySelector('.preview');
        
        box.addEventListener('click', () => input.click());
        
        input.addEventListener('change', function(e) {
            const file = e.target.files[0];
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
    
    // G. OTHER BRAND TOGGLE
    document.getElementById('carBrand').addEventListener('change', function(e) {
        const otherContainer = document.getElementById('otherBrandContainer');
        otherContainer.style.display = e.target.value === 'other' ? 'block' : 'none';
    });
    
    // H. SEARCH AND FILTER
    document.getElementById('searchCar')?.addEventListener('input', filterCars);
    document.getElementById('filterBrand')?.addEventListener('change', filterCars);
    document.getElementById('filterStatus')?.addEventListener('change', filterCars);
    
    // I. SAVE SETTINGS
    document.getElementById('saveGeneralSettings')?.addEventListener('click', function() {
        const settings = {
            companyName: document.getElementById('companyName').value,
            whatsappNumber: document.getElementById('whatsappNumber').value,
            currency: document.getElementById('currency').value,
            emailNotifications: document.getElementById('emailNotifications').checked,
            whatsappNotifications: document.getElementById('whatsappNotifications').checked,
            lowStockAlert: document.getElementById('lowStockAlert').checked
        };
        
        localStorage.setItem('adminSettings', JSON.stringify(settings));
        showNotification('Settings saved!', 'success');
    });
    
    // J. PASSWORD CHANGE
    document.getElementById('passwordForm')?.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const currentPass = document.getElementById('currentPassword').value;
        const newPass = document.getElementById('newPassword').value;
        const confirmPass = document.getElementById('confirmPassword').value;
        
        // Get stored password from localStorage (from login.js)
        const storedPass = localStorage.getItem('adminPassword') || 'FrankAuto2024!';
        
        if (currentPass !== storedPass) {
            showNotification('Current password is incorrect', 'error');
            return;
        }
        
        if (newPass !== confirmPass) {
            showNotification('New passwords do not match', 'error');
            return;
        }
        
        if (newPass.length < 8) {
            showNotification('Password must be at least 8 characters', 'error');
            return;
        }
        
        // Update password in localStorage
        localStorage.setItem('adminPassword', newPass);
        showNotification('Password changed successfully!', 'success');
        this.reset();
    });
    
    // K. PASSWORD STRENGTH
    document.getElementById('newPassword')?.addEventListener('input', function(e) {
        const strength = document.getElementById('passwordStrength');
        if (!strength) return;
        
        const password = e.target.value;
        let score = 0;
        if (password.length >= 8) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;
        
        const colors = ['#ff003c', '#ff6600', '#ffcc00', '#66cc00', '#00cc66'];
        strength.innerHTML = `
            <div class="strength-bar" style="width: ${score * 25}%; background: ${colors[score]}"></div>
        `;
    });
    
    // L. MODAL CLOSE
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', function() {
            document.getElementById('editCarModal').style.display = 'none';
        });
    });
    
    // ========== 3. INITIALIZE ==========
    console.log('Initializing dashboard...');
    
    // Start clock
    updateClock();
    setInterval(updateClock, 1000);
    
    // Load initial data
    await updateDashboard();
    await loadCars();
    
    console.log('✅ Admin Dashboard fully loaded!');
    
    // ========== 4. HELPER FUNCTIONS ==========
    
    function showSection(sectionId) {
        console.log('Showing section:', sectionId);
        
        // Hide all
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });
        
        // Show target
        const target = document.getElementById(sectionId);
        if (target) {
            target.classList.add('active');
            
            // Special actions for sections
            if (sectionId === 'manage-cars') {
                loadCars();
            }
            if (sectionId === 'settings') {
                loadSettings();
            }
        }
    }
    
    function updateClock() {
        const now = new Date();
        const timeStr = now.toLocaleTimeString();
        const dateStr = now.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        document.getElementById('currentTime').textContent = `${dateStr} | ${timeStr}`;
    }
    
    async function updateDashboard() {
        try {
            console.log('Updating dashboard stats...');
            const carsQuery = query(collection(db, 'cars'));
            const snapshot = await getDocs(carsQuery);
            const cars = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            
            // Update stats
            document.getElementById('totalCars').textContent = cars.length;
            
            const availableCars = cars.filter(car => car.status === 'available');
            document.getElementById('availableCars').textContent = availableCars.length;
            
            const soldCars = cars.filter(car => car.status === 'sold');
            document.getElementById('soldCars').textContent = soldCars.length;
            
            const totalWorth = cars.reduce((sum, car) => sum + (car.price || 0), 0);
            document.getElementById('totalWorth').textContent = `$${totalWorth.toLocaleString()}`;
            
            // Update brand chart
            updateBrandChart(cars);
            
            // Update recent activity
            updateRecentActivity(cars);
            
            console.log('✅ Dashboard updated');
            
        } catch (error) {
            console.error('Error updating dashboard:', error);
            showNotification('Error loading dashboard data', 'error');
        }
    }
    
    function updateBrandChart(cars) {
        const brandCounts = {};
        cars.forEach(car => {
            brandCounts[car.brand] = (brandCounts[car.brand] || 0) + 1;
        });
        
        const chart = document.getElementById('brandChart');
        if (!chart) return;
        
        let html = '';
        Object.entries(brandCounts).forEach(([brand, count]) => {
            const percent = (count / cars.length) * 100;
            html += `
                <div class="brand-row">
                    <span>${brand.toUpperCase()}</span>
                    <div class="bar"><div class="fill" style="width: ${percent}%"></div></div>
                    <span>${count}</span>
                </div>
            `;
        });
        chart.innerHTML = html;
    }
    
    function updateRecentActivity(cars) {
        const activityList = document.getElementById('activityList');
        if (!activityList) return;
        
        const recent = [...cars]
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 5);
        
        activityList.innerHTML = recent.map(car => `
            <div class="activity-item">
                <i class="fas fa-car ${car.status === 'available' ? 'available' : 'sold'}"></i>
                <div>
                    <strong>${car.brand} ${car.model}</strong>
                    <small>${new Date(car.createdAt).toLocaleDateString()}</small>
                </div>
                <span class="status ${car.status}">${car.status}</span>
            </div>
        `).join('');
    }
    
    async function loadCars() {
        try {
            console.log('Loading cars...');
            const carsQuery = query(collection(db, 'cars'), orderBy('createdAt', 'desc'));
            const snapshot = await getDocs(carsQuery);
            window.cars = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            
            renderCarsTable(window.cars);
            console.log(`✅ Loaded ${window.cars.length} cars`);
            
        } catch (error) {
            console.error('Error loading cars:', error);
            showNotification('Error loading cars', 'error');
        }
    }
    
    function renderCarsTable(cars) {
        const tableBody = document.getElementById('carsTableBody');
        if (!tableBody) return;
        
        if (cars.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="7" class="no-data">
                        <i class="fas fa-car"></i>
                        <span>No cars found</span>
                    </td>
                </tr>
            `;
            return;
        }
        
        tableBody.innerHTML = cars.map(car => `
            <tr>
                <td>
                    ${car.images && car.images[0] ? 
                        `<img src="${car.images[0]}" width="60" height="40" style="border-radius: 4px;">` : 
                        `<i class="fas fa-car"></i>`}
                </td>
                <td>${car.model}</td>
                <td><span class="brand-tag">${car.brand.toUpperCase()}</span></td>
                <td>${car.year}</td>
                <td>$${car.price?.toLocaleString() || '0'}</td>
                <td>
                    <span class="status-badge ${car.status}">
                        ${car.status === 'available' ? 'Available' : 'Sold'}
                    </span>
                </td>
                <td>
                    <button class="action-btn edit" onclick="editCar('${car.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete" onclick="deleteCar('${car.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                    <button class="action-btn status" onclick="toggleStatus('${car.id}')">
                        <i class="fas fa-${car.status === 'available' ? 'check-circle' : 'undo'}"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }
    
    function filterCars() {
        const searchTerm = document.getElementById('searchCar').value.toLowerCase();
        const filterBrand = document.getElementById('filterBrand').value;
        const filterStatus = document.getElementById('filterStatus').value;
        
        const filtered = window.cars.filter(car => {
            const matchesSearch = car.model.toLowerCase().includes(searchTerm) || 
                                 car.brand.toLowerCase().includes(searchTerm);
            const matchesBrand = !filterBrand || car.brand === filterBrand;
            const matchesStatus = !filterStatus || car.status === filterStatus;
            
            return matchesSearch && matchesBrand && matchesStatus;
        });
        
        renderCarsTable(filtered);
    }
    
    function loadSettings() {
        const settings = JSON.parse(localStorage.getItem('adminSettings')) || {
            companyName: 'Luxury Auto Gallery',
            whatsappNumber: '254742436155',
            currency: '$'
        };
        
        document.getElementById('companyName').value = settings.companyName;
        document.getElementById('whatsappNumber').value = settings.whatsappNumber;
        document.getElementById('currency').value = settings.currency;
    }
    
    function showNotification(message, type = 'info') {
        // Create notification
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 
                               type === 'error' ? 'exclamation-circle' : 
                               type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? 'rgba(0, 255, 157, 0.9)' :
                          type === 'error' ? 'rgba(255, 0, 60, 0.9)' :
                          type === 'warning' ? 'rgba(255, 215, 0, 0.9)' : 'rgba(0, 102, 255, 0.9)'};
            color: ${type === 'success' || type === 'warning' ? '#000' : '#fff'};
            padding: 15px 20px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            gap: 10px;
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
    
    // ========== 5. WINDOW FUNCTIONS (for onclick) ==========
    
    window.editCar = async function(carId) {
        const car = window.cars.find(c => c.id === carId);
        if (!car) return;
        
        const modal = document.getElementById('editCarModal');
        const modalBody = modal.querySelector('.modal-body');
        
        modalBody.innerHTML = `
            <h4>Edit ${car.brand} ${car.model}</h4>
            <form id="editForm">
                <input type="text" id="editModel" value="${car.model}" placeholder="Model" required>
                <input type="number" id="editPrice" value="${car.price}" placeholder="Price" required>
                <select id="editStatus">
                    <option value="available" ${car.status === 'available' ? 'selected' : ''}>Available</option>
                    <option value="sold" ${car.status === 'sold' ? 'selected' : ''}>Sold</option>
                </select>
                <button type="submit">Save Changes</button>
            </form>
        `;
        
        modal.style.display = 'flex';
        
        modalBody.querySelector('#editForm').addEventListener('submit', async function(e) {
            e.preventDefault();
            
            try {
                const updates = {
                    model: document.getElementById('editModel').value,
                    price: parseFloat(document.getElementById('editPrice').value),
                    status: document.getElementById('editStatus').value,
                    updatedAt: serverTimestamp()
                };
                
                await updateDoc(doc(db, 'cars', carId), updates);
                
                showNotification('Car updated!', 'success');
                modal.style.display = 'none';
                updateDashboard();
                loadCars();
                
            } catch (error) {
                showNotification('Error updating car', 'error');
            }
        });
    };
    
    window.deleteCar = async function(carId) {
        if (!confirm('Delete this car permanently?')) return;
        
        try {
            await deleteDoc(doc(db, 'cars', carId));
            showNotification('Car deleted!', 'success');
            updateDashboard();
            loadCars();
        } catch (error) {
            showNotification('Error deleting car', 'error');
        }
    };
    
    window.toggleStatus = async function(carId) {
        const car = window.cars.find(c => c.id === carId);
        if (!car) return;
        
        const newStatus = car.status === 'available' ? 'sold' : 'available';
        
        try {
            await updateDoc(doc(db, 'cars', carId), {
                status: newStatus,
                updatedAt: serverTimestamp()
            });
            
            showNotification(`Marked as ${newStatus}!`, 'success');
            updateDashboard();
            loadCars();
            
        } catch (error) {
            showNotification('Error updating status', 'error');
        }
    };
    
    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
        .brand-tag {
            background: #0066ff;
            color: white;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
        }
        .status-badge {
            padding: 4px 10px;
            border-radius: 20px;
            font-size: 12px;
        }
        .status-badge.available {
            background: rgba(0, 255, 157, 0.2);
            color: #00ff9d;
        }
        .status-badge.sold {
            background: rgba(255, 0, 60, 0.2);
            color: #ff003c;
        }
        .action-btn {
            padding: 8px;
            border: none;
            background: rgba(255, 255, 255, 0.05);
            color: white;
            border-radius: 4px;
            cursor: pointer;
            margin: 2px;
        }
        .action-btn:hover {
            opacity: 0.8;
        }
        .brand-row {
            display: flex;
            align-items: center;
            margin: 10px 0;
            gap: 10px;
        }
        .bar {
            flex: 1;
            height: 8px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 4px;
            overflow: hidden;
        }
        .fill {
            height: 100%;
            background: linear-gradient(90deg, #0066ff, #00f3ff);
        }
        .activity-item {
            display: flex;
            align-items: center;
            padding: 10px;
            background: rgba(255, 255, 255, 0.02);
            border-radius: 8px;
            margin-bottom: 8px;
            gap: 15px;
        }
        .activity-item .available { color: #00ff9d; }
        .activity-item .sold { color: #ff003c; }
        .no-data {
            text-align: center;
            padding: 40px !important;
            color: rgba(255, 255, 255, 0.5);
        }
        .no-data i {
            font-size: 40px;
            display: block;
            margin-bottom: 10px;
            opacity: 0.3;
        }
    `;
    document.head.appendChild(style);
    
    console.log('🎉 ADMIN DASHBOARD READY!');
});
