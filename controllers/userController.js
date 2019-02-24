const mongoose = require('mongoose');
const Joi = require('joi');
const User = require('../models/user');
const {validateBookmark} = require('./bookmarkController');
const bcrypt = require('bcrypt');
const debug = require('debug')('app:debug');

async function create (req, res) {
    debug('create');
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
    return res.send(newUser);
}

async function update (req, res) {
    let updatedUser = await User.findById(req.params.id);
    if (!updatedUser) return res.status(404).send('user not found!!');

    const {error} = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    updatedUser.name = req.body.name;
    updatedUser.username = req.body.username;
    updatedUser.password = req.body.password;

    updatedUser = await updatedUser.save();

    return res.send(updatedUser);
}

async function addBookmark(req, res) {
    // find user
    let user = await User.findById(req.body.userId);
    if (!user) return res.status(400).send('invalid user id');
    // validate bookmark
    const {error} = validateBookmark(req.body.bookmark);
    if (error) return res.status(400).send(error.details[0].message);
    // if everything ok
    const temp = req.body.bookmark;
    const newBookmark = {
        _id: temp._id,
        name: temp.name,
        content: temp.content,
        createdAt: temp.createdAt,
        owner: temp.owner,
        thumbnail: temp.thumbnail
    };
    user.bookmarks.push(newBookmark);
    user = await user.save();
    res.send(user);
}

async function updateBookmark(req, res) {
    // find user
    let user = await User.findById(req.body.userId);
    if (!user) return res.status(400).send('invalid user id');
    // find bookmark
    let bookmark = user.bookmarks.id(req.body.bookmark._id);
    if (!bookmark) return res.status(400).send('invalid bookmark');
    // validate new bookmark
    const {error} = validateBookmark(req.body.bookmark);
    if (error) return res.status(400).send(error.details[0].message);

    // update
    const temp = req.body.bookmark;
    bookmark = {
        _id: temp._id,
        name: temp.name,
        content: temp.content,
        createdAt: temp.createdAt,
        owner: temp.owner,
        thumbnail: temp.thumbnail
    };
    user = await user.save();
    return res.send(user);
}

async function removeBookmark(req, res) {
    // find user
    let user = await User.findById(req.body.userId);
    if (!user) return res.status(400).send('invalid user id');
    // find bookmark
    let bookmark = user.bookmarks.id(req.body.bookmark._id);
    if (!bookmark) return res.status(400).send('invalid bookmark');
    // delete bookmark

    bookmark.remove();
    user = await user.save();
    return res.send(user);
}

function validate(user) {
    const schema = {
        name: Joi.string().trim().min(5).max(255).required(),
        username: Joi.string().trim().min(5).max(255).required(),
        password: Joi.string().min(5).max(255).required(),
        verified: Joi.boolean().default(false)
    };

    return Joi.validate(user, schema);
}


module.exports = {create, update, addBookmark, updateBookmark, removeBookmark};