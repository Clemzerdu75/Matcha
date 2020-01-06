# SUMMARY 
- I - Installation
- II - How it works

# I - INSTALLATION 
If you want to use the API on your local environnement :
- Install Neo4j (brew neo4j) on your computer
- Go on neo4j browser and connect with the initial login (neo4j | neo4j)
- Change the password to 'btollie' (or change the variable DB_PASS of the .env file accordingly)
- go to matcha/api folder and run the command npm install to get the dependencies.
- To get data in your DB, you can run 'node config/init/init_app.js'


# II - HOW IT WORKS 

- Root Folder
  - `.env`                    --> Made to configure the sensible environnement variables 
  - `server.js`               --> Configure the basics of the server and app, then use route folder to dispatch requests

- Config Folder
  - `database.js`             --> Used to create a fresh instance of driver, used to create new exchange session to run query on db
  - `hash.js`                 --> Return a hashed password
  - `regex.js`                --> contain all regex used threw the app

- Routes Folder
  - `index.js`                --> Manage the login route, and dispatch into the folders following the other requests:

 ## REQUESTS SUMMARY

| PATH | METHOD | REQUIRE | RETURN | RETURN TYPE |
| :--: |  :--:  |  :--:   |  :--:  |    :--:     |
| *** init Folder *** |||||
|`/init`|  POST |   { "userNb":{1..500} } | Confirmation | String |
|`/init/reset`|  POST | { "userNb" } | Confirmation | String |
|`/init/delete`|  DELETE |  | Confirmation | String |
||||||
| *** relation Folder *** |||||
||*** Block Folder ***||||
|`/relation/block/userblock/:pseudo`| GET | | List of users blocked by @pseudo | Object Array |
|`/relation/block/blockuser/:pseudo`| GET | | List of users who blocked @pseudo | Object Array |
|`/relation/block/new`|  POST |   { "pseudo1", "pseudo2" } | Confirmation | String |
|`/relation/block/delete`|  DELETE |   { "pseudo1", "pseudo2" } | Confirmation | String |
||*** Like Folder ***||||
|`/relation/like/userlike/:pseudo`| GET | | List of users liked by @pseudo | Object Array |
|`/relation/like/likeuser/:pseudo`| GET | | List of users who liked @pseudo | Object Array |
|`/relation/like/new`|  POST |   { "pseudo1", "pseudo2" }  | Confirmation | String |
|`/relation/like/delete`|  DELETE |   { "pseudo1", "pseudo2" } | Confirmation | String |
||*** Match Folder ***||||
|`/relation/match/:pseudo`|  GET | | List of users who match @pseudo | Object Array |
|`/relation/match/delete`|  DELETE |   { "pseudo1", "pseudo2" } | Confirmation | String 
||||||
||*** Conversation Folder ***||||
|`/relation/conversation/:pseudo1/:pseudo2`| GET | | Historic of Messages | Object Array |
|`/relation/conversation/create`|  POST |   { "pseudo1", "pseudo2" } | Confirmation | String |
|`/relation/conversation/update`|  PUT |   { "sender", "dest" }  | Confirmation | String |
||||||
| *** Tag Folder *** |||||
|`/tag/:pseudo`|  GET | | List of tags @pseudo likes | Object Array |
|`/tag/new`|  POST |   { "type", "name" } | Confirmation | String |
||||||
| *** User Folder *** |||||
|`/user/all`| GET || Infos from all User | Object Array |
|`/user/:pseudo`| GET || Infos from @pseudo | Object |
|`/user/new`| POST | { UserInfos } | Confirmation | String |
|`/user/modify`| PUT | { UserInfos } | new User | Object |
|`/user/delete`|  DELETE |   { "pseudo" } | Confirmation | String 
||*** Mail Folder ***||||
|`/user/mail/all`| GET || mail from all User | Object Array |
||*** password Folder ***||||
|`/user/password/:pseudo`|  GET || password from @pseudo | Object |
||*** pseudo Folder ***||||
|`/user/pseudo/all`| GET || pseudo from all User | Object Array |
