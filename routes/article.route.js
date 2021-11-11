const express = require('express');
const router = express.Router();

const articleController = require('../controllers/article');

router.post('/', articleController.createArticle);

router
  .put('/:articleId', articleController.updateArticle)
  .get('/', articleController.getArticle)
  .delete('/:articleId', articleController.deleteArticle)

module.exports = router;