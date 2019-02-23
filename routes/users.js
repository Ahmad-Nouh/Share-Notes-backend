const express = require('express');
const router = express.Router();
const controller = require('../controllers/userController');

// handle create user
router.post('/', controller.create);
// handle update user
router.put('/:id', controller.update);
// handle add user bookmark
router.post('/:id/bookmarks', controller.addBookmark);
// handle update user bookmark
router.put('/:id/bookmarks/:bookmarkID', controller.updateBookmark);
// handle delete user bookmark
router.delete('/:id/bookmarks', controller.removeBookmark);

module.exports = router;