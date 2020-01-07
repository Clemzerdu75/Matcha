const debug = require('debug')(`app:${__filename.split('matcha/')[1]}`);
const driver = require('../../config/database');


module.exports = ((req, res, next) => {
  const session = driver.session();
  session.run(`MATCH (a:USER {pseudo : {pseudo}})
      SET a.reportCount = a.reportCount + 1
    RETURN a.reportCount, a.email`, {
    pseudo: req.body.pseudo2,
  })
    .then((result) => {
      session.close();
      if (!result.records[0]) {
        res.status(200).send('cannot report');
      } else {
        req.reportCount = result.records[0].get('a.reportCount').low;
        req.email = result.records[0].get('a.email');
        req.deleteUser = req.reportCount >= 5;
        next();
      }
    })
    .catch((e) => {
      debug(e);
      res.status(200).send('An error occured');
    });
});
