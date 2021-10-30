const router = require('express').Router();

const userService = require('../services/userService');
const { COOKIE_NAME } = require('../utils/constants');
const { isGuest, isAuthenticated } = require('../middlewares/authMiddleware');

function getRegisterPage(req, res) {
    res.render('user/register');
}

function getLoginPage(req, res) {
    res.render('user/login');
}

async function registerUser(req, res) {
    try {
        await userService.register(req.body);
        await loginUser(req,res);
    } catch (error) {
        if (error.message.includes('E11000')) {
            console.error(error)
            res.locals.error = {message: 'User already exist'}
        } else {
            res.locals.error = error.errors ? Object.values(error.errors)[0] : error;
        }

        res.render('user/register', { ...req.body });
    }
}

async function loginUser(req, res) {
    try {
        const token = await userService.login(req.body);
        res.cookie(COOKIE_NAME, token, {
            httpOnly: true
        });
        res.redirect('/');
    } catch (error) {
        console.log(error)
        res.locals.error = error;
        res.render('user/login', { ...req.body });
    }
}

function logOutUser(req, res) {
    res.clearCookie(COOKIE_NAME).redirect('/');
}

router.get('/register', isGuest, getRegisterPage);
router.get('/login', isGuest, getLoginPage);
router.get('/logout', isAuthenticated, logOutUser);

router.post('/register', isGuest, registerUser);
router.post('/login', isGuest, loginUser);

module.exports = router;