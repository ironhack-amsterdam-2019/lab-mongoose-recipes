const express = require('express');
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

router.get('/seed', (req, res, next) => {
  for(let recipe of require('../seedData').recipes) {
    Recipe.create(recipe)
    .then(recipe => console.log("Created '" + recipe.title + "'"))
    .catch(error => console.log(error))
  }
  res.redirect("/recipes")
});

router.get('/new', (req, res, next) => {
  Cook.find({}).then((data) => {
    res.render("newRecipe", {cooks: data})
  }).catch((error) => {console.log(error); next()});
});

router.post('/new', (req, res, next) => {
  
});

module.exports = router;