const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Datos simulados en memoria
let users = [];
let foods = [
  { id: 1, name: 'Manzana', carbohydrates: 25, sugars: 19, glycemicIndex: 36, calories: 95 },
  { id: 2, name: 'Pan integral', carbohydrates: 45, sugars: 3, glycemicIndex: 51, calories: 247 },
  { id: 3, name: 'Arroz blanco', carbohydrates: 53, sugars: 0, glycemicIndex: 73, calories: 205 },
  { id: 4, name: 'Pasta', carbohydrates: 43, sugars: 2, glycemicIndex: 50, calories: 220 }
];
let consumptions = [];

// Rutas API simplificadas
app.post('/api/auth/register', (req, res) => {
  const { email, password, name, diabetesType } = req.body;
  const user = { id: users.length + 1, email, name, diabetesType, createdAt: new Date() };
  users.push(user);
  res.json({ message: 'Usuario creado exitosamente', user });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email);
  if (user) {
    res.json({ message: 'Login exitoso', token: 'demo-token', user });
  } else {
    res.status(401).json({ message: 'Credenciales inválidas' });
  }
});

app.post('/api/foods/analyze-image', (req, res) => {
  const randomFood = foods[Math.floor(Math.random() * foods.length)];
  res.json({ detected: true, food: randomFood, confidence: 0.85 });
});

app.post('/api/foods/consume', (req, res) => {
  const { foodData, quantity } = req.body;
  const totalCarbs = (foodData.carbohydrates * quantity) / 100;
  const totalSugars = (foodData.sugars * quantity) / 100;
  
  const consumption = {
    id: consumptions.length + 1,
    food: foodData.name,
    quantity,
    totalCarbs: Math.round(totalCarbs * 100) / 100,
    totalSugars: Math.round(totalSugars * 100) / 100,
    consumedAt: new Date()
  };
  
  consumptions.push(consumption);
  res.json({ message: 'Consumo registrado exitosamente', consumption });
});

app.get('/api/users/consumption-history', (req, res) => {
  res.json(consumptions.slice(-10));
});

app.get('/api/users/monthly-report', (req, res) => {
  const totalCarbs = consumptions.reduce((sum, c) => sum + c.totalCarbs, 0);
  const totalSugars = consumptions.reduce((sum, c) => sum + c.totalSugars, 0);
  
  res.json({
    period: 'Septiembre 2025',
    totalConsumptions: consumptions.length,
    totalCarbs: Math.round(totalCarbs),
    totalSugars: Math.round(totalSugars),
    avgDailyCarbs: Math.round((totalCarbs / 30) * 100) / 100
  });
});

app.post('/api/admin/dashboard', (req, res) => {
  const { password } = req.body;
  if (password === 'CarboCheck2025!Admin') {
    res.json({
      stats: {
        totalUsers: users.length,
        totalConsumptions: consumptions.length,
        totalFoods: foods.length
      },
      recentUsers: users.slice(-5)
    });
  } else {
    res.status(401).json({ message: 'Contraseña incorrecta' });
  }
});

// Rutas específicas
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🏥 CarboCheck server running on port ${PORT}`);
  console.log(`👥 Usuarios: http://localhost:${PORT}`);
  console.log(`👨‍💼 Admin: http://localhost:${PORT}/admin`);
  console.log(`✅ Servidor listo para usar (sin base de datos)`);
});
