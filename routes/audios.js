var express = require("express");
var router = express.Router();

require("../models/connection");
const User = require("../models/user");
const Audio = require("../models/audios");
const { checkBody } = require("../modules/checkBody");

//route pour like les audios
router.put("/like", (req, res) => {
  //1. verifier si les champs sont vides
  if (!checkBody(req.body, ["token", "audioID"])) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }
  //2. verifier si le token existe
  User.findOne({ token: req.body.token }).then((user) => {
    if (user === null) {
      res.json({ result: false, error: "User not found" });
      return;
    }
    //3. verifier si audioID existe
    Audio.findById(req.body.audioID).then((audio) => {
      if (!audio) {
        res.json({ result: false, error: "Audios not found" });
        return;
      }
      //4. verifie si ID d'un user est dans le tableaux like de audio
      if (audio.like.includes(user._id)) {
        // l'utilisateur a deja like l audio
        Audio.updateOne({ _id: audio._id }, { $pull: { like: user._id } }) // retirer luserID de l audio
          .then(() => {
            res.json({ result: false, like: false });
            // console.log(audio);
          });
      } else {
        // l'utilisateur n'a pas liké l audio
        Audio.updateOne({ _id: audio._id }, { $push: { like: user._id } }) // ajouter l userID de l audio
          .then(() => {
            res.json({ result: true, like: true });
            // console.log(audio);
          });
      }
    });
  });
});

//afficher toutes les audios like (favoris)
router.get("/all/:token/liked-by/:userId", (req, res) => {
  //1. verifier si les champs sont vides
  User.findOne({ token: req.params.token }).then((data) => {
    if (data === null) {
      res.json({ result: false, error: "User not found" });
      return;
    }
    //2. afficher toutes les audios selon user id
    Audio.find({ like: req.params.userId }) // Trouver les audios aimés par l'utilisateur spécifié
      .then((data) => {
        // console.log(data);
        res.json({ result: true, data });
      });
  });
});

//afficher toutes les audios
router.get("/all/:token", (req, res) => {
  //1. verifier si les champs sont vides
  User.findOne({ token: req.params.token }).then((data) => {
    if (data === null) {
      res.json({ result: false, error: "User not found" });
      return;
    }
    //2. afficher toutes les audios selon user id
    Audio.find() // Trouver les audios aimés par l'utilisateur spécifié
      .then((data) => {
        res.json({ result: true, data });
      });
  });
});

//afficher toutes les audios selon une recherche (targets)
router.get("/search/:search", (req, res) => {
  //1. afficher toutes les audios selon user id
  Audio.find({ target: { $regex: new RegExp(req.params.search, "i") } }) // Trouver les audios aimés par l'utilisateur spécifié
    .then((data) => {
      res.json({ result: true, data });
    });
});

module.exports = router;
