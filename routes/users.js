const express = require('express');
const router = express.Router();
const controller = require('../controllers/userController');
const auth = require('../middlewares/auth');

// handle create user
router.post('/', controller.create);
// handle update user
router.put('/:id', auth, controller.update);
// handle add user bookmark
router.post('/:id/bookmarks', auth, controller.addBookmark);
// handle update user bookmark
router.put('/:id/bookmarks/:bookmarkID', auth, controller.updateBookmark);
// handle delete user bookmark
router.delete('/:id/bookmarks/:bookmarkID', auth, controller.removeBookmark);

module.exports = router;