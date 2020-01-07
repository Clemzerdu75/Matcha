const debug = require('debug')(`app:${__filename.split('matcha/')[1]}`);
const models = require('express').Router();
const createLocation = require('./define_location');
const geolocalize = require('./geolocalise_user');
const modifyLocation = require('./modify_UserLocation');
/*
** GET middlewares
*/

models.put('/update', createLocation, geolocalize, modifyLocation, (req, res) => {
  res.status(200).send(JSON.stringify(req.user));
  //debug(req.user);
});

/*
** POST middlewares
*/

module.exports = models;
