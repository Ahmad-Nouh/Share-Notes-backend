const {BookMark} = require('../models/bookmark');
const Joi = require('joi');

async function index (req , res) {
    const bookmarks = await BookMark.find();
    if (!bookmarks) return res.send([]);
    return res.send(bookmarks);
}

async function getById (req , res) {
    const bookmark = await BookMark.findById(req.params.id);
    if (!bookmark) return res.status(404).send('bookmark not found!!');
    return res.send(bookmark);
}

async function create (req, res) {
    const {error} = validateBookmark(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    let newBookmark = new BookMark({
        title: req.body.title,
        content: req.body.content,
        owner: req.body.owner,
        thumbnail: req.body.thumbnail,
        createdAt: Date.now()
    });
    newBookmark = await newBookmark.save();
    return res.send(newBookmark);
}

async function update (req, res) {
    let newBookmark = await BookMark.findById(req.params.id);
    if (!newBookmark) return res.status(404).send('bookmark not found!!');
    const {error} = validateBookmark(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    newBookmark.title = req.body.title;
    newBookmark.content = req.body.content;
    newBookmark.owner = req.body.owner;
    newBookmark.thumbnail = req.body.thumbnail;
    newBookmark = await newBookmark.save();
    return res.send(newBookmark);
}

async function remove (req, res) {
    const bookmark = await BookMark.findByIdAndRemove(req.params.id);
    if (!bookmark) return res.status(404).send('bookmark not found!!');
    return res.send(bookmark);
}

// validation with joi
function validateBookmark(bookmark) {
    const schema = {
        title: Joi.string().trim().min(5).max(255).required(),
        content: Joi.string().trim().min(10).max(255).required(),
        owner: Joi.string().trim().optional(),
        thumbnail: Joi.string().trim().min(10).max(255).optional(),
        createdAt: Joi.date().default(Date.now())
    };

    return Joi.validate(bookmark, schema);
}

module.exports = {index, getById, create, update, remove, validateBookmark};