var express = require('express');
var router = express.Router();

require('../models/connection');
const User = require('../models/user');
const Comment = require('../models/comments');
const { checkBody } = require('../modules/checkBody');


// route newcomment - POST
router.post('/new', (req, res) => {
  if (!checkBody(req.body, ['content'])) {
    res.json({ result: false, error: 'Missing or empty fields' });
    return;
  }

  User.findOne({ token: req.body.token }).then(user => {
    if (user === null) {
      res.json({ result: false, error: 'User not found' });
      return;
    }

    const newComment = new Comment({
      author: user._id,
      content: req.body.content,
      date: new Date(),
    });

    newComment.save().then(newDoc => {
      res.json({ result: true, comment: newDoc });
    });
  });
});

// route updatecomment - PUT
router.put('/update', (req, res) => {
    // Checkbody pour les champs vides
    if (!checkBody(req.body, ['commentId'])) {
      res.json({ result: false, error: 'Missing or empty fields' });
      return;
    }
  
    // Vérification token
    User.findOne({ token: req.body.token }).then(user => {
      if (user === null) {
        res.json({ result: false, error: 'User not found' });
        return;
      }
    // Recherche + update du content  
      Comment.findById(req.body.commentId).then(comment => {
        if (!comment) {
          res.json({ result: false, error: 'Comment not found' });
          return;
        } else { 
          Comment.updateOne({ _id: req.body.commentId }, { content: req.body.content }) // Update
            .then((data) => {
              res.json({ result: true, updated: data });
            });
        }
      });
    });
  });


// route deleteComment - DELETE
router.delete('/delete', (req, res) => {
        // Checkbody pour les champs vides
        if (!checkBody(req.body, ['commentId'])) {
            res.json({ result: false, error: 'Missing or empty fields' });
            return;
          }
        
          // Vérification token
          User.findOne({ token: req.body.token }).then(user => {
            if (user === null) {
              res.json({ result: false, error: 'User not found' });
              return;
            }
        })

        Comment.findOneAndRemove({ _id: req.body.commentId })
        .then((data) => {
            if (!data) {
                res.json({ result: false, error: 'Comment not found' });
            } else {
                res.json({ result: true, deletedComment: data });
            }
          })

});

//afficher les commentaires
router.get('/allcomments', (req, res) => {
    User.findOne({ token: req.body.token })
    .then(user => {
        if (user === null) {
          res.json({ result: false, error: 'User not found' });
          return;
        }
    })

    Comment.find()
    .then(comments => {
      res.json({ result: true, comments });
    });
})

module.exports = router;