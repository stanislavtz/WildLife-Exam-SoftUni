const router = require('express').Router();

const homePageController = require('./controllers/homePage');
const userController = require('./controllers/userController');
const postsController = require('./controllers/postsController');

router.use('/', homePageController);
router.use('/user', userController);
router.use(`/post`, postsController);

router.all('*', (req, res) => res.render('404', {title: 'Page Not Found'}));


module.exports = () => router;