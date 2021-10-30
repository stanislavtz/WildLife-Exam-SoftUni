const { jwtVerify } = require('../utils/jwtUtil');
const { COOKIE_NAME, JWT_SECRET } = require('../utils/constants');

const postService = require('../services/postsService');

exports.auth = () => async function (req, res, next) {
    const token = req.cookies[COOKIE_NAME];
    if (!token) {
        return next();
    }

    try {
        const decoded = await jwtVerify(token, JWT_SECRET);
        req.user = decoded;
        res.locals.user = decoded;
        next();
    } catch (error) {
        res.locals.error = error;
        res.render('404');
    }
}

exports.isGuest = function (req, res, next) {
    if (!req.user) {
        return next();
    }

    res.locals.error = { message: 'You are logged in' }
    res.redirect('/');
}

exports.isAuthenticated = function (req, res, next) {
    if (req.user) {
        return next();
    }

    // res.locals.error = { message: 'You are not authenticated' }
    res.redirect('/user/login');
}

exports.isAuthorized = async function (req, res, next) {
    const post = await postService.getOneById(req.params.postId);

    if(req.user && post.owner._id == req.user._id) {
        return next();
    }

    res.locals.error = { message: 'You are not authorized' }
    res.redirect('/user/login');
}

exports.isNotOwner = async function (req, res, next) {
    const post = await postService.getOneById(req.params.postId);

    if(req.user && post.owner._id != req.user._id) {
        return next();
    }

    res.locals.error = { message: 'You own this post' }
    res.redirect('/');
}