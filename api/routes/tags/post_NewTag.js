const debug = require('debug')(`app:${__filename.split('matcha/')[1]}`);
const driver = require('../../config/database');


module.exports = ((req, res, next) => {
  const session = driver.session();
  // debug(req.params.pseudo);
  session.run(`CREATE (a:TAG {
    name:"${req.body.name}",
    type:"${req.body.type}"
    }) RETURN a`)
    .then((result) => {
      if (!result.records[0]) {
        debug(new Error('Cannot create Tag'));
      }
      debug(result.records[0].get('a'));
      req.tag = result.records[0].get('a').properties;
      session.close();
      next();
    })
    .catch((e) => {
      session.close();
      debug(new Error(e));
      res.status(400).send(e);
    });
});
