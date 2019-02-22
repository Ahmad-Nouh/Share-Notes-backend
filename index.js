const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const morgan = require('morgan');
const debug = require('debug')('app:debug');
const app = express();
const PORT = process.env.PORT || 3000;
const bookmarks = require('./routes/bookmarks');
const users = require('./routes/users');


// connecting to db
mongoose.connect('mongodb://localhost/shareNotes')
    .then(() => debug('connecting to db successeded..'))
    .catch((error) => debug(`something went wrong: ${error}`));

// add helpful middlewares
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(helmet());
app.use(morgan('tiny'));

// our routes
app.use('/api/bookmarks', bookmarks);

app.use('/api/users', users);


app.listen(PORT, () => {
    debug(`listening on port ${PORT}..`);   
});