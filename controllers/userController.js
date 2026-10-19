const User = require('../models/userModel');
const Article = require('../models/articleModel');
const { estNonVide, estEmailValide } = require('../utils/validators');

const getAllUsers = async (req, res) => {
  try {
    const { role } = req.query;
    const filtre = role ? { role } : {};

    const users = await User.find(filtre);

    res.status(200).json({
      total: users.length,
      users
    });
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        error: `Utilisateur ${req.params.id} introuvable`
      });
    }

    res.status(200).json(user);
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).json({
        message: 'Invalid resource identifier (ObjectId expected)'
      });
    }

    res.status(500).json({
      error: err.message
    });
  }
};

const createUser = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({
        error: 'Le body est obligatoire'
      });
    }

    const { name, email, age, role, bio, phone } = req.body;

    if (!estNonVide(name)) {
      return res.status(400).json({
        error: 'Le nom est obligatoire et ne doit pas être vide'
      });
    }

    if (!estEmailValide(email)) {
      return res.status(400).json({
        error: "L'email est invalide : il doit contenir @ et un point"
      });
    }

    const emailNormalise = email.trim().toLowerCase();

    const existe = await User.findOne({
      email: emailNormalise
    });

    if (existe) {
      return res.status(409).json({
        error: 'Cet email existe déjà'
      });
    }

    const nouvelUser = await User.create({
      name: name.trim(),
      email: emailNormalise,
      age,
      role: role || 'user',
      bio,
      phone
    });

    res.status(201).json({
      message: 'Utilisateur créé avec succès',
      user: nouvelUser
    });
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    // 1. Referential Integrity Guard (Exercise 1)
    const hasArticles = await Article.findOne({ author: req.params.id });
    if (hasArticles) {
      return res.status(400).json({
        message: 'Impossible to delete an author with published articles'
      });
    }

    // 2. Perform deletion
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({
        error: `Utilisateur ${req.params.id} introuvable`
      });
    }

    res.status(200).json({
      message: `Utilisateur ${req.params.id} supprimé avec succès`
    });
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).json({
        message: 'Invalid resource identifier (ObjectId expected)'
      });
    }

    res.status(500).json({
      error: err.message
    });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  deleteUser
};