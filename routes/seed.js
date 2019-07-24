const express = require('express');
const router = express.Router();
const path = require('path');
const Recipe = require("../models/Recipe")
const Cook = require("../models/Cook")

router.get('/', (req, res, next) => {
  if (!req.session.user) {
    res.redirect(`/users/login?destination=${encodeURIComponent('/seed')}`)
    return;
  }
  Promise.all([Cook.findOne({}), Recipe.findOne({})]).then(([cook, recipe]) => {
    if (cook || recipe) {
      res.render("message", {
        message: "Seeding is only ment for a completely empty database",
      })
    } else {
      const fs = require('fs');
      let data;
      fs.readFile(path.join(__dirname, '..', 'data', 'cooks.json'), 'utf8', function (err, data) {
        if (err) throw err;
        data = JSON.parse(data);
        Cook.collection.insertMany(data, function (err, r) {
          try {
            assert.equal(null, err);
            assert.equal(5, r.insertedCount);
          } catch (error) {
            console.log(err)
          }
        })
      });
      fs.readFile(path.join(__dirname, '..', 'data', 'recipes.json'), 'utf8', function (err, data) {
        if (err) throw err;
        data = JSON.parse(data);
        Recipe.collection.insertMany(data, function (err, r) {
          try {
            assert.equal(null, err);
            assert.equal(5, r.insertedCount);
          } catch (error) {
            console.log(err)
          }
        })
      });
      res.redirect("/");
    }
  }).catch(error => next(error))
});

module.exports = router;