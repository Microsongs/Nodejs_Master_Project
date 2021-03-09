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
    // 미들 웨어를 확장하는 패턴 -> front에서 로그인 요청을 보내면 이 부분이 실행됨
    // passport.authenticate('local')까지 실행되며, 이 부분에서 localStrategy로 가서 localStrategy의 app.use 호출
    // 그 결과는 done함수로 return되는데, 아래의 콜백 함수와 일치함
    passport.authenticate('local', (authError, user, info) => {
        // 서버 측 에러일 경우
        if(authError){
            console.error(authError);
            return next(authError);
        } 
        // 로그인 실패 시
        if(!user){
            return res.redirect(`/?loginError=${info.message}`);
        }
        // 로그인 성공 시 -> passport/index로 간다
        // done되는 순간 (loginError) => {} 콜백 함수가 실행된다
        return req.login(user, (loginError) => {
            if(loginError){
                console.error(loginError);
                return next(loginError);
            }
            // 로그인 성공 -> 세션 쿠키를 브라우저로 보내준다
            return res.redirect('/');
        });
    })(req, res, next); // 미들웨어 내 미들웨어는 (req, res, next)를 붙여야 함
});

router.get('/logout', isLoggedIn, (req, res)=>{
    req.logout();
    req.session.destroy();
    res.redirect('/');
});

// 카카오 로그인 누르면 실행
router.get('/kakao', passport.authenticate('kakao'));

//
router.get('/kakao/callback', passport.authenticate('kakao', {
    failureRedirect: '/',
}), (req,res) => {
    res.redirect('/');
});

module.exports = router;