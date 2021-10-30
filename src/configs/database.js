const mongoose = require('mongoose');

const { URI } = require('../utils/constants');

const connection = () => mongoose.connect(URI);

module.exports = connection;