const debug = require('debug')(`app:${__filename.split('matcha/')[1]}`);

module.exports = (object) => new Promise((resolve, reject) => {
  debug(typeof object);
  if (typeof object !== 'object') reject(new Error('bad type'));
  if (!('message' in object)) reject(new Error('bad message'));
  if (!('sender' in object)) reject(new Error('bad sender'));
  if (!('dest' in object)) reject(new Error('bad dest'));
  const message = `${object.message};\\%$${object.sender};\\%$${Date.now()}/&^`;
  resolve(message);
});
