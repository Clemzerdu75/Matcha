module.exports.checkname = (name) => new Promise((resolve, reject) => {
  if (/^[A-Za-z'àáâãäåçèéêëìíîïðòóôõöùúûüýÿ-]+$/i.test(name)) resolve();
  else reject(new Error('Bad name, please try again'));
});

module.exports.checklastname = (lastname) => new Promise((resolve, reject) => {
  if (/^[A-Za-z'àáâãäåçèéêëìíîïðòóôõöùúûüýÿ-]+$/i.test(lastname)) resolve();
  else reject(new Error('Bad lastname, please try again'));
});

module.exports.checkmail = (email) => new Promise((resolve, reject) => {
  if (/^[^\W][a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)*@[a-zA-Z0-9_]+(\.[a-zA-Z0-9_]+)*\.[a-zA-Z]{2,4}$/i.test(email)) resolve();
  else reject(new Error('Bad email, please try again'));
});

module.exports.checkpseudo = (pseudo) => new Promise((resolve, reject) => {
  if (/^[A-Za-z0-9'-]+$/i.test(pseudo)) resolve();
  else reject(new Error('Bad pseudo, please try again'));
});

module.exports.checkpassword = (password) => new Promise((resolve, reject) => {
  if (/^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\w\d\s:])([^\s]){8,16}$/i.test(password)) resolve();
  else reject(new Error('Bad password, please try again'));
});

module.exports.checkgender = (gender) => new Promise((resolve, reject) => {
  if (gender === 'male' || gender === 'female') resolve();
  else reject(new Error('Bad gender, please try again'));
});

module.exports.checkorientation = (orientation) => new Promise((resolve, reject) => {
  if (orientation === 'heterosexual' || orientation === 'homosexual' || orientation === 'bisexual') resolve();
  else reject(new Error('Bad orientation, please try again'));
});
