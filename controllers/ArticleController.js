
const articles = [
  { id: 1, title: 'Welcome to the blog', author: 'Admin' },
  { id: 2, title: 'My first Express server', author: 'Aya' },
  { id: 3, title: 'Testing an API with Postman', author: 'Aya' }
];

let prochainId = 4;

// GET : Afficher tous les articles ou filtrer par auteur
const getAllArticles = (req, res) => {
  const { author } = req.query;
  let resultat = articles;

  if (author) {
    resultat = articles.filter(a => a.author === author);
  }

  res.status(200).json({
    total: resultat.length,
    articles: resultat
  });
};

// GET : Chercher un article par ID
const getArticleById = (req, res) => {
  const id = Number(req.params.id);
  const article = articles.find(a => a.id === id);

  if (!article) {
    return res.status(404).json({
      error: `Article ${id} introuvable`
    });
  }

  res.status(200).json(article);
};

// POST : Créer un article
const createArticle = (req, res) => {
  const { title, author } = req.body || {};

  if (!title || !author) {
    return res.status(400).json({
      error: "Le titre et l'auteur sont obligatoires"
    });
  }

  const nouvelArticle = {
    id: prochainId++,
    title,
    author
  };

  articles.push(nouvelArticle);

  res.status(201).json({
    message: 'Article créé',
    article: nouvelArticle
  });
};

// PUT : Modifier un article
const updateArticle = (req, res) => {
  const id = Number(req.params.id);
  const { title, author } = req.body || {};

  const index = articles.findIndex(a => a.id === id);

  if (index === -1) {
    return res.status(404).json({
      error: `Article ${id} introuvable`
    });
  }

  if (title) articles[index].title = title;
  if (author) articles[index].author = author;

  res.status(200).json({
    message: 'Article mis à jour',
    article: articles[index]
  });
};

// DELETE : Supprimer un article
const deleteArticle = (req, res) => {
  const id = Number(req.params.id);
  const index = articles.findIndex(a => a.id === id);

  if (index === -1) {
    return res.status(404).json({
      error: `Impossible de supprimer : article ${id} introuvable`
    });
  }

  articles.splice(index, 1);

  res.status(200).json({
    message: `Article ${id} supprimé avec succès`
  });
};

module.exports = {
  getAllArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle
};
