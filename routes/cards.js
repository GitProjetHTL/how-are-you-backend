var express = require("express");
var router = express.Router();

require("../models/connection");
const Cards = require("../models/cards");
const User = require("../models/user");
const { checkBody } = require("../modules/checkBody");

//******** recuperer toutes les cartes  */

router.get("/all/:token", (req, res) => {
  //1. verifier si les champs sont vides
  User.findOne({ token: req.params.token }).then((data) => {
    if (data === null) {
      res.json({ result: false, error: "User not found" });
      return;
    }
    //2. afficher toutes les cards selon user id
    Cards.find() // Trouver les cards aimés par l'utilisateur spécifié
      .then((data) => {
        res.json({ result: true, data });
      });
  });
});

/**********recuperer les cartes par target********************** */

router.get("/search/:search", (req, res) => {
  //afficher toutes les cards selon user id
  Cards.find({ target: { $regex: new RegExp(req.params.search, "i") } }) // Trouver les cards aimés par l'utilisateur spécifié
    .then((data) => {
      res.json({ result: true, data });
    });
});

/*******************************ajouter les likes/dislike***************************************** */

router.put("/like", (req, res) => {
  //1. verifier si les champs sont vides
  if (!checkBody(req.body, ["token", "cardsID"])) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }
  //2. verifier si le token existe
  User.findOne({ token: req.body.token }).then((user) => {
    // console.log(user);
    if (user === null) {
      res.json({ result: false, error: "User not found" });
      return;
    }
    //3. verifier si cardsID existe
    Cards.findById(req.body.cardsID).then((cards) => {
      // console.log(cards.likes);
      if (!cards) {
        res.json({ result: false, error: "Cards not found" });
        return;
      }
      // console.log(cards);
      // 4.verifie si ID d'un user est dans le tableaux like de cards

      if (cards.likes.indexOf(user._id) !== -1) {
        // l'utilisateur a déja like les cards
        Cards.updateOne({ _id: cards._id }, { $pull: { likes: user._id } }) // retirer l userID des like
          .then(() => {
            res.json({ result: false, like: false });
            // console.log(cards);
          });
      } else {
        // l'utilisateur a pas encore like les cards
        Cards.updateOne({ _id: cards._id }, { $push: { likes: user._id } }) // ajouer l'userID aux like
          .then(() => {
            res.json({ result: true, like: true });
            // console.log(cards);
          });
      }
    });
  });
});

//************************************************************* */

//afficher toutes les cards like
router.get("/all/:token/liked-by/:userId", (req, res) => {
  //1. verifier si les champs sont vides
  User.findOne({ token: req.params.token }).then((data) => {
    if (data === null) {
      res.json({ result: false, error: "User not found" });
      return;
    }
    //2. afficher toutes les cartes selon user id
    Cards.find({ likes: req.params.userId }) // Trouver les cartes aimés par l'utilisateur spécifié
      .then((data) => {
        // console.log(data);
        res.json({ result: true, data: data });
      });
  });
});

module.exports = router;
