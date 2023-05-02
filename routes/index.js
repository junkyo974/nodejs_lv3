const express = require('express');
const router = express.Router();

const postsRouter = require('./posts');
const commentsRouter = require('./comments');
const likesRouter = require('./likes');
const usersRouter = require('./users.js');

router.use('/posts', [likesRouter]);
router.use('/posts', [postsRouter]);
router.use('/posts', [commentsRouter]);
router.use('/', [usersRouter]);

module.exports = router;