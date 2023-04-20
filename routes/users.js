var express = require("express");
var router = express.Router();

require("../models/connection");
const User = require("../models/user");
const Emotion = require("../models/emotions");
const { checkBody } = require("../modules/checkBody");
const bcrypt = require("bcrypt");
const uid2 = require("uid2");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

//***********route enregistrement */ SignUp
router.post("/signup", (req, res) => {
  //1. check si tous les champs sont bien remplis
  if (!checkBody(req.body, ["username", "email", "password"])) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }

  //2.  Check si l utilisateu n'existe pas deja.
  User.findOne({ username: req.body.user }).then((data) => {
    if (data === null) {
      const hash = bcrypt.hashSync(req.body.password, 10);

      const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: hash,
        token: uid2(32),
        survey: {
          subjects: [req.body.subjects],
          expectations: [req.body.expectations],
          conditions: req.body.conditions,
        },
      });

      newUser.save().then((user) => {
        res.json({ result: true, token: user.token, userId: user._id });
      });
    } else {
      // sinon, l utilisateur existe deja
      res.json({ result: false, error: "User already exists" });
    }
  });
});

//********route de connexion */ signIn
router.post("/signin", (req, res) => {
  //1. check si tous les champs sont bien remplis
  if (!checkBody(req.body, ["username", "password"])) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }
  //2.  Check si l utilisateu n'existe pas deja.
  User.findOne({ username: req.body.username }).then((data) => {
    if (bcrypt.compareSync(req.body.password, data.password)) {
      res.json({
        result: true,
        token: data.token,
        username: data.username,
        userId: data._id,
      });
    } else {
      res.json({ result: false, error: "User not found or wrong password" });
    }
  });
});

//***********modifier ses informations de compte */ update account
router.put("/update", (req, res) => {
  User.findOne({ token: req.body.token }).then((data) => {
    if (!data) {
      res.json({ result: false, error: "User not found" });
      return;
    }
  });

  User.updateOne(
    { token: req.body.token },
    { username: req.body.username },
    { password: req.body.password },
    { email: req.body.email }
  ).then((data) => {
    res.json({ result: true, user: "User well updated" });
  });
});

//***************afficher toutes les émotions sur la HomeScreen
router.get("/allEmotions", (req, res) => {
  // Trouver les cards aimés par l'utilisateur spécifié
  Emotion.find().then((data) => {
    res.json({ result: true, data });
  });
});

//****************ajouter une émotion */ add Emotion
router.put("/emotion", (req, res) => {
  if (!checkBody(req.body, ["token", "_id"])) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }
  //1. trouver l emotion par son ID
  Emotion.findById(req.body._id).then((emotion) => {
    if (!emotion) {
      res.json({ result: false, error: "Emotion not found" });
      return;
    }
    // 2. trouver l User par son token
    User.findOne({ token: req.body.token }).then((user) => {
      if (user === null) {
        res.json({ result: false, error: "User not found" });
        return;
      }
      // 3. verifier si une émotion est deja présente pour un user
      if (user.emotion.includes(emotion._id)) {
        // l user a deja ajouté l'émotion
        User.updateOne(
          { token: req.body.token },
          { $pull: { emotion: emotion._id } }
        ) // retirer l emotion ID de l'user
          .then(() => {
            res.json({ result: false, message: "Emotion deselected" });
          });
      } else {
        // l user n'a pas encore ajouter cette émotion
        User.updateOne(
          { token: req.body.token },
          { $push: { emotion: emotion } }
        ) // ajouter l emotion a l user
          .populate("emotion")
          .then(() => {
            res.json({ result: true, message: "Emotion well registered" });
          });
      }
    });
  });
});

//************ ajouter l historique  */ add historique
router.put("/historique", (req, res) => {
  //1. verifier si le token existe
  if (!checkBody(req.body, ["token"])) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }

  User.findOne({ token: req.body.token }).then((data) => {
    // console.log("user", data);
    Emotion.findById(req.body._id).then((emotion) => {
      // console.log("emotion", emotion);
      if (("emotion", emotion)) {
        User.updateOne(
          { token: req.body.token },
          { $push: { historique: { emotion: emotion._id, date: new Date() } } }
        ).then((data) => {
          res.json({ result: true, data: data });
        });
      } else {
        res.json({ result: false, error: "No emotion selected" });
      }
    });
  });
});

//************recuperer l historique d'un User */
router.get("/historique/:token", (req, res) => {
  if (!checkBody(req.params, ["token"])) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }

  User.findOne({ token: req.params.token }).then((data) => {
    if (data) {
      res.json({ result: true, historique: data.historique });
    } else {
      res.json({ result: false, historique: "No historique" });
    }
  });
});

//********** recuperer l'emotion d un historique*
router.get("/emotion/:_id", (req, res) => {
  if (!checkBody(req.params, ["_id"])) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }

  Emotion.findOne({ _id: req.params._id }).then((data) => {
    // console.log(data);
    if (data) {
      res.json({ result: true, data: data });
    } else {
      res.json({ result: false, error: "Emotion not found" });
    }
  });
});

//*********supprimer le compte d'un User******route Delete
router.delete("/", (req, res) => {
  //1. verifier si le token existe
  if (!checkBody(req.body, ["token", "username"])) {
    res.json({ result: false, error: "Cant`t delete your account" });
    return;
  }

  //2. rechercher si le token == token donnée
  User.findOne({ token: req.body.token }).then((user) => {
    if (user === null) {
      res.json({ result: false, error: "User not found" });
      return;
    }

    //3. supprimer par rapport a son token
    User.findOneAndRemove({ token: req.body.token }).then((data) => {
      // console.log(data);
      if (data) {
        res.json({ result: true, message: "Account well deleted" });
      } else {
        res.json({ result: false });
      }
    });
  });
});

module.exports = router;
