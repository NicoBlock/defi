# Voting Dapp
> Alyra défi

Simple DApp d'un système de votes.

L'administrateur enregistre des adresses d'utilisateurs qui seront ainsi autorisés à envoyer des propositions puis de voter pour désigner la gagnante, celle qui aura obtenu le plus grand nombre de votes.
Une fois les votes comptabilisés, l'ID, la description et le nombre de votes de la proposition gagante pourra être affichée sans restrictions.

La DApp est développée avec Truffle et React.

Dépendances NPM : 
- `@openzeppelin/contracts`
- `@truffle/hdwallet-provider`
- `dotenv`

Pour les tests (en option dev), 
- `@openzeppelin/test-helpers`

## Installation

- Cloner le repo en local
- A la racine du projet : `npm init` (packages listés dans *package.json*)
- Dans le dossier *client/src* : `npm init` (idem, *package.json*)
- Lancer la DApp en local avec `npm run start`

## Déploiement
La DApp est déployée sur le réseau de test Ropsten et sur Heroku à l'adresse :
https://voting-alyra-dapp.herokuapp.com/
Et sur GitHub :
https://NicoBlock.github.io/defi
