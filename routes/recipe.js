const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Recipe = require("../models/Recipe")
const Cook = require("../models/Cook")

router.get('/:id', (req, res, next) => {
  Recipe.findOne({
      _id: req.params.id
    }).populate("creator")
    .then(recipe => {
      res.render("recipe", {
        recipe: recipe,
        buttons: true
      })
    })
});

router.get('/:id/delete', (req, res, next) => {
  Recipe.findOne({
      _id: req.params.id
    })
    .then(recipes => {
      Cook.updateOne({
          _id: recipes.creator
        }, {
          $pullAll: {
            recipes: [req.params.id]
          }
        })
        .then(doc => {
          Recipe.deleteOne({
              _id: req.params.id
            })
            .then(() => res.redirect("/recipes"))
        })
    })
});

router.get('/:id/update', (req, res, next) => {
  Recipe.findOne({
      _id: req.params.id
    })
    .populate("creator")
    .then(recipe => {
      Cook.find({})
        .then(cooks => {
          res.render("updateRecipe", {
            recipe: recipe,
            cooks: cooks
          })
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
  // @ToDo verify input
  let data = {
    title: req.body.title,
    level: req.body.level,
    ingredients: req.body.ingredients.split(","),
    cuisine: req.body.cuisine,
    dishType: req.body.dishType,
    image: req.body.image,
    duration: parseInt(req.body.duration),
    creator: mongoose.Types.ObjectId(req.body.creator)
  }
  // welcome to callback hell **Muhahahaha**
  Recipe.findById(req.params.id)
    .then(doc => {
      if (doc.creator != data.creator) {
        Cook.updateOne({
            _id: doc.creator
          }, {
            $pullAll: {
              recipes: [req.params.id]
            }
          })
          .then(() => {
            Cook.updateOne({
                _id: data.creator
              }, {
                $push: {
                  recipes: req.params.id
                }
              })
              .then(() => {
                doc.updateOne(data)
                  .then(() => {
                    res.redirect("/recipe/" + req.params.id)
                  })
                  .catch((error) => {
                    next(error)
                  })
              })
              .catch(error => {
                next(error)
              })
          })
          .catch(error => {
            next(error)
          })
      } else {
        doc.updateOne(data)
          .then(() => {
            res.redirect("/recipe/" + req.params.id)
          })
          .catch((error) => {
            next(error)
          })
      }
    })
    .catch(error => {
      next(error)
    })
});

module.exports = router;