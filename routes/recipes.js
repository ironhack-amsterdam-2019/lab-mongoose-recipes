const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Recipe = require("../models/Recipe")
const Cook = require("../models/Cook")

router.get('/', (req, res, next) => {
  Recipe.find({})
    .populate("creator")
    .then(data => {
      res.render("recipes", {
        recipes: data
      })
    }).catch((error) => {
      console.log(error);
      next()
    });
});

router.get('/new', (req, res, next) => {
  if(!req.session.user) {
    res.redirect(`/users/login?destination=${encodeURIComponent('/recipes/new')}`)
    return;
  }
  Cook.find({}).then((data) => {
    res.render("newRecipe", {
      cooks: data
    })
  }).catch((error) => {
    console.log(error);
    next()
  });
});

router.post('/new', (req, res, next) => {
  if(!req.session.user) {
    res.redirect(`/users/login?destination=${encodeURIComponent('/recipes/new')}`)
    return;
  }
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
  Recipe.create(data).then(recipe => {
    Cook.findById(recipe.creator).then(cook => {
      if (!cook) {
        next(new Error("Attempted to create recipe with unknown Cook"))
      }
      cook.update({
        $push: {
          recipes: recipe._id
        }
      }).then(() => {
        res.redirect("/recipe/" + recipe._id);
      }).catch(error => next(error))
    }).catch(error => next(error))
  }).catch(error => next(error))
});

module.exports = router;