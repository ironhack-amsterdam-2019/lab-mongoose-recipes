const express = require('express');
const router = express.Router();
const User = require("../models/User")

router.get('/login', (req, res, next) => {
  if(req.session.user) {
    res.render("message", {message: "You are already loggin in... You should logout first ;)", link: {adress: "/users/logout", text: "Logout"}})
    return;
  }
  res.render("login", {destination: req.query.destination})
});

router.post('/login', (req, res, next) => {
  if(req.session.user) {
    res.render("message", {message: "You are already loggin in... You should logout first ;)", link: {adress: "/users/logout", text: "Logout"}})
    return;
  }
  User.findOne({
      username: req.body.username.trim()
    })
    .then(user => {
      if (!user) {
        res.render("message", {message: "Invalid credetials", link: {adress: "/users/login", text: "Back to login"}})
        return;
      }
      if (user.password === req.body.password.trim()) {
        req.session.user = user.username.trim();
        if (req.query.destination) {
          res.redirect(req.query.destination);
          return;
        }
        res.redirect("/");
      } else {
        res.render("message", {message: "Invalid credetials", link: {adress: "/users/login", text: "Back to login"}})
      }
    })
    .catch(error => {
      next(error);
    })
});

module.exports = router;