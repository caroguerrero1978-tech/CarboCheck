const express = require('express');
const User = require('../models/User');
const { Food, Consumption } = require('../models/Food');
const router = express.Router();

const ADMIN_PASSWORD = 'CarboCheck2025!Admin';

// Middleware de autenticación de admin
const adminAuth = (req, res, next) => {
  const { password } = req.body;
  if (password !== ADMIN_PASSWORD) {
    return res.status(401).json({ message: 'Contraseña de administrador incorrecta' });
  }
  next();
};

// Dashboard de administrador
router.post('/dashboard', adminAuth, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalConsumptions = await Consumption.countDocuments();
    const totalFoods = await Food.countDocuments();

    const usersByType = await User.aggregate([
      { $group: { _id: '$diabetesType', count: { $sum: 1 } } }
    ]);

    const recentUsers = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(10);

    const topFoods = await Consumption.aggregate([
      { $group: { _id: '$foodId', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
      { $lookup: { from: 'foods', localField: '_id', foreignField: '_id', as: 'food' } }
    ]);

    res.json({
      stats: {
        totalUsers,
        totalConsumptions,
        totalFoods,
        usersByType
      },
      recentUsers,
      topFoods
    });
  } catch (error) {
    res.status(500).json({ message: 'Error obteniendo datos del dashboard' });
  }
});

// Agregar alimento a la base de datos
router.post('/add-food', adminAuth, async (req, res) => {
  try {
    const { name, carbohydrates, sugars, glycemicIndex, calories, category } = req.body;

    const food = new Food({
      name,
      carbohydrates,
      sugars,
      glycemicIndex,
      calories,
      category
    });

    await food.save();
    res.json({ message: 'Alimento agregado exitosamente', food });
  } catch (error) {
    res.status(500).json({ message: 'Error agregando alimento' });
  }
});

// Obtener todos los usuarios
router.post('/users', adminAuth, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error obteniendo usuarios' });
  }
});

module.exports = router;
