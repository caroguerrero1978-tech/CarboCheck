const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Registro
router.post('/register', async (req, res) => {
  try {
    const { email, password, name, diabetesType, age, weight, height, activityLevel, insulinType } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Usuario ya existe' });
    }

    const user = new User({
      email,
      password,
      name,
      diabetesType,
      age,
      weight,
      height,
      activityLevel,
      insulinType
    });

    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'carbocheck_secret', { expiresIn: '7d' });

    res.status(201).json({
      message: 'Usuario creado exitosamente',
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        diabetesType: user.diabetesType
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor', error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'carbocheck_secret', { expiresIn: '7d' });

    res.json({
      message: 'Login exitoso',
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        diabetesType: user.diabetesType
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor', error: error.message });
  }
});

module.exports = router;
