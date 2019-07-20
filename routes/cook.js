const express = require('express');
const router  = express.Router();
const Recipe = require("../models/Recipe")
const Cook = require("../models/Cook")

router.get('/:id', (req, res, next) => {
  Cook.find({_id: req.params.id}).then((data) => {
    res.render("cook", {cook: data[0]})
  })
});

router.get('/:id/update', (req, res, next) => {
  Cook.find({_id: req.params.id})
    .populate("recipes")
    .then(cook => {
      Recipe.find({})
      .then(recipes => {
        res.render("updateCook", {cook: cook[0], recipes: recipes})
      })
      .catch(error => {
        console.log(error);
        next();
      })
    .catch(error => {
      console.log(error);
      next()
    })
  })
});

router.post('/:id/update', (req, res, next) => {
  
});

module.exports = router;