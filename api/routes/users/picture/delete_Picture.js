const debug = require('debug')(`app:${__filename.split('matcha/')[1]}`);
const fs = require('fs');
const driver = require('../../../config/database');

module.exports = ((req, res, next) => {
  const session = driver.session();
  if (!Array.isArray(req.User.deletedPic) || !req.User.deletedPic[0]) {
    next();
  } else {
    const AllPromise = req.User.deletedPic.map((remove) => {
      return new Promise((resolve, reject) => {
        const pathToRemove = `./public/${remove.replace('http://localhost:8080/', '')}`;
        fs.unlink(pathToRemove, (err) => {
          if (err) {
            reject();
          } else {
            resolve();
          }
        });
      });
    });
    Promise.all(AllPromise)
      .then(() => next())
      .catch((e) => debug(e));
  }
});
