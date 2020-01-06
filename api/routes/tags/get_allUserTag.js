const debug = require('debug')(`app:${__filename.split('matcha/')[1]}`);
const driver = require('../../config/database');

module.exports = ((req, res, next) => {
  const session = driver.session();
  // debug(req.params.pseudo);
  session.run('MATCH (a), (b:USER), (b)-[:ENJOY]->(a) RETURN a.type, a.name, b.pseudo')
    .then((result) => {
      session.close();
      req.allUserTag = {};
      if (result.records[0]) {
        result.records.forEach((record, i) => {
          if (record.get('b.pseudo') in req.allUserTag === false) { req.allUserTag[record.get('b.pseudo')] = []; }
          const tagObject = { name: record.get('a.name'), type: record.get('a.type') };
          req.allUserTag[record.get('b.pseudo')].push(tagObject);
        });
        debug('lol');
        next();
      } else {
        next();
      }
    })
    .catch((e) => {
      session.close();
      debug(new Error(e));
      res.status(400).send(e);
    });
});
