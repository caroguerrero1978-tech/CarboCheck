class CarboCheckApp {
    constructor() {
        this.currentUser = null;
        this.camera = null;
        this.initApp();
    }

    initApp() {
        this.bindEvents();
        this.checkAuthStatus();
    }

    bindEvents() {
        // Login/Register
        document.getElementById('loginForm').addEventListener('submit', (e) => this.handleLogin(e));
        document.getElementById('registerForm').addEventListener('submit', (e) => this.handleRegister(e));
        document.getElementById('registerBtn').addEventListener('click', () => this.showRegister());
        document.getElementById('backToLogin').addEventListener('click', () => this.showLogin());
        document.getElementById('logoutBtn').addEventListener('click', () => this.logout());

        // Camera
        document.getElementById('startCamera').addEventListener('click', () => this.startCamera());
        document.getElementById('captureBtn').addEventListener('click', () => this.captureImage());
        document.getElementById('uploadBtn').addEventListener('click', () => this.uploadImage());
        document.getElementById('fileInput').addEventListener('change', (e) => this.handleFileUpload(e));

        // Food saving
        document.getElementById('saveFood').addEventListener('click', () => this.saveToHistory());
    }

    checkAuthStatus() {
        const savedUser = localStorage.getItem('carbocheck_current_user');
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
            this.showMainApp();
        } else {
            this.showLogin();
        }
    }

    showLogin() {
        this.hideAllScreens();
        document.getElementById('loginScreen').classList.add('active');
    }

    showRegister() {
        this.hideAllScreens();
        document.getElementById('registerScreen').classList.add('active');
    }

    showMainApp() {
        this.hideAllScreens();
        document.getElementById('mainScreen').classList.add('active');
        this.loadTodayHistory();
    }

    hideAllScreens() {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
    }

    async handleLogin(e) {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        const user = db.authenticateUser(email, password);
        if (user) {
            this.currentUser = user;
            localStorage.setItem('carbocheck_current_user', JSON.stringify(user));
            this.showMainApp();
            this.showMessage('Bienvenido/a ' + user.name, 'success');
        } else {
            this.showMessage('Email o contraseña incorrectos', 'error');
        }
    }

    async handleRegister(e) {
        e.preventDefault();
        const userData = {
            name: document.getElementById('regName').value,
            email: document.getElementById('regEmail').value,
            password: document.getElementById('regPassword').value,
            diabetesType: document.getElementById('diabetesType').value
        };

        try {
            const newUser = db.createUser(userData);
            this.showMessage('Cuenta creada exitosamente', 'success');
            setTimeout(() => this.showLogin(), 1500);
        } catch (error) {
            this.showMessage('Error al crear la cuenta', 'error');
        }
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('carbocheck_current_user');
        this.stopCamera();
        this.showLogin();
    }

    async startCamera() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ 
                video: { facingMode: 'environment' } 
            });
            const video = document.getElementById('camera');
            video.srcObject = stream;
            this.camera = stream;
            
            document.getElementById('startCamera').style.display = 'none';
            document.getElementById('captureBtn').style.display = 'inline-block';
        } catch (error) {
            this.showMessage('No se pudo acceder a la cámara', 'error');
        }
    }

    stopCamera() {
        if (this.camera) {
            this.camera.getTracks().forEach(track => track.stop());
            this.camera = null;
            document.getElementById('startCamera').style.display = 'inline-block';
            document.getElementById('captureBtn').style.display = 'none';
        }
    }

    captureImage() {
        const video = document.getElementById('camera');
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');
        
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0);
        
        const imageData = canvas.toDataURL('image/jpeg');
        this.analyzeFood(imageData);
    }

    uploadImage() {
        document.getElementById('fileInput').click();
    }

    handleFileUpload(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                this.analyzeFood(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    }

    async analyzeFood(imageData) {
        this.showMessage('Analizando imagen...', 'info');
        
        try {
            const result = await db.analyzeImage(imageData);
            
            if (result.detected) {
                this.displayNutritionInfo(result.food);
                this.currentAnalysis = result.food;
            } else {
                this.showMessage('No se pudo identificar el alimento', 'error');
            }
        } catch (error) {
            this.showMessage('Error al analizar la imagen', 'error');
        }
    }

    displayNutritionInfo(food) {
        document.getElementById('carbs').textContent = food.carbs + 'g';
        document.getElementById('sugars').textContent = food.sugars + 'g';
        document.getElementById('calories').textContent = food.calories;
        
        const recommendation = db.getMedicationRecommendation(
            this.currentUser.diabetesType, 
            food.carbs, 
            food.sugars
        );
        
        const recommendationsDiv = document.getElementById('recommendations');
        recommendationsDiv.innerHTML = `
            <h4>${recommendation.type}</h4>
            <p><strong>${recommendation.recommendation}</strong></p>
            <p><small>${recommendation.warning}</small></p>
        `;
        
        document.getElementById('results').style.display = 'block';
        this.showMessage(`Alimento detectado: ${food.name}`, 'success');
    }

    saveToHistory() {
        if (this.currentAnalysis) {
            db.addToHistory(this.currentUser.id, this.currentAnalysis);
            this.loadTodayHistory();
            this.showMessage('Guardado en el historial', 'success');
        }
    }

    loadTodayHistory() {
        const history = db.getTodayHistory(this.currentUser.id);
        const historyDiv = document.getElementById('todayHistory');
        
        if (history.length === 0) {
            historyDiv.innerHTML = '<p>No hay registros para hoy</p>';
            return;
        }
        
        historyDiv.innerHTML = history.map(entry => `
            <div class="history-item">
                <span>${entry.name} (${entry.portion})</span>
                <span>${entry.carbs}g carbs</span>
            </div>
        `).join('');
    }

    showMessage(message, type) {
        // Crear elemento de mensaje
        const messageDiv = document.createElement('div');
        messageDiv.className = type === 'error' ? 'alert' : 'success';
        messageDiv.textContent = message;
        
        // Insertar al inicio del contenido principal
        const mainContent = document.querySelector('.main-content');
        if (mainContent) {
            mainContent.insertBefore(messageDiv, mainContent.firstChild);
            
            // Remover después de 3 segundos
            setTimeout(() => {
                messageDiv.remove();
            }, 3000);
        }
    }
}

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new CarboCheckApp();
});
