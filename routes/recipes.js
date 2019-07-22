const express = require('express');
const mongoose = require('mongoose');
const router  = express.Router();
const Recipe = require("../models/Recipe")
const Cook = require("../models/Cook")

router.get('/', (req, res, next) => {
  Recipe.find({})
  .populate("creator")
  .then(data => {
    res.render("recipes", {recipes: data})
  }).catch((error) => {console.log(error); next()});
});

router.get('/new', (req, res, next) => {
  Cook.find({}).then((data) => {
    res.render("newRecipe", {cooks: data})
  }).catch((error) => {console.log(error); next()});
});

router.post('/new', (req, res, next) => {
  /** @todo verify input */
  let data = {
    title: req.body.title,
    level: req.body.level,
    ingredients: req.body.ingredients.split(","),
    cuisine: req.body.cuisine,
    dishType: req.body.dishType,
    image: req.body.image.trim().length > 0 ? req.body.image.trim() : "/no-image.png",
    duration: parseInt(req.body.duration),
    creator: mongoose.Types.ObjectId(req.body.creator)
  }
  Cook.findById(req.body.creator).then(cook => {
    if(!cook) {
      next(new Error("Attempted to create recipe with unknown Cook"))
    }
    cook.update({$push: { recipes: req.params.id }}).then(() => {
      Recipe.create(data).then(recipe => {
        res.redirect("/recipe/" + recipe._id);
      }).catch(error => next(error))
    }).catch(error => next(error))
  }).catch(error => next(error))
});

module.exports = router;