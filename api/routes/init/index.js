const debug = require('debug')('app:routes/model/index.js');
const models = require('express').Router();
const deleteDb = require('./delete_db_content');
const initApp = require('./init_app');

models.post('/', initApp, (req, res) => {
  res.status(200).json({ message: `${req.body.userNb} created` });
});

models.get('/reset', deleteDb, initApp, (req, res) => {
  res.status(200).json({ message: 'Fresh db created' });
});

models.delete('/delete', deleteDb, (req, res) => {
  res.status(200).json({ message: 'Db deleted' });
});

module.exports = models;
