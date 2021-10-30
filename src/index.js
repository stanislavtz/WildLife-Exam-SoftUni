const express = require('express');
const dbConnect = require('./configs/database');

const { PORT, PROJECT_NAME, DB_NOTE, SERVER_NOTE } = require('./utils/constants');

const app = express();

require('./configs/express')(app);
require('./configs/handlebars')(app);

dbConnect()
    .then(() => console.log(PROJECT_NAME))
    .then(() => console.log(DB_NOTE))
    .then(() => app.listen(PORT, () => console.log(SERVER_NOTE + PORT)))
    .catch(err => console.error(err));