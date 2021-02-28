const passport = require('passport');
// 로컬로 로그인
const local = require('./localStrategy');
// 카카오로 로그인
const kakao = require('./kakaoStrategy');
const User = require('../models/user');

module.exports = () => {
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done)=>{
        User.findOne({ where: {id} })
            .then(user => done(null, user))
            .catch(err => done(err));
    })

    local();
    kakao();
};