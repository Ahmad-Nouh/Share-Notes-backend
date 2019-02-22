const mongoose = require('mongoose');
const Joi = require('joi');
const User = require('../models/user');

async function create (req, res) {
    const {error} = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let newUser = new User({
        name: req.body.name,
        username: req.body.username,
        verified: false,
        verification_code: undefined,
        bookmarks: []
    });

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

    updatedUser = await updatedUser.save();

    return res.send(updatedUser);
}

function validate(user) {
    const schema = {
        name: Joi.string().trim().min(5).max(255).required(),
        username: Joi.string().trim().min(5).max(255).required()
    };

    return Joi.validate(user, schema);
}

module.exports = {create, update};