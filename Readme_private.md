# package used:
Normalement t'as rien a faire, mais en tout cas si ca plante installe ces packages

			-- BOOTSTRAP -- 
(Pour Suggestions.js / Profil.js / Search.js)
npm install --save bootstrap
npm install --save reactstrap react react-dom

+ ne pas oublier : import "bootstrap/dist/css/bootstrap.css" danss le fichier (mais cca normalement c'est bon )


#Comment ca marche?

// Dans l'etat //

.
Index.html(qui va se faire injecter du code par index.js)

-> index.js
Il va appeler le composant Matcha

--> Matcha.js
Fait le pont entre si l'user est deja loggue ou non.

---> Landing.js
Si user pas logue, il tombe sur la page d'accueil du site (avec la video), quii permettra au user de se logguer ou de s'inscire (page d'inscription geree depuis ici)

---> Body.js
Component qui va contenir "tout le site" avec la navbar et le header, celui qui devra gerer les differentes pages a partir de la navbar (pass encore gere)

----> Suggestions.js 
Contient la base de l'affichage des profils sur le site(simplement un tableau qui affiche le composant Profil en boucle) (dans l'etat c'est en travaux....)

----> Subscribing.js
La page qui permet de s'inscire, pas vraiment commence 

----> Search.js
Debut de l'implementation de la barre de recherche avec resultat en temps reel (!!).
A terme le meme affichage sera utilise que dansss suggestions.

-----> Profil.js
Component un peu particulier: il a deux forme: une simple pour l'affichage sur le site, et une forme complete (qui est represente par le component Card (Card.js)) permettant aux users de voir toute les infos, de se liker etc.

