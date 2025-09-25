const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { Consumption } = require('../models/Food');
const router = express.Router();

// Middleware de autenticación
const auth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ message: 'Token requerido' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'carbocheck_secret');
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token inválido' });
  }
};

// Obtener perfil del usuario
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// Obtener historial de consumo
router.get('/consumption-history', auth, async (req, res) => {
  try {
    const history = await Consumption.find({ userId: req.userId })
      .populate('foodId')
      .sort({ consumedAt: -1 })
      .limit(50);
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// Generar reporte mensual
router.get('/monthly-report', auth, async (req, res) => {
  try {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const consumptions = await Consumption.find({
      userId: req.userId,
      consumedAt: { $gte: startOfMonth }
    }).populate('foodId');

    const totalCarbs = consumptions.reduce((sum, c) => sum + c.totalCarbs, 0);
    const totalSugars = consumptions.reduce((sum, c) => sum + c.totalSugars, 0);
    const avgDailyCarbs = totalCarbs / new Date().getDate();

    res.json({
      period: `${startOfMonth.toLocaleDateString()} - ${new Date().toLocaleDateString()}`,
      totalConsumptions: consumptions.length,
      totalCarbs,
      totalSugars,
      avgDailyCarbs: Math.round(avgDailyCarbs * 100) / 100,
      consumptions
    });
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor' });
  }
});

module.exports = router;
