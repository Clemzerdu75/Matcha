const fs = require('fs');
const readline = require('readline');
const debug = require('debug')(`app:${__filename.split('matcha/')[1]}`);
const createConstraints = require('./init_constraints');
const createTags = require('./init_tags');
const generateUser = require('./generate_user');
const generateAdmin = require('./init_admin');

module.exports = ((req, res, next) => {
  createConstraints()
    .then(() => {
      createTags()
        .catch((e) => {
          res.status(400).send('error');
        });
    })
    .then(() => {
      req.cities = [];
      fs.readFile('routes/init/villes_france.csv', 'utf8', (err, data) => {
        if (err) {
          res.status(500).send(err);
        } else {
          Promise.all([
            generateUser(req.body.userNb),
            generateAdmin()])
            .then(() => {
              next();
            })
            .catch((e) => {
              res.status(400).send('error');
            });
        }
      });
    })
    .catch((e) => {
      console.log(e);
    });
});
