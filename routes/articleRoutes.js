const express = require('express');
const router = express . Router () ;
const articleController = require ('../controllers/ArticleController') ;
// Remarque capitale : Le pré fixe ’/ api/ articles ’ sera dé fini dans server .js.
// Ici , ’/ ’ repr é sente donc la racine de la ressource : ’/ api/ articles ’ !
router . get('/', articleController . getAllArticles ) ;
router . get('/:id', articleController . getArticleById ) ;
router . post ('/', articleController . createArticle ) ;
router . put('/:id', articleController . updateArticle ) ;
router . delete ('/:id', articleController . deleteArticle ) ;
module . exports = router ;