var express = require('express');
var router = express.Router();


require('../models/connection');
const User = require('../models/user'); 
const Emotion = require('../models/emotions');
const { checkBody } = require('../modules/checkBody');
const bcrypt = require('bcrypt');
const uid2 = require('uid2');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// register
router.post('/signup', (req, res) => {
  if (!checkBody(req.body, ['username', 'email', 'password'])) {
    res.json({ result: false, error: 'Missing or empty fields' });
    return;
  }

  // Check if the user has not already been registered
  // { $regex: new RegExp(req.body.username, 'i') }
  User.findOne({ username: req.body.username })
  .then(data => {
    console.log(data)
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
          conditions : req.body.conditions}, 
      });

      newUser.save().then(user => {
        res.json({ result: true, token: user.token });
      });
    } else {
      // User already exists in database
      res.json({ result: false, error: 'User already exists' });
    }
  });
});

// connexion 
router.post('/signin', (req, res) => {
  if (!checkBody(req.body, ['username', 'password'])) {
    res.json({ result: false, error: 'Missing or empty fields' });
    return;
  }

  // { $regex: new RegExp(req.body.username, 'i') }
  User.findOne({ username: req.body.username })
  // .populate('emotion')
  .then(data => {
    if (bcrypt.compareSync(req.body.password, data.password)) {
      res.json({ result: true, token: data.token, username: data.username});
    } else {
      res.json({ result: false, error: 'User not found or wrong password' });
    }
  });
});

// update account
router.put('/update', (req, res) => {

  User.findOne({ token: req.body.token })
  // .populate('emotion')
  .then(data => {
    if (!data) {
      res.json({ result: false, error: 'User not found'});
      return; 
    }
  });

  User.updateOne({token : req.body.token}, 
    {username: req.body.username}, {password: req.body.password}, {email: req.body.email})
  .then(data => {
    res.json({ result: true, user: 'User well updated'})
  })
})

//show all Emotions on Home Screen
router.get("/allEmotions/:token", (req, res) => {
  //verifier si les champs sont vides
  User.findOne({ token: req.params.token }).then((data) => {
    if (data === null) {
      res.json({ result: false, error: "User not found" });
      return;
    }
    //afficher toutes les cards selon user id
    Emotion.find() // Trouver les cards aimés par l'utilisateur spécifié
      .then((data) => {
        res.json({ result: true, data });
      });
  });
});

// add Emotion
router.put('/emotion', (req, res) => {
  if (!checkBody(req.body, ['token', '_id'])) {
    res.json({ result: false, error: 'Missing or empty fields' });
    return;
  }


    Emotion.findById(req.body._id).then(emotion => {
      if (!emotion) {
        res.json({ result: false, error: 'Emotion not found' });
        return;
      }

      User.findOne({ token: req.body.token }).then(user => {
        if (user === null) {
          res.json({ result: false, error: 'User not found' });
          return;
        }

      if (user.emotion.includes(emotion._id)) { // User already added the emotion
        User.updateOne({ _id: user._id }, { $pull: { emotion: emotion._id } }) // Remove emotion ID from user
          .then(() => {
            res.json({ result: false, message: 'Emotion deselected'});
          });
      } else { // User has not added the emotion
        User.updateOne({ token: req.body.token}, { $push: { emotion: emotion } })// Add emotion ID to user
        .populate('emotion')
        .then(() => {
            res.json({ result: true, message: 'Emotion well registered' });
          });
      }
    });
  });
})

// add historique 
router.put('/historique', (req, res) => {
  if (!checkBody(req.body, ['token'])) {
    res.json({ result: false, error: 'Missing or empty fields' });
    return;
  }

  User.findOne({ token: req.body.token })
  .then(data => {
    console.log('user', data)
    Emotion.findById(req.body._id)
    .then(emotion => {
      console.log('emotion', emotion)
      if ('emotion',emotion) {
        User.updateOne({ token: req.body.token }, {$push : {historique : {emotion: emotion.name, date: new Date()}}})
        .then(data => {
          res.json({ result: true, data: data});
        })
      } else {
        res.json({ result: false, error: 'No emotion selected' });
      }
    })
  });
});

// get historique by User 
router.get('/historique', (req, res) => {
  if (!checkBody(req.body, ['token'])) {
    res.json({ result: false, error: 'Missing or empty fields' });
    return;
  }

  User.findOne({ token: req.body.token })
  .then(data => {
    if(data) {
      res.json({result: true, hitorique: data.historique})
    }else{ 
      res.json({result: false, hitorique: 'No historique'})
    }
   

  })
})

//route Delete Account
router.delete('/', (req, res) => {
  //verifier si le token existe
  if (!checkBody(req.body, ['token', 'username'])) {
    res.json({ result: false, error: 'Cant`t delete your account' });
    return;
  }

  // //rechercher si le token == token donnée
  User.findOne({ token: req.body.token })
  .then(user => {
    if (user === null) {
      res.json({ result: false, error: 'User not found' });
      return;
    }

  //supprimé un par rapport a son token 
    User.findOneAndRemove({ token: req.body.token })
      .then((data) => {
        console.log(data)
        if (data){
          res.json({ result: true, message : 'Account well deleted'});
        } else {
          res.json({result: false})
        }
        });
      });
})

module.exports = router;


