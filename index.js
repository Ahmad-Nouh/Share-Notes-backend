const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const morgan = require('morgan');
const debug = require('debug')('app:debug');
const app = express();
const PORT = process.env.PORT || 3000;
const bookmarks = require('./routes/bookmarks');
const users = require('./routes/users');
const auth = require('./routes/auth');
const config = require('config');

if (!config.get('privateKey')) {
    console.error('FATAL ERROR: privateKey is not defined.');
    process.exit(1);
}
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

// connecting to db
mongoose.connect('mongodb://localhost/shareNotes', {useNewUrlParser: true})
    .then(() => debug('connecting to db successeded..'))
    .catch((error) => debug(`something went wrong: ${error}`));

// add helpful middlewares
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(helmet());
app.use(morgan('dev'));

// our routes
app.use('/api/auth', auth);

app.use('/api/bookmarks', bookmarks);

app.use('/api/users', users);


app.listen(PORT, () => {
    debug(`listening on port ${PORT}..`);   
});