const debug = require('debug')(`app:${__filename.split('matcha/')[1]}`);
const crypto = require('crypto');
const driver = require('../config/database');


module.exports = (user) => new Promise((resolve, reject) => {
  crypto.randomBytes(48, (err, buffer) => {
    const token = buffer.toString('hex');
    const session = driver.session();
    session.run(`MATCH (a:USER {pseudo : "${user}"})
      SET a.validationToken = {token} RETURN a.validationToken`, {
      token,
    })
      .then((result) => {
        session.close();
        if (!result.records[0]) {
          session.close();
          debug(new Error('couldn\'t find user'));
        } else {
          resolve(token);
        }
      })
      .catch((e) => {
        reject();
      });
  });
});
