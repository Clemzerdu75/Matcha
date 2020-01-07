const debug = require('debug')(`app:${__filename.split('matcha/')[1]}`);

module.exports = (object) => new Promise((resolve, reject) => {
  if (typeof object !== 'object') reject(new Error('bad type'));
  if (!('title' in object)) reject(new Error('bad message'));
  if (!('sender' in object)) reject(new Error('bad sender'));
  if (!('message' in object)) reject(new Error('bad message'));
  if (!('photo' in object)) reject(new Error('bad message'));
  const message = `${object.title};${object.sender};${object.message};${Date.now()};${object.photo}//+`;
  resolve(message);
});
