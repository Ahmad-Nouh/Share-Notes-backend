const Joi = require('joi');
const User = require('../models/user');
const { validateBookmark } = require('./bookmarkController');
const bcrypt = require('bcrypt');
const { BookMark } = require('../models/bookmark');
const debug = require('debug')('app:debug');

async function create (req, res) {
    // validate the user
    const {error} = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    // create user
    let newUser = new User({
        name: req.body.name,
        username: req.body.username,
        password: req.body.password
    });
    // hash user password
    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(newUser.password, salt);
    newUser = await newUser.save();
    const token = newUser.generateAccessToken();
    return res.header('x-auth-token', token).send(newUser);
}

async function update (req, res) {
    let user = await User.findById(req.user._id);
    if (!user) return res.status(400).send('invalid user id');

    const {error} = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    user.name = req.body.name;
    user.username = req.body.username;
    user.password = req.body.password;

    user = await user.save();

    return res.send(user);
}

async function addBookmark(req, res) {
    // find user
    let user = await User.findById(req.user._id);
    if (!user) return res.status(400).send('invalid user id');
    // validate the bookmark
    const {error} = validateBookmark(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    // create new bookmark
    let newBookmark = new BookMark({
        title: req.body.title,
        content: req.body.content,
        thumbnail: req.body.thumbnail,
        createdAt: Date.now()
    });
    // save to the database
    newBookmark = await newBookmark.save();
    // add the new bookmark to the user bookmarks array
    user.bookmarks.push(newBookmark);
    user = await user.save();
    res.send(user);
}

async function updateBookmark(req, res) {
    // find user
    let user = await User.findById(req.user._id);
    if (!user) return res.status(400).send('invalid user id');
    // find bookmark
    let bookmark = user.bookmarks.id(req.params.bookmarkID);
    if (!bookmark) return res.status(400).send('invalid bookmark id');
    // validate new bookmark
    const {error} = validateBookmark(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // update
    const temp = req.body;

    bookmark.title = temp.title;
    bookmark.content = temp.content;
    bookmark.thumbnail = temp.thumbnail;

    user = await user.save();
    return res.send(user);
}

async function removeBookmark(req, res) {
    // find user
    let user = await User.findById(req.user._id);
    if (!user) return res.status(400).send('invalid user id');
    // find bookmark
    let bookmark = user.bookmarks.id(req.params.bookmarkID);
    if (!bookmark) return res.status(400).send('invalid bookmark id');
    // delete bookmark

    bookmark.remove();
    user = await user.save();
    return res.send(user);
}

function validate(user) {
    const schema = {
        name: Joi.string().trim().min(5).max(255).required(),
        username: Joi.string().trim().min(5).max(255).required(),
        password: Joi.string().min(5).max(255).required()
    };

    return Joi.validate(user, schema);
}


module.exports = {create, update, addBookmark, updateBookmark, removeBookmark};