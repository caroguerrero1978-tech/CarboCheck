// Estado global de la aplicación
let currentUser = null;
let authToken = null;

// Funciones de navegación
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
}

function showWelcome() { showScreen('welcome-screen'); }
function showLogin() { showScreen('login-screen'); }
function showRegister() { showScreen('register-screen'); }
function showInfo() { showScreen('info-screen'); }
function showAdmin() { showScreen('admin-screen'); }

// Funciones de autenticación
document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        
        if (response.ok) {
            currentUser = data.user;
            authToken = data.token;
            localStorage.setItem('authToken', authToken);
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            
            document.getElementById('user-name').textContent = currentUser.name;
            showScreen('main-screen');
            showScanner();
        } else {
            alert(data.message);
        }
    } catch (error) {
        alert('Error de conexión');
    }
});

document.getElementById('register-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('register-name').value,
        email: document.getElementById('register-email').value,
        password: document.getElementById('register-password').value,
        diabetesType: document.getElementById('register-diabetes-type').value,
        age: parseInt(document.getElementById('register-age').value),
        weight: parseFloat(document.getElementById('register-weight').value),
        height: parseFloat(document.getElementById('register-height').value),
        activityLevel: document.getElementById('register-activity').value,
        insulinType: document.getElementById('register-insulin').value
    };

    try {
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        const data = await response.json();
        
        if (response.ok) {
            alert('Registro exitoso');
            showLogin();
        } else {
            alert(data.message);
        }
    } catch (error) {
        alert('Error de conexión');
    }
});

function logout() {
    currentUser = null;
    authToken = null;
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    showWelcome();
}

// Navegación principal
function setActiveNav(navId) {
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(navId).classList.add('active');
}

function showScanner() {
    setActiveNav('scanner-nav');
    document.getElementById('main-content').innerHTML = `
        <div class="scanner-container">
            <h2>Escanear Alimento</h2>
            <p>Toma una foto de tu alimento para obtener información nutricional</p>
            
            <div class="camera-preview" onclick="document.getElementById('image-input').click()">
                <div>
                    <span style="font-size: 3rem;">📷</span>
                    <p>Toca para tomar foto</p>
                </div>
            </div>
            
            <input type="file" id="image-input" accept="image/*" style="display: none;">
            <button class="upload-btn" onclick="analyzeImage()">Analizar Imagen</button>
            
            <div id="analysis-result" style="margin-top: 20px;"></div>
        </div>
    `;
}

function showHistory() {
    setActiveNav('history-nav');
    loadConsumptionHistory();
}

function showReports() {
    setActiveNav('reports-nav');
    loadMonthlyReport();
}

function showProfile() {
    setActiveNav('profile-nav');
    loadUserProfile();
}

// Funciones del scanner
async function analyzeImage() {
    const fileInput = document.getElementById('image-input');
    const file = fileInput.files[0];
    
    if (!file) {
        alert('Por favor selecciona una imagen');
        return;
    }

    const formData = new FormData();
    formData.append('image', file);

    try {
        const response = await fetch('/api/foods/analyze-image', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${authToken}` },
            body: formData
        });

        const data = await response.json();
        
        if (response.ok && data.detected) {
            displayAnalysisResult(data.food);
        } else {
            alert('No se pudo analizar la imagen');
        }
    } catch (error) {
        alert('Error analizando imagen');
    }
}

function displayAnalysisResult(food) {
    document.getElementById('analysis-result').innerHTML = `
        <div style="background: #f7fafc; padding: 20px; border-radius: 10px; text-align: left;">
            <h3>Alimento detectado: ${food.name}</h3>
            <p><strong>Carbohidratos:</strong> ${food.carbohydrates}g por 100g</p>
            <p><strong>Azúcares:</strong> ${food.sugars}g por 100g</p>
            <p><strong>Índice glucémico:</strong> ${food.glycemicIndex || 'N/A'}</p>
            <p><strong>Calorías:</strong> ${food.calories || 'N/A'} por 100g</p>
            
            <div style="margin-top: 20px;">
                <label>Cantidad consumida (gramos):</label>
                <input type="number" id="quantity-input" value="100" min="1" style="width: 100px; margin: 0 10px;">
                <button onclick="registerConsumption(${JSON.stringify(food).replace(/"/g, '&quot;')})" class="btn-primary">
                    Registrar Consumo
                </button>
            </div>
        </div>
    `;
}

async function registerConsumption(foodData) {
    const quantity = parseInt(document.getElementById('quantity-input').value);
    
    try {
        const response = await fetch('/api/foods/consume', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({ foodData, quantity })
        });

        const data = await response.json();
        
        if (response.ok) {
            alert(`Consumo registrado:\n${data.consumption.food}\nCarbohidratos: ${data.consumption.totalCarbs}g\n${data.consumption.insulinRecommendation || data.consumption.medicationRecommendation}`);
            document.getElementById('analysis-result').innerHTML = '';
            document.getElementById('image-input').value = '';
        } else {
            alert('Error registrando consumo');
        }
    } catch (error) {
        alert('Error de conexión');
    }
}

// Cargar historial
async function loadConsumptionHistory() {
    try {
        const response = await fetch('/api/users/consumption-history', {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });

        const history = await response.json();
        
        let historyHTML = '<h2>Historial de Consumo</h2>';
        
        if (history.length === 0) {
            historyHTML += '<p>No hay registros de consumo aún.</p>';
        } else {
            historyHTML += '<div style="max-height: 400px; overflow-y: auto;">';
            history.forEach(item => {
                const date = new Date(item.consumedAt).toLocaleDateString();
                historyHTML += `
                    <div style="background: #f7fafc; padding: 15px; margin: 10px 0; border-radius: 8px;">
                        <h4>${item.foodId.name}</h4>
                        <p><strong>Fecha:</strong> ${date}</p>
                        <p><strong>Cantidad:</strong> ${item.quantity}g</p>
                        <p><strong>Carbohidratos:</strong> ${item.totalCarbs}g</p>
                        <p><strong>Azúcares:</strong> ${item.totalSugars}g</p>
                        ${item.insulinRecommendation ? `<p><strong>Recomendación:</strong> ${item.insulinRecommendation}</p>` : ''}
                        ${item.medicationRecommendation ? `<p><strong>Medicación:</strong> ${item.medicationRecommendation}</p>` : ''}
                    </div>
                `;
            });
            historyHTML += '</div>';
        }
        
        document.getElementById('main-content').innerHTML = historyHTML;
    } catch (error) {
        document.getElementById('main-content').innerHTML = '<p>Error cargando historial</p>';
    }
}

// Cargar reporte mensual
async function loadMonthlyReport() {
    try {
        const response = await fetch('/api/users/monthly-report', {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });

        const report = await response.json();
        
        document.getElementById('main-content').innerHTML = `
            <h2>Reporte Mensual</h2>
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-number">${report.totalConsumptions}</div>
                    <p>Registros</p>
                </div>
                <div class="stat-card">
                    <div class="stat-number">${Math.round(report.totalCarbs)}g</div>
                    <p>Carbohidratos totales</p>
                </div>
                <div class="stat-card">
                    <div class="stat-number">${Math.round(report.totalSugars)}g</div>
                    <p>Azúcares totales</p>
                </div>
                <div class="stat-card">
                    <div class="stat-number">${report.avgDailyCarbs}g</div>
                    <p>Promedio diario</p>
                </div>
            </div>
            <p><strong>Período:</strong> ${report.period}</p>
        `;
    } catch (error) {
        document.getElementById('main-content').innerHTML = '<p>Error cargando reporte</p>';
    }
}

// Cargar perfil de usuario
async function loadUserProfile() {
    try {
        const response = await fetch('/api/users/profile', {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });

        const profile = await response.json();
        
        document.getElementById('main-content').innerHTML = `
            <h2>Mi Perfil</h2>
            <div style="background: #f7fafc; padding: 20px; border-radius: 10px;">
                <p><strong>Nombre:</strong> ${profile.name}</p>
                <p><strong>Email:</strong> ${profile.email}</p>
                <p><strong>Tipo de diabetes:</strong> ${profile.diabetesType}</p>
                <p><strong>Edad:</strong> ${profile.age || 'No especificada'} años</p>
                <p><strong>Peso:</strong> ${profile.weight || 'No especificado'} kg</p>
                <p><strong>Altura:</strong> ${profile.height || 'No especificada'} cm</p>
                <p><strong>Nivel de actividad:</strong> ${profile.activityLevel || 'No especificado'}</p>
                <p><strong>Tipo de insulina:</strong> ${profile.insulinType || 'No especificado'}</p>
                <p><strong>Miembro desde:</strong> ${new Date(profile.createdAt).toLocaleDateString()}</p>
            </div>
        `;
    } catch (error) {
        document.getElementById('main-content').innerHTML = '<p>Error cargando perfil</p>';
    }
}

// Admin
document.getElementById('admin-login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const password = document.getElementById('admin-password').value;

    try {
        const response = await fetch('/api/admin/dashboard', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password })
        });

        const data = await response.json();
        
        if (response.ok) {
            document.getElementById('admin-content').style.display = 'block';
            document.getElementById('admin-content').innerHTML = `
                <h3>Dashboard de Administrador</h3>
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-number">${data.stats.totalUsers}</div>
                        <p>Usuarios totales</p>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">${data.stats.totalConsumptions}</div>
                        <p>Consumos registrados</p>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">${data.stats.totalFoods}</div>
                        <p>Alimentos en BD</p>
                    </div>
                </div>
                <p><strong>Contraseña de administrador:</strong> CarboCheck2025!Admin</p>
            `;
        } else {
            alert(data.message);
        }
    } catch (error) {
        alert('Error de conexión');
    }
});

// Verificar si hay sesión activa al cargar
window.addEventListener('load', () => {
    const savedToken = localStorage.getItem('authToken');
    const savedUser = localStorage.getItem('currentUser');
    
    if (savedToken && savedUser) {
        authToken = savedToken;
        currentUser = JSON.parse(savedUser);
        document.getElementById('user-name').textContent = currentUser.name;
        showScreen('main-screen');
        showScanner();
    }
});

// Acceso directo al admin con Ctrl+Shift+A
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        showAdmin();
    }
});
