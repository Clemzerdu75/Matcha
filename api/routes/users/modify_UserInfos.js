const debug = require('debug')(`app:${__filename.split('matcha/')[1]}`);
const moment = require('moment');
const driver = require('../../config/database');
const crypto = require('../../config/hash');


module.exports = ((req, res, next) => {
  const now = moment();
  const birthDate = moment(req.User.birthday, 'DD/MM/YYYY');
  let yearDiff = moment.duration(now - birthDate).as('years');
  yearDiff = Math.floor(yearDiff);
  const accountStatus = req.body.data.completed === 0 ? 'validated' : 'completed';
  debug(req.body.data.completed);
  const session = driver.session();
  debug(req.User.birthday);
  session.run(`MATCH (a:USER {pseudo :{oldPseudo}})
  SET 
    a.name = {name},
    a.lastname = {lastname},
    a.pseudo = {pseudo},
    a.gender = {gender},
    a.orientation = {orientation},
    a.description = {description},
    a.country = {country},
    a.age = {age},
    a.birthday = {birthday},
    a.email = {email},
    a.lat = {lat},
    a.lon = {lon},
    a.accountStatus = {accountSt}
    RETURN a`, {
    oldPseudo: req.User.Oldpseudo,
    description: req.User.description,
    name: req.User.name,
    lastname: req.User.lastname,
    pseudo: req.User.pseudo,
    gender: req.User.gender,
    orientation: req.User.orientation,
    country: req.User.country,
    age: yearDiff,
    birthday: req.User.birthday,
    email: req.User.email,
    lat: req.User.lat,
    lon: req.User.lon,
    accountSt: accountStatus,
  })
    .then((result) => {
      if (!result.records[0]) {
        debug(result);
        next();
      } else {
        req.user = result.records[0].get('a').properties;
        session.close();
        next();
      }
    })
    .catch((e) => {
      session.close();
      debug(new Error(e));
      res.status(200).send('failure');
    });
});
