const express = require('express');
const router  = express.Router();
const Cook = require("../models/Cook")

router.get('/', (req, res, next) => {
  Cook.find({})
  .populate("recipes")
  .then((data) => {
    res.render("cooks", {cooks: data})
  }).catch((error) => {console.log(error); next()});
});

router.get('/seed', (req, res, next) => {
  for(let cook of require('../seedData').cooks) {
    Cook.create(cook)
    .then(recipe => console.log("Created '" + cook.firstName + " " + cook.lastName + "'"))
    .catch(error => console.log(error))
  }
  res.redirect("/cooks")
});

router.get('/new', (req, res, next) => {
  res.render("newCook")
});

router.post('/new', (req, res, next) => {
  
});

module.exports = router;