const debug = require('debug')('app:routes/model/index.js');
const models = require('express').Router();
const blockModel = require('./block');
const likeModel = require('./like');
const matchModel = require('./match');
const ConversationModel = require('./conversation');
const viewModel = require('./view');

models.use('/block', blockModel);
models.use('/like', likeModel);
models.use('/match', matchModel);
models.use('/conversation', ConversationModel);
models.use('/view', viewModel);
module.exports = models;
