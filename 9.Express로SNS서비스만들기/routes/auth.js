const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const User = require('../models/user');

// 라우터 생성
const router = express.Router();

// 회원 가입 라우터
router.post('/join', isNotLoggedIn, async(req, res, next)=>{
    const {email, nick, passwrod } = req.body;
    try{
        // 기존에 email로 가입이 되어있는지 검사하여 있을 경우 join?error=exist로 redirect 처리
        const exUser = await User.findOne({ where: {email} });
        if(exUser){
            return res.redirect('/join?error=exist');
        }
        // 비밀번호만 hash화 하여 넣어준다
        // 12의 숫자가 더 높을수록 더 복잡하게 hash됨, 소요 시간이 오래 걸림 -> 보안과 성능을 trade off
        const hash = await bcrypt.hash(password, 12);
        await User.create({
            email,
            nick,
            password: hash,
        });
        // 메인 페이지로 redirect해줌
        return res.redirect('/');
    }
    catch(error){
        console.error(error);
        return next(error);
    }
});

// 로그인 라우터
router.post('/login', isNotLoggedIn, (req, res, next)=>{
    passport.authenticate('local', (authError, user, info) => {
        if(authError){
            console.error(authError);
            return next(authError);
        }
        if(!user){
            return res.redirect(`/?loginError=${info.message}`);
        }
        return req.login(user, (loginError) => {
            if(loginError){
                console.error(loginError);
                return next(loginError);
            }
            return res.redirect('/');
        });
    })
})

module.exports = router;