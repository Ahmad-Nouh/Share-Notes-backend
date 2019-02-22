const mongoose = require('mongoose');

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
    bookmarks: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'BookMark'
        }
    ],
    verified: {
        type: Boolean,
        default: false
    },
    verification_code: {
        type: String
    }
});

const User = mongoose.model('User', schema);

module.exports = User;