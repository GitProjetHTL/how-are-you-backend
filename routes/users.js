var express = require('express');
var router = express.Router();

require('../models/connection');
const User = require('../models/user'); 
const { checkBody } = require('../modules/checkBody');
const bcrypt = require('bcrypt');
const uid2 = require('uid2');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


router.post('/signup', (req, res) => {
  if (!checkBody(req.body, ['firstName', 'username', 'password'])) {
    res.json({ result: false, error: 'Missing or empty fields' });
    return;
  }

  // Check if the user has not already been registered
  User.findOne({ username: { $regex: new RegExp(req.body.username, 'i') } })
  .then(data => {

    if (data === null) {
      const hash = bcrypt.hashSync(req.body.password, 10);

      const newUser = new User({
        username: req.body.username,
        password: hash,
        token: uid2(32),
        // emotion : { type: mongoose.Schema.Types.ObjectId, ref: 'emotions' },
        survey: {
          subjects: Array,
          expectations: Array,
          conditions : Boolean}, 
        // comments: {
        //   title : String,
        //   content: String,
        //   date : Date,},
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





//route Delete Account
router.delete('/', (req, res) => {
  //verifier si le token existe
  if (!checkBody(req.body, ['token', 'username'])) {
    res.json({ result: false, error: 'Cant`t delete your account' });
    return;
  }

  //rechercher si le token == token donnée
  User.findOne({ token: req.body.token })
  .then(user => {
    if (user === null) {
      res.json({ result: false, error: 'User not found' });
      return;
    }
  //supprimé un par rapport a son token 
      User.deleteOne({ token: req.body.token })
      .then(() => {
          res.json({ result: true });
        });
      });
  });

module.exports = router;


