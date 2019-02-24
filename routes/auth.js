const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const Joi = require('joi');
const debug = require('debug')('app:debug');
const jwt = require('jsonwebtoken');
const config = require('config');

router.post('/', async (req, res) => {
    const {error} = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    // check if username exist
    const user = await User.findOne({ username: req.body.username });
    if (!user) return res.status(400).send('invalid username or password..');
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).send('invalid username or password..');

    const token = jwt.sign({_id: user._id}, config.get('privateKey'));
    return res.send(token);
});

function validate(user) {
    const schema = {
        username: Joi.string().min(5).max(255).required(),
        password: Joi.string().min(5).max(255).required()
    };

    return Joi.validate(user, schema);
}

module.exports = router;