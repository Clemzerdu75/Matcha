const debug = require('debug')(`app:${__filename.split('matcha/')[1]}`);
const neo4j = require('neo4j-driver').v1;
const driver = require('../../config/database');

module.exports = ((req, res, next) => {
  const session = driver.session();
  const resultPromise = session.writeTransaction((tx) => tx.run(
    'MATCH (n) DETACH DELETE n',
  ));
  resultPromise.then(() => {
    session.close();
    driver.close();
    debug('DB deleted');
    next();
  })
    .catch((e) => {
      res.status(400).send('error deleting db');
    });
});
