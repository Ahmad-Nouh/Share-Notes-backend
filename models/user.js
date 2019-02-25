const jwt = require('jsonwebtoken');
const config = require('config');
const mongoose = require('mongoose');
const {BookmarkSchema} = require('./bookmark');

const schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255,
        trim: true
    },
    username: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        minlength: 5,
        maxlength: 255,
        required: true
    },
    bookmarks: {
        type: [BookmarkSchema],
        default: []
    }
});

schema.methods.generateAccessToken = function () {
    return jwt.sign({_id: this._id}, config.get('privateKey'));
};

const User = mongoose.model('User', schema);

module.exports = User;