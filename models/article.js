const mongoose = require('mongoose');
const Schema = mongoose.Schema;

mongoose.set('useCreateIndex', true)
var schema = new Schema({
  name: String,
  email: String,
  profile: {
    something: String,
    somethingElse: String
  }
});
schema.index({name: 'text', 'profile.something': 'text'});
const ArticleSchema = new Schema({
  title: {type: String, min: 5, max: 400, required: true},
  subtitle: {type: String, min: 5, required: false},
  description: {type: String, min: 5, max: 5000, required: true},
  owner: {type: Schema.Types.ObjectId, ref: 'User', required: true},
  category: {type: String, enum: ['sport', 'games', 'history'], required: true},
  createdAt: {type: Date, default: Date.now, required: true},
  updatedAt: {type: Date, default: Date.now, required: true}
});
ArticleSchema.index({ title: 'text' })

module.exports = mongoose.model('Article', ArticleSchema);