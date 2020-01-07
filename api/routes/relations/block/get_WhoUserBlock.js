const debug = require('debug')(`app:${__filename.split('matcha/')[1]}`);
const driver = require('../../../config/database');


module.exports = ((req, res, next) => {
  const session = driver.session();
  // debug(req.params.pseudo);
  session.run(`MATCH (a:USER {pseudo : "${req.params.pseudo}"}), (b:USER)
                WHERE (a)-[:BLOCK]->(b)     
                RETURN b.pseudo`)
    .then((result) => {
      req.allBlock = [];
      if (result.records[0]) {
        debug('here');
        session.close();
        result.records.forEach((record, i) => {
          req.allBlock[i] = record.get('b.pseudo');
          debug(record.get('b.pseudo'));
        });
        next();
      } else {
        res.status(200).send([]);
      }
    })
    .catch((e) => {
      session.close();
      debug(new Error(e));
      res.status(400).send(e.message);
    });
});
