'use strict';

const _ = require('lodash');
const Article = require('../models/article');
const User = require('../models/user');

module.exports = {createArticle, updateArticle, getArticle, deleteArticle};

async function createArticle(req, res, next) {
  try {
      const fields = [
        'title',
        'subtitle',
        'description',
        'owner',
        'category',
        'createdAt',
        'updatedAt'
      ]
      const payload = _.pick(req.body, fields);
      const userId = req.body.owner
      const existingUser = await User.findOne({ '_id': userId});
      console.log(existingUser);
      if(!existingUser){
        throw utilError.badRequest('User not exists')
      } else {
        await User.updateOne({_id : userId}, {$inc: {numberOfArticles: 1}})
        const article = new Article(payload);
        const newArticle = await article.save().then(newArticle => newArticle.populate('owner').execPopulate());
        
        return res.status(200).json(newArticle);
      }
    } catch (error) {
      console.log(error)
      next(error)
    }
}

async function updateArticle(req, res, next) {
  const articleId = req.params.articleId;
  const body = req.body;
  const userId = body.owner
  console.log(body);
  try {
    const existingArticle = await Article.findOne({_id: articleId});
    const existingUser = await User.findOne({_id: userId});

    if(!existingArticle){
      throw utilError.badRequest('Article not exists')
    }  
    if(!existingUser){
      throw utilError.badRequest('User not exists')
    }  
    if(body.title){
      existingArticle.title = body.title
    }
    if(body.description){
      existingArticle.description = body.description;
    }

    const updateArticle = await existingArticle.save().then(newArticle => newArticle.populate('owner').execPopulate());

    return res.status(200).json(updateArticle);
  } catch (error) {
    console.log(error)
    next(error)
  }
}

async function getArticle(req, res, next) {
  try {
      const {
        query : {skip = 0, limit = 10, search = '', sortFromClient}
      } = req;

      const sort = util.sort(sortFromClient);
      const filter = {$regex: new RegExp(util.escapeRegExpChars(search), 'i')} 
      const query = {$or: [{title: filter}, {description: filter}]}
      const result = await Article.find(query)
        .populate('owner')
        .sort(sort)
        .skip(skip)
        .limit(limit)

      return res.status(200).json(result);
  } catch (error) {
      console.log(error)
      next(error)
  }
}

async function deleteArticle(req, res, next) {
  const articleId = req.params.articleId;
  const userId = req.body.owner

  console.log(articleId);
  try {
    await User.updateOne({_id : userId}, {$inc: {numberOfArticles: -1}})
    const result = await Article.findByIdAndDelete(articleId)
    
    return res.status(200).json(result);
  } catch (error) {
    console.log(error)
    next(error)
  }
}
