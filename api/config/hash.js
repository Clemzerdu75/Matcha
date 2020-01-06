const crypto = require('crypto');

module.exports.hash = (password) => {
  const hash = crypto.createHash('whirlpool');
  const data = hash.update(password, 'utf-8');
  const hashedPassword = data.digest('hex');
  return (hashedPassword);
};
