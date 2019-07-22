const express = require('express');
const router  = express.Router();
const Cook = require("../models/Cook")

router.get('/:id', (req, res, next) => {
  Cook.find({_id: req.params.id})
  .populate("recipes")
  .then((data) => {
    res.render("cook", {cook: data[0]})
  })
});

router.get('/:id/update', (req, res, next) => {
  Cook.findOne({_id: req.params.id})
    .then(cook => {
      res.render("updateCook", { cook: cook })
    .catch(error => {
      console.log(error);
      next(error)
    })
  })
});

router.post('/:id/update', (req, res, next) => {
  /** @todo verify... no empty names and so on */
  let data = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
  }
  Cook.updateOne({_id: req.params.id}, data).then(() => {
    res.redirect("/cook/" + req.params.id)
  }).catch(error => {
    next(error);
  })
});

module.exports = router;