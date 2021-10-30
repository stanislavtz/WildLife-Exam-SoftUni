const handlebars = require('express-handlebars');
const path = require('path');

function config(app) {
    app.engine('hbs', handlebars({
        extname: 'hbs'
    }));

    app.set('views', path.resolve(__dirname, '../views'));
    app.set('view engine', 'hbs');
}

module.exports = config;