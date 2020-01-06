const crypto = require('../../config/hash');
const driver = require('../../config/database');
const randomTags = require('./init_links');

module.exports = () => new Promise((resolve, reject) => {
  const sexOrientation = 'heterosexual';
  const description = 'My name is Benjamin and , i\'m the master of this website';
  const pseudo = 'btollie';
  const session = driver.session();
  session
    .run(`CREATE (a:USER {
    name: "Benjamin",
    lastname:"Tollié",
    pseudo:"Btollie",
    gender:"male",
    orientation:"${sexOrientation}",
    popularity:"50",
    description:"${description}",
    country:"France",
    age:"25",
    views: "",
    birthday:"24-06-1994",
    email:"benjamintollie.perso@gmail.com",
    userStatus:"admin",
    accountStatus: "completed",
    lastConnect:"",
    password:"${crypto.hash('Rootroot42?')}",
    gallery:" https://uinames.com/api/photos/male/7.jpg",
    notification: "",
    newNotification: 0,
    lat: "", 
    lon: "", 
    city: "", 
    postal: "",
    reportCount: 0
    }),
    (b:USER {
      name: "Clement",
      lastname:"Fauvelle",
      pseudo:"Clemzer",
      gender:"male",
      orientation:"bisexual",
      popularity:"50",
      views: "",
      description:"My name is Clemzer du terter' and , i'm the master of this website too",
      country:"France",
      age:"26",
      birthday:"19-05-1993",
      email:"cfauvell@student.42.fr",
      completed: "true",
      userStatus:"admin",
      accountStatus: "completed",
      lastConnect:"",
      password:"${crypto.hash('Coucou!75')}",
      profilPicture:"https://uinames.com/api/photos/male/8.jpg",
      gallery:"https://uinames.com/api/photos/male/8.jpg",
      notification: "",
      newNotification: 0,
      lat: "", 
      lon: "", 
      city: "", 
      postal: "",
      reportCount: 0
      })
     RETURN ID(a), ID(b)`)
    .then((result) => {
      result.records.forEach(async (record) => {
        await randomTags.addRandomSportTag(record.get('ID(a)').low);
        await randomTags.addRandomHobbyTag(record.get('ID(a)').low);
        await randomTags.addRandomMusicTag(record.get('ID(a)').low);
        await randomTags.addRandomDietTag(record.get('ID(a)').low);
        await randomTags.addRandomSportTag(record.get('ID(b)').low);
        await randomTags.addRandomHobbyTag(record.get('ID(b)').low);
        await randomTags.addRandomMusicTag(record.get('ID(b)').low);
        await randomTags.addRandomDietTag(record.get('ID(b)').low);
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
