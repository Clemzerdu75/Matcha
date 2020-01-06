const debug = require('debug')(`app:${__filename.split('matcha/')[1]}`);
const driver = require('../../../config/database');

module.exports = ((req, res, next) => {
  if (req.deleteUser === true) {
    next();
  } else {
    const session = driver.session();
    session.run(`MATCH (a:USER {pseudo : "${req.body.pseudo1}"}),
                        (b:USER {pseudo : "${req.body.pseudo2}"}) 
                  MERGE (a)-[c:BLOCK]->(b)
                  ON CREATE set c.date = timestamp(), c.found = true
                    WITH c, c.found as result
                    REMOVE c.found
                  RETURN result`)
      .then((result) => {
        if (!result.records[0]) {
          session.close();
          debug(new Error('Can\'t find user'));
          res.status(400).send('Can\'t find user');
        } else if (!result.records[0].get('result')) {
          session.close();
          debug(new Error('This user is already blocked'));
          res.status(400).send('This user is already blocked');
        } else {
          session.close();
          next();
        }
      })
      .catch((e) => {
        session.close();
        debug(new Error(e));
        res.status(500).send(e);
      });
  }
});
