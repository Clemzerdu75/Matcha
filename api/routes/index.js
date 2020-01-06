const routes = require('express').Router();
const userModels = require('./users');
const relationModels = require('./relations');
const initModels = require('./init');
const tagModels = require('./tags');
const checkToken = require('../config/checkToken');
const allInfos = require('./users/get_AllUsersInfos');
const allTags = require('./tags/get_allUserTag');

routes.use('/init', initModels);
routes.use('/user', checkToken, userModels);
routes.use('/relation', checkToken, relationModels);
routes.use('/tag', checkToken, tagModels);


routes.post('/', (req, res) => {
  res.status(200).json({ message: 'Connected!' });
});


routes.get('/search', allTags, (req, res) => {
  res.status(200).send(req.allUserTag);
});

module.exports = routes;
