const neo4j = require('neo4j-driver').v1;
const driver = require('../../config/database');
const allTags = require('./initial_data');

module.exports = () => new Promise((resolve, reject) => {
  Object.keys(allTags).forEach(async (tagType) => {
    allTags[tagType].forEach((element) => {
      const session = driver.session();
      session
        .run(`CREATE (:TAG {type: "${tagType}", name:"${element}"})`)
        .then(() => {
          session.close(() => {
            console.log(`tag ${element} in ${tagType} created`);
          });
        })
        .catch((e) => {
          session.close();
          console.log(e);
        });
    });
  });
});
