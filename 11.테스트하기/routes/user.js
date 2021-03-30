const express = require('express');

const { isLoggedIn } = require('./middlewares');
const { addFollowing } = require('../controllers/user');
const User = require('../models/user');

const router = express.Router();

// following은 로그인 한 사람만 가능행햐하므로 isLoggedIn
// POST /user/1/follow -> follower와 follow를 구분해 주어야 함
router.post('/:id/follow', isLoggedIn, addFollowing);

module.exports = router;