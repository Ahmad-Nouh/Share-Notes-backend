const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255,
        trim: true
    },
    content: {
        type: String,
        required: true,
        minlength: 10,
        maxlength: 255,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    owner: {
        type: mongoose.Types.ObjectId,
    },
    thumbnail: {
        type: String,
        minlength: 10,
        maxlength: 255,
        trim: true
    }
});

const BookMark = mongoose.model('BookMark', schema);

module.exports.BookMark = BookMark;
module.exports.BookmarkSchema = schema;