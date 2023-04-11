var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

//route Delete
router.delete('/', (req, res) => {
  //verifier si le token existe
  if (!checkBody(req.body, ['token'])) {
    res.json({ result: false, error: 'Missing or empty fields' });
    return;
  }
  //rechercher si le token == token donnée
  User.findOne({ token: req.body.token }).then(user => {
    if (user === null) {
      res.json({ result: false, error: 'User not found' });
      return;
    }
  //supprimé un par rapport a son token 
        User.deleteOne({ token: req.body.token }).then(() => {
          res.json({ result: true });
        });
      });
  });

module.exports = router;


