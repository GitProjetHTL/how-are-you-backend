var express = require("express");
var router = express.Router();

require("../models/connection");
const Cards = require("../models/cards");
const User = require("../models/user");
const { checkBody } = require("../modules/checkBody");
//******** recuperer toutes les cartes  */
//afficher toutes les cards
router.get("/all/:token", (req, res) => {
  //verifier si les champs sont vides
  User.findOne({ token: req.params.token }).then((data) => {
    if (data === null) {
      res.json({ result: false, error: "User not found" });
      return;
    }
    //afficher toutes les cards selon user id
    Cards.find() // Trouver les cards aimés par l'utilisateur spécifié
      .then((data) => {
        res.json({ result: true, data });
      });
  });
});

/**********recuperer les cartes par target********************** */


router.get("/search/:token/:search", (req, res) => {

  //verifier si les champs sont vides
  User.findOne({ token: req.params.token }).then((data) => {
    if (data === null) {
      res.json({ result: false, error: "User not found" });
      return;
    }
    //afficher toutes les cards selon user id
    Cards.find({ target: { $regex: new RegExp(req.params.search, "i") } }) // Trouver les audios aimés par l'utilisateur spécifié
      .then((data) => {
        res.json({ result: true, data });
      });
  });
});
/*******************************ajouter les likes/dislike***************************************** */

router.put("/like", (req, res) => {
  //verifier si les champs sont vides
  if (!checkBody(req.body, ["token", "cardsID"])) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }
  //verifier si le token existe
  User.findOne({ token: req.body.token }).then((user) => {
    if (user === null) {
      res.json({ result: false, error: "User not found" });
      return;
    }
    // verifier si cardsID existe
    Cards.findById(req.body.cardsID).then((cards) => {
      if (!cards) {
        res.json({ result: false, error: "Cards not found" });
        return;
      }
      //verifie si ID d'un user est dans le tableaux like de audio
      if (cards.like.includes(user._id)) {
        // User already liked the tweet
        Cards.updateOne({ _id: cards._id }, { $pull: { like: user._id } }) // Remove user ID from likes
          .then(() => {
            res.json({ result: true, like: "false" });
            // console.log(cards);
          });
      } else {
        // User has not liked the tweet
        Cards.updateOne({ _id: cards._id }, { $push: { like: user._id } }) // Add user ID to likes
          .then(() => {
            res.json({ result: true, like: "true" });
            // console.log(cards);
          });
      }
    });
  });
});

//************************************************************* */

//afficher toutes les cards like
router.get("/all/:token/liked-by/:userId", (req, res) => {
  //verifier si les champs sont vides
  User.findOne({ token: req.params.token }).then((data) => {
    if (data === null) {
      res.json({ result: false, error: "User not found" });
      return;
    }
    //afficher toutes les cartes selon user id
    Cards.find({ like: req.params.userId }) // Trouver les cartes aimés par l'utilisateur spécifié
      .then((data) => {
        console.log(data);
        res.json({ result: true, data });
      });
  });
});

module.exports = router;
