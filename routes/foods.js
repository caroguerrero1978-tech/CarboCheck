const express = require('express');
const multer = require('multer');
const { Food, Consumption } = require('../models/Food');
const User = require('../models/User');
const router = express.Router();

const upload = multer({ dest: 'uploads/' });

// Middleware de autenticación
const auth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ message: 'Token requerido' });
  }

  try {
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'carbocheck_secret');
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token inválido' });
  }
};

// Análisis de imagen de alimento (simulado)
router.post('/analyze-image', auth, upload.single('image'), async (req, res) => {
  try {
    // Simulación de análisis de imagen - en producción usarías un servicio de IA
    const mockFoods = [
      { name: 'Manzana', carbohydrates: 25, sugars: 19, glycemicIndex: 36, calories: 95 },
      { name: 'Pan integral', carbohydrates: 45, sugars: 3, glycemicIndex: 51, calories: 247 },
      { name: 'Arroz blanco', carbohydrates: 53, sugars: 0, glycemicIndex: 73, calories: 205 },
      { name: 'Pasta', carbohydrates: 43, sugars: 2, glycemicIndex: 50, calories: 220 }
    ];

    const randomFood = mockFoods[Math.floor(Math.random() * mockFoods.length)];
    
    res.json({
      detected: true,
      food: randomFood,
      confidence: 0.85,
      message: 'Alimento detectado exitosamente'
    });
  } catch (error) {
    res.status(500).json({ message: 'Error analizando imagen' });
  }
});

// Registrar consumo de alimento
router.post('/consume', auth, async (req, res) => {
  try {
    const { foodData, quantity } = req.body;
    const user = await User.findById(req.userId);

    // Crear o encontrar alimento en la base de datos
    let food = await Food.findOne({ name: foodData.name });
    if (!food) {
      food = new Food(foodData);
      await food.save();
    }

    const totalCarbs = (foodData.carbohydrates * quantity) / 100;
    const totalSugars = (foodData.sugars * quantity) / 100;

    // Generar recomendaciones basadas en el tipo de diabetes
    let insulinRecommendation = '';
    let medicationRecommendation = '';

    if (user.diabetesType === 'tipo1') {
      const insulinUnits = Math.round(totalCarbs / 10); // Ratio aproximado
      insulinRecommendation = `Considerar ${insulinUnits} unidades de insulina rápida`;
    } else if (user.diabetesType === 'tipo2') {
      if (totalCarbs > 30) {
        medicationRecommendation = 'Considerar tomar metformina según prescripción médica';
      }
    }

    const consumption = new Consumption({
      userId: req.userId,
      foodId: food._id,
      quantity,
      totalCarbs,
      totalSugars,
      insulinRecommendation,
      medicationRecommendation
    });

    await consumption.save();

    res.json({
      message: 'Consumo registrado exitosamente',
      consumption: {
        food: food.name,
        quantity,
        totalCarbs: Math.round(totalCarbs * 100) / 100,
        totalSugars: Math.round(totalSugars * 100) / 100,
        insulinRecommendation,
        medicationRecommendation
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error registrando consumo' });
  }
});

// Buscar alimentos en la base de datos
router.get('/search', auth, async (req, res) => {
  try {
    const { query } = req.query;
    const foods = await Food.find({
      name: { $regex: query, $options: 'i' }
    }).limit(10);

    res.json(foods);
  } catch (error) {
    res.status(500).json({ message: 'Error buscando alimentos' });
  }
});

module.exports = router;
