const express = require('express');
const router = express.Router();
const controller = require('../controllers/user-controller');

router.post('/', controller.create);

router.put('/:id', controller.update);

module.exports = router;