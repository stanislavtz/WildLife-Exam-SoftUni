const router = require('express').Router();

function getHomePage(req, res) {
    res.render('home/index');
}

router.get('/', getHomePage);

module.exports = router;