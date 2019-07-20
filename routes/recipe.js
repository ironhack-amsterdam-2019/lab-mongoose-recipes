const express = require('express');
const router  = express.Router();
const Recipe = require("../models/Recipe")
const Cook = require("../models/Cook")

router.get('/:id', (req, res, next) => {
  Recipe.find({_id: req.params.id}).then((data) => {
    res.render("recipe", {recipe: data[0]})
  })
});

router.get('/:id/update', (req, res, next) => {
  Recipe.find({_id: req.params.id})
    .populate("cook")
    .then((recipes) => {
      Cook.find({})
      .then(cooks => {
        res.render("updateRecipe", {recipe: recipes[0], cooks: cooks})
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