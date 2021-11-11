'use strict';

const _ = require('lodash');
const User = require('../models/user');
const Article = require('../models/article')

module.exports = {createUser, updateUser, getUser, deleteUser, getArticles};

async function createUser(req, res, next) {
  try {
      const fields = [
        'firstName',
        'lastName',
        'role',
        'createdAt',
        'numberOfArticles',
        'nickname'
      ]
      const payload = _.pick(req.body, fields);
      const user = new User(payload);
      // ----
      const newUser = await user.save();

      return res.status(200).json(newUser);
    } catch (error) {
      console.log(error)
      next(error)
    }
}

async function updateUser(req, res, next) {
  const userId = req.params.userId;
  const body = req.body;

  try {
    const existingUser = await User.findOne({_id: userId});

    if(!existingUser){
      throw utilError.badRequest('User not exists')
    }  
    if(body.firstName){
      existingUser.firstName = body.firstName
    }
    if(body.lastName){
      existingUser.lastName = body.lastName;
    }
    if(body.role){
      existingUser.role = body.role;
    }
    if(body.nickname){
      existingUser.nickname = body.nickname;
    }

    const updateUser = await existingUser.save();

    return res.status(200).json(updateUser);
  } catch (error) {
    console.log(error)
    next(error)
  }
}

async function getUser(req, res, next) {
  try {
    const userId = req.params.userId;
    const getUser = await User.findOne({_id: userId})
    const getUsersArticles = await Article.find({owner: userId}).populate('owner')
    const result = { user: getUser, articles: getUsersArticles}
    return res.status(200).json(result);
  } catch (error) {
    console.log(error)
    next(error)
  }
}

async function deleteUser(req, res, next) {
  const userId = req.params.userId;

  try {
    const result = await User.findByIdAndDelete(userId)

    return res.status(200).json(result);
  } catch (error) {
    console.log(error)
    next(error)
  }
}

async function getArticles(req, res, next) {
  try {
    const userId = req.params.userId;
    const getUsersArticles = await Article.find({owner: userId}).populate('owner')

    return res.status(200).json(getUsersArticles);
  } catch (error) {
    console.log(error)
    next(error)
  }
}