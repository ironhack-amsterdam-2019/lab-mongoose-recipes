const express = require('express');
const router = express.Router();
const User = require("../models/User")

router.get('/logout', (req, res, next) => {
  if(!req.session.user) {
    res.redirect(`/users/login?destination=${encodeURIComponent('/')}`)
    return;
  }
  req.session.destroy();
  res.redirect("/users/logout/success")
});

router.get('/logout/success', (req, res, next) => {
  if(req.session.user) {
    res.render("message", {message: "Nope... You my friend are still logged in..."})
    return;
  }
  res.render("message", {message: "You are now logged out. Pleeeaaase come baaaack..."})
});

module.exports = router;