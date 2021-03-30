const express = require('express');

const { isLoggedIn} = require('./middlewares');
const User = require('../models/user');

const router = express.Router();

// following은 로그인 한 사람만 가능행햐하므로 isLoggedIn
// POST /user/1/follow -> follower와 follow를 구분해 주어야 함
router.post('/:id/follow', isLoggedIn, async (req, res, next) => {
    try{
        // where로 내가 누군지를 찾는다
        const user = await User.findOne({ where: {id: req.user.id} });
        if(user){
            // addFollowing으로 내가 해당 사용자를 following
            // models/user.js의 associate에서 관계 정의
            await user.addFollowings([parseInt(req.params.id, 10)]);
            res.send('success');
        }
        else{
            res.status(404).send('no user');
        }
    }
    catch(error){
        console.error(error);
        next(error);
    }
})

module.exports = router;