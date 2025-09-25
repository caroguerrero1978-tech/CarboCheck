// Base de datos local usando localStorage
class CarboCheckDB {
    constructor() {
        this.initDB();
    }

    initDB() {
        if (!localStorage.getItem('carbocheck_users')) {
            localStorage.setItem('carbocheck_users', JSON.stringify([]));
        }
        if (!localStorage.getItem('carbocheck_foods')) {
            localStorage.setItem('carbocheck_foods', JSON.stringify(this.getFoodDatabase()));
        }
        if (!localStorage.getItem('carbocheck_history')) {
            localStorage.setItem('carbocheck_history', JSON.stringify([]));
        }
    }

    // Base de datos de alimentos
    getFoodDatabase() {
        return [
            { name: 'manzana', carbs: 25, sugars: 19, calories: 95, portion: '1 unidad mediana' },
            { name: 'banana', carbs: 27, sugars: 14, calories: 105, portion: '1 unidad mediana' },
            { name: 'pan blanco', carbs: 15, sugars: 1, calories: 80, portion: '1 rebanada' },
            { name: 'arroz blanco', carbs: 45, sugars: 0, calories: 205, portion: '1 taza cocida' },
            { name: 'pasta', carbs: 43, sugars: 1, calories: 220, portion: '1 taza cocida' },
            { name: 'papa', carbs: 37, sugars: 2, calories: 161, portion: '1 unidad mediana' },
            { name: 'leche', carbs: 12, sugars: 12, calories: 150, portion: '1 vaso (240ml)' },
            { name: 'yogur', carbs: 17, sugars: 17, calories: 150, portion: '1 taza' },
            { name: 'galletas', carbs: 20, sugars: 8, calories: 140, portion: '4 unidades' },
            { name: 'chocolate', carbs: 25, sugars: 24, calories: 150, portion: '30g' }
        ];
    }

    // Usuarios
    createUser(userData) {
        const users = JSON.parse(localStorage.getItem('carbocheck_users'));
        const newUser = {
            id: Date.now(),
            ...userData,
            createdAt: new Date().toISOString()
        };
        users.push(newUser);
        localStorage.setItem('carbocheck_users', JSON.stringify(users));
        return newUser;
    }

    authenticateUser(email, password) {
        const users = JSON.parse(localStorage.getItem('carbocheck_users'));
        return users.find(user => user.email === email && user.password === password);
    }

    // Alimentos
    searchFood(query) {
        const foods = JSON.parse(localStorage.getItem('carbocheck_foods'));
        return foods.filter(food => 
            food.name.toLowerCase().includes(query.toLowerCase())
        );
    }

    // Historial
    addToHistory(userId, foodData) {
        const history = JSON.parse(localStorage.getItem('carbocheck_history'));
        const entry = {
            id: Date.now(),
            userId,
            ...foodData,
            timestamp: new Date().toISOString()
        };
        history.push(entry);
        localStorage.setItem('carbocheck_history', JSON.stringify(history));
        return entry;
    }

    getTodayHistory(userId) {
        const history = JSON.parse(localStorage.getItem('carbocheck_history'));
        const today = new Date().toDateString();
        return history.filter(entry => 
            entry.userId === userId && 
            new Date(entry.timestamp).toDateString() === today
        );
    }

    // Simulación de reconocimiento de imágenes
    analyzeImage(imageData) {
        // Simulamos el análisis de imagen con datos aleatorios
        const foods = this.getFoodDatabase();
        const randomFood = foods[Math.floor(Math.random() * foods.length)];
        
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    detected: true,
                    food: randomFood,
                    confidence: Math.random() * 0.3 + 0.7 // 70-100% confianza
                });
            }, 2000); // Simula tiempo de procesamiento
        });
    }

    // Recomendaciones de medicación
    getMedicationRecommendation(diabetesType, carbs, sugars) {
        if (diabetesType === 'tipo1') {
            const insulinUnits = Math.ceil(carbs / 15); // Ratio básico
            return {
                type: 'Insulina',
                recommendation: `Se recomienda ${insulinUnits} unidades de insulina rápida`,
                warning: 'Consulta con tu médico para ajustar la dosis según tu ratio personal'
            };
        } else if (diabetesType === 'tipo2') {
            if (carbs > 45 || sugars > 20) {
                return {
                    type: 'Medicación',
                    recommendation: 'Considera tomar tu medicación antes de esta comida',
                    warning: 'Alto contenido de carbohidratos. Monitorea tu glucosa después de comer'
                };
            } else {
                return {
                    type: 'Monitoreo',
                    recommendation: 'Contenido moderado de carbohidratos',
                    warning: 'Mantén tu rutina normal de medicación'
                };
            }
        }
    }
}

// Instancia global de la base de datos
const db = new CarboCheckDB();
