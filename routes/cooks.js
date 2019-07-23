const express = require('express');
const router = express.Router();
const Cook = require("../models/Cook")

router.get('/', (req, res, next) => {
  Cook.find({})
    .populate("recipes")
    .then((data) => {
      res.render("cooks", {
        cooks: data
      })
    }).catch((error) => {
      console.log(error);
      next()
    });
});

router.get('/new', (req, res, next) => {
  if(!req.session.user) {
    res.redirect(`/users/login?destination=${encodeURIComponent('/cooks/new')}`)
    return;
  }
  res.render("newCook")
});

router.post('/new', (req, res, next) => {
  if(!req.session.user) {
    res.redirect(`/users/login?destination=${encodeURIComponent('/cooks/new')}`)
    return;
  }
  /** @todo verify... no empty names and so on */
  let data = {
    firstName: req.body.firstName,
    lastName: req.body.lastName
  }
  let newCook = new Cook(data);
  newCook.save().then(cook => {
    res.redirect("/cook/" + cook._id)
  }).catch(error => {
    next(error);
  })
});

module.exports = router;