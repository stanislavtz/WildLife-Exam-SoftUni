const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');

const router = require('../routes');
const { auth } = require('../middlewares/authMiddleware');

function config(app) {
    app.use('/static', express.static(path.resolve(__dirname, '../static')));
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser());
    app.use(auth());
    app.use(router());
}

module.exports = config;