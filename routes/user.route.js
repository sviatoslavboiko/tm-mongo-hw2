const express = require('express');
const router = express.Router();

const userController = require('../controllers/user');

router.post('/', userController.createUser);

router
  .put('/:userId', userController.updateUser)
  .get('/:userId', userController.getUser)
  .delete('/:userId', userController.deleteUser)

router
  .get('/:userId/articles', userController.getArticles)
  
module.exports = router;