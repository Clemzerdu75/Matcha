const debug = require('debug')(`app:${__filename.split('matcha/')[1]}`);
const driver = require('../../../config/database');


module.exports = ((req, res, next) => {
  const session = driver.session();
  // debug(req.params.pseudo);
  session.run(`MATCH (a:USER {pseudo : "${req.body.pseudo1}"}),
                      (b:USER {pseudo : "${req.body.pseudo2}"}),
                      ((a)-[c:BLOCK]->(b))
                DELETE c     
                RETURN a, b`)
    .then((result) => {
      debug(result.records[0]);
      if (!result.records[0]) {
        session.close();
        debug(new Error('Can\'t delete block relationship'));
        res.status(400).send('Can\'t delete block relationship');
      } else {
        session.close();
        next();
      }
    })
    .catch((e) => {
      session.close();
      debug(new Error(e));
      res.status(400).send(e);
    });
});
