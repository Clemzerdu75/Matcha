const neo4j = require('neo4j-driver').v1;
const tags = require('./initial_data');
const driver = require('../../config/database');

module.exports.addRandomMusicTag = (id) => new Promise((resolve, reject) => {
  const arraySize = tags.music.length;
  const halfSet = arraySize / 2;
  const randomNumbers = [
    Math.floor(Math.random() * halfSet),
    Math.floor(Math.random() * (arraySize - halfSet)) + halfSet,
  ];
  const session = driver.session();
  session
    .run(
      `MATCH (a:USER), (m1:TAG {name:"${tags.music[randomNumbers[0]]}"}), (m2:TAG {name:"${tags.music[randomNumbers[1]]}"}) WHERE ID(a) = ${id} CREATE (a)-[:ENJOY]->(m1), (a)-[:ENJOY]->(m2)`,
    )
    .then(() => {
      // console.log('Music tag links created')
      session.close();
      resolve(true);
    })
    .catch((e) => {
      console.log(e);
      resolve(false);
    });
});

module.exports.addRandomHobbyTag = (id) => new Promise((resolve, reject) => {
  const arraySize = tags.hobby.length;
  const halfSet = arraySize / 2;
  const randomNumbers = [
    Math.floor(Math.random() * halfSet),
    Math.floor(Math.random() * (arraySize - halfSet)) + halfSet,
  ];
  const session = driver.session();
  session
    .run(
      `MATCH (a:USER), (h1:TAG {name:"${tags.hobby[randomNumbers[0]]}"}), (h2:TAG {name:"${tags.hobby[randomNumbers[1]]}"}) WHERE ID(a) = ${id} CREATE (a)-[:ENJOY]->(h1), (a)-[:ENJOY]->(h2)`,
    )
    .then(() => {
      // console.log('Hobby tag links created')
      session.close();
      resolve(true);
    })
    .catch((e) => {
      console.log(e);
      resolve(false);
    });
});

module.exports.addRandomSportTag = (id) => new Promise((resolve, reject) => {
  const arraySize = tags.sport.length;
  const halfSet = arraySize / 2;
  const randomNumbers = [
    Math.floor(Math.random() * halfSet),
    Math.floor(Math.random() * (arraySize - halfSet)) + halfSet,
  ];
  const session = driver.session();
  session
    .run(
      `MATCH (a:USER), (s1:TAG {name:"${tags.sport[randomNumbers[0]]}"}), (s2:TAG {name:"${tags.sport[randomNumbers[1]]}"}) WHERE ID(a) = ${id} CREATE (a)-[:ENJOY]->(s1), (a)-[:ENJOY]->(s2)`,
    )
    .then(() => {
      session.close();
      resolve(true);
    })
    .catch((e) => {
      console.log(e);
      resolve(false);
    });
});

module.exports.addRandomDietTag = (id) => new Promise((resolve, reject) => {
  const arraySize = tags.hobby.length;
  const randomNumbers = Math.floor(Math.random() * arraySize);
  const session = driver.session();
  session
    .run(
      `MATCH (a:USER), (d:TAG {name:"${tags.hobby[randomNumbers]}"}) WHERE ID(a) = ${id} CREATE (a)-[:ENJOY]->(d)`,
    )
    .then(() => {
      // console.log('Diet tag link created')
      session.close();
      resolve(true);
    })
    .catch((e) => {
      console.log(e);
      resolve(false);
    });
});
