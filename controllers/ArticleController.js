const Article = require('../models/articleModel');
const User = require('../models/userModel');

const getAllArticles = async (req, res) => {
  try {
    const { author } = req.query;
    const filtre = {};

    if (author) {
      filtre.author = author;
    }

    const articles = await Article.find(filtre).populate('author', 'name email');

    res.status(200).json({
      total: articles.length,
      articles
    });
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
};

const getArticleById = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id)
      .populate('author', 'name email');

    if (!article) {
      return res.status(404).json({
        message: `Article ${req.params.id} introuvable`
      });
    }

    res.status(200).json(article);
  } catch (err) {
    // Check if the error is a CastError (invalid ObjectId format)
    if (err.name === 'CastError') {
      return res.status(400).json({
        message: 'Invalid resource identifier (ObjectId expected)'
      });
    }

    res.status(500).json({
      message: err.message
    });
  }
};

const createArticle = async (req, res) => {
  try {
    const { title, content, authorId } = req.body || {};

    if (!title || !content || !authorId) {
      return res.status(400).json({
        message: 'title, content, and authorId are required'
      });
    }

    const author = await User.findById(authorId);

    if (!author) {
      return res.status(404).json({
        message: 'Author not found (invalid authorId)'
      });
    }

    const newArticle = await Article.create({
      title,
      content,
      author: authorId
    });

    const populatedArticle = await newArticle.populate('author', 'name email');

    res.status(201).json(populatedArticle);
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).json({
        message: 'Invalid resource identifier (ObjectId expected)'
      });
    }

    res.status(500).json({
      message: err.message
    });
  }
};

const updateArticle = async (req, res) => {
  try {
    const { title, content, authorId } = req.body || {};
    const updates = {};

    if (title !== undefined) updates.title = title;
    if (content !== undefined) updates.content = content;

    if (authorId !== undefined) {
      const author = await User.findById(authorId);

      if (!author) {
        return res.status(404).json({
          message: 'Author not found (invalid authorId)'
        });
      }

      updates.author = authorId;
    }

    const article = await Article.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    ).populate('author', 'name email');

    if (!article) {
      return res.status(404).json({
        message: 'Article not found for update'
      });
    }

    res.status(200).json(article);
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).json({
        message: 'Invalid resource identifier (ObjectId expected)'
      });
    }

    res.status(500).json({
      message: err.message
    });
  }
};

const deleteArticle = async (req, res) => {
  try {
    const article = await Article.findByIdAndDelete(req.params.id);

    if (!article) {
      return res.status(404).json({
        message: 'Article not found for deletion'
      });
    }

    res.status(200).json({
      message: 'Article deleted successfully',
      id: req.params.id
    });
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).json({
        message: 'Invalid resource identifier (ObjectId expected)'
      });
    }

    res.status(500).json({
      message: err.message
    });
  }
};

module.exports = {
  getAllArticles,
  createArticle,
  getArticleById,
  updateArticle,
  deleteArticle
};