var express = require("express");
var router = express.Router();

require("../models/connection");
const Cards = require("../models/cards");
//******** recuperer toutes les cartes  */
router.get("/", (req, res) => {
  Cards.find({})
    .then((cards) => {
      res.json(cards);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: "An error occurred" });
    });
});
/**********recuperer les cartes par target********************** */

router.get("/target/:target", (req, res) => {
  const target = req.params.target;
  Cards.find({ target: target })
    .then((cards) => {
      res.json(cards);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: "An error occurred" });
    });
});

module.exports = router;
