const crypto = require('../../config/hash');
const driver = require('../../config/database');
const randomTags = require('./init_links');

module.exports = (userData) => new Promise((resolve, reject) => {
  let sexOrientation = Math.floor(Math.random() * 3);
  switch (sexOrientation) {
    case 1:
      sexOrientation = 'heterosexual';
      break;
    case 2:
      sexOrientation = 'homosexual';
      break;
    case 3:
      sexOrientation = 'bisexual';
      break;
    default:
      sexOrientation = 'bisexual';
      break;
  }
  const popularity = Math.floor(Math.random() * 50);
  const arrondissement = Math.floor(Math.random() * 20);
  const postalCode = arrondissement > 9 ? `750${arrondissement}` : `7500${arrondissement}`;
  const description = `Hi everyone, welcome on my profile ! My name is ${userData.name},
  i'm ${userData.age} years old and i'm looking for fun here !`;
  const pseudo = userData.name[0] + userData.surname.replace(/\s/g, '').slice(0, 6);
  const session = driver.session();
  console.log(userData.birthday);
  session
    .run(`CREATE (a:USER {
          name: "${userData.name}",
          lastname:"${userData.surname}",
          pseudo:"${pseudo}",
          gender:"${userData.gender}",
          orientation:"${sexOrientation}",
          popularity:"${popularity}",
          description:"${description}",
          country:"${userData.region}",
          age:"${userData.age}",
          birthday:"${userData.birthday.dmy.replace('/', '-')}",
          email:"${userData.email}",
          lastConnect:"${Date.now()}",
          completed: "true",
          views: "",
          userStatus:"user",
          accountStatus: "completed",
          password:"${crypto.hash(userData.password)}",
          gallery:"${userData.photo}",
          profilPicture:"${userData.photo}",
          notification: "",
          newNotification: 0,
          lat: "", 
          lon: "", 
          city: "Paris", 
          postal: "${postalCode}",
          reportCount: 0
          }) RETURN ID(a)`)
    .then((result) => {
      result.records.forEach(async (record) => {
        await randomTags.addRandomSportTag(record.get('ID(a)').low);
        await randomTags.addRandomHobbyTag(record.get('ID(a)').low);
        await randomTags.addRandomMusicTag(record.get('ID(a)').low);
        await randomTags.addRandomDietTag(record.get('ID(a)').low);
        session.close();
      });
    })
    .then(() => {
      console.log(`USER ${pseudo} CREATED WITH HIS TAG`);
      resolve(true);
    })
    .catch((error) => {
      console.log(error);
      session.close();
    });
});
