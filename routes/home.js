const express = require('express');
const router  = express.Router();

router.get('/', (req, res, next) => {
    if(!req.session.user) {
        res.redirect(`/users/login?destination=${encodeURIComponent('/')}`)
        return;
    }
    res.render("home")
});

module.exports = router;