const fetch = require('node-fetch');
const addUser = require('./init_user');

module.exports = (userNb) => new Promise((resolve, reject) => {
  const nb = 100;
  fetch(`https://uinames.com/api/?amount=${nb}&region=france&ext`)
    .then((response) => response.json())
    .then(async (data) => {
      Object.keys(data).forEach(async (index) => {
        await addUser(data[index])
          .catch((e) => {
            console.log(e);
            reject(e);
          });
      });
      resolve();
    })
    .catch((e) => {
      reject(e);
    });
});
