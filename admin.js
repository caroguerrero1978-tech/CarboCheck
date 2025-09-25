class CarboCheckAdmin {
    constructor() {
        // Contraseña de administrador (en producción usar hash y variables de entorno)
        this.adminPassword = 'CaroAdmin2024!';
        this.initAdmin();
    }

    initAdmin() {
        document.getElementById('adminLoginForm').addEventListener('submit', (e) => this.handleLogin(e));
        this.checkAdminAuth();
    }

    checkAdminAuth() {
        const isAuthenticated = sessionStorage.getItem('carbocheck_admin_auth');
        if (isAuthenticated === 'true') {
            this.showDashboard();
        }
    }

    handleLogin(e) {
        e.preventDefault();
        const password = document.getElementById('adminPassword').value;
        
        if (password === this.adminPassword) {
            sessionStorage.setItem('carbocheck_admin_auth', 'true');
            this.showDashboard();
        } else {
            document.getElementById('loginError').textContent = 'Contraseña incorrecta';
            setTimeout(() => {
                document.getElementById('loginError').textContent = '';
            }, 3000);
        }
    }

    showDashboard() {
        document.getElementById('adminLogin').style.display = 'none';
        document.getElementById('dashboard').classList.add('active');
        this.loadMetrics();
        this.loadUserData();
        this.loadActivityData();
    }

    loadMetrics() {
        const users = JSON.parse(localStorage.getItem('carbocheck_users') || '[]');
        const history = JSON.parse(localStorage.getItem('carbocheck_history') || '[]');
        
        // Usuarios totales
        document.getElementById('totalUsers').textContent = users.length;
        
        // Escaneos totales
        document.getElementById('totalScans').textContent = history.length;
        
        // Usuarios activos hoy
        const today = new Date().toDateString();
        const activeToday = new Set(
            history
                .filter(entry => new Date(entry.timestamp).toDateString() === today)
                .map(entry => entry.userId)
        ).size;
        document.getElementById('activeToday').textContent = activeToday;
        
        // Promedio de escaneos por día
        if (history.length > 0) {
            const firstScan = new Date(history[0].timestamp);
            const daysSinceFirst = Math.max(1, Math.ceil((Date.now() - firstScan.getTime()) / (1000 * 60 * 60 * 24)));
            const avgDaily = Math.round(history.length / daysSinceFirst * 10) / 10;
            document.getElementById('avgDaily').textContent = avgDaily;
        }
    }

    loadUserData() {
        const users = JSON.parse(localStorage.getItem('carbocheck_users') || '[]');
        const usersTable = document.getElementById('usersTable');
        
        usersTable.innerHTML = users.map(user => `
            <div class="table-row">
                <div>${user.name}</div>
                <div>${user.email}</div>
                <div>${user.diabetesType === 'tipo1' ? 'Tipo 1' : 'Tipo 2'}</div>
                <div>${new Date(user.createdAt).toLocaleDateString()}</div>
            </div>
        `).join('');
    }

    loadActivityData() {
        const history = JSON.parse(localStorage.getItem('carbocheck_history') || '[]');
        const users = JSON.parse(localStorage.getItem('carbocheck_users') || '[]');
        const activityTable = document.getElementById('activityTable');
        
        // Crear mapa de usuarios para obtener nombres
        const userMap = {};
        users.forEach(user => {
            userMap[user.id] = user.name;
        });
        
        // Mostrar últimos 50 escaneos
        const recentActivity = history
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            .slice(0, 50);
        
        activityTable.innerHTML = recentActivity.map(entry => `
            <div class="table-row">
                <div>${userMap[entry.userId] || 'Usuario desconocido'}</div>
                <div>${entry.name}</div>
                <div>${entry.carbs}g</div>
                <div>${new Date(entry.timestamp).toLocaleString()}</div>
            </div>
        `).join('');
    }

    // Funciones de exportación
    exportUsers() {
        const users = JSON.parse(localStorage.getItem('carbocheck_users') || '[]');
        const csv = this.arrayToCSV(users, ['name', 'email', 'diabetesType', 'createdAt']);
        this.downloadCSV(csv, 'carbocheck_usuarios.csv');
    }

    exportActivity() {
        const history = JSON.parse(localStorage.getItem('carbocheck_history') || '[]');
        const users = JSON.parse(localStorage.getItem('carbocheck_users') || '[]');
        
        // Crear mapa de usuarios
        const userMap = {};
        users.forEach(user => {
            userMap[user.id] = user.name;
        });
        
        // Agregar nombre de usuario a cada entrada
        const enrichedHistory = history.map(entry => ({
            ...entry,
            userName: userMap[entry.userId] || 'Usuario desconocido'
        }));
        
        const csv = this.arrayToCSV(enrichedHistory, ['userName', 'name', 'carbs', 'sugars', 'calories', 'timestamp']);
        this.downloadCSV(csv, 'carbocheck_actividad.csv');
    }

    exportMetrics() {
        const users = JSON.parse(localStorage.getItem('carbocheck_users') || '[]');
        const history = JSON.parse(localStorage.getItem('carbocheck_history') || '[]');
        
        const metrics = {
            totalUsers: users.length,
            totalScans: history.length,
            usersByDiabetesType: {
                tipo1: users.filter(u => u.diabetesType === 'tipo1').length,
                tipo2: users.filter(u => u.diabetesType === 'tipo2').length
            },
            scansByDay: this.getScansByDay(history),
            mostScannedFoods: this.getMostScannedFoods(history),
            exportDate: new Date().toISOString()
        };
        
        const json = JSON.stringify(metrics, null, 2);
        this.downloadJSON(json, 'carbocheck_metricas.json');
    }

    getScansByDay(history) {
        const scansByDay = {};
        history.forEach(entry => {
            const day = new Date(entry.timestamp).toDateString();
            scansByDay[day] = (scansByDay[day] || 0) + 1;
        });
        return scansByDay;
    }

    getMostScannedFoods(history) {
        const foodCount = {};
        history.forEach(entry => {
            foodCount[entry.name] = (foodCount[entry.name] || 0) + 1;
        });
        
        return Object.entries(foodCount)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 10)
            .map(([food, count]) => ({ food, count }));
    }

    arrayToCSV(array, columns) {
        const header = columns.join(',');
        const rows = array.map(item => 
            columns.map(col => `"${item[col] || ''}"`).join(',')
        );
        return [header, ...rows].join('\n');
    }

    downloadCSV(csv, filename) {
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
    }

    downloadJSON(json, filename) {
        const blob = new Blob([json], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
    }
}

function logout() {
    sessionStorage.removeItem('carbocheck_admin_auth');
    location.reload();
}

// Funciones globales para los botones de exportación
function exportUsers() {
    admin.exportUsers();
}

function exportActivity() {
    admin.exportActivity();
}

function exportMetrics() {
    admin.exportMetrics();
}

// Inicializar panel de administración
const admin = new CarboCheckAdmin();
