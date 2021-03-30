const passport = require('passport');
// 로컬로 로그인
const local = require('./localStrategy');
// 카카오로 로그인
const kakao = require('./kakaoStrategy');
const User = require('../models/user');
const { Post } = require('../models');

// 함수 실행은 app.js에서
module.exports = () => {
    // routes/auth.js에서 req.login이 성공하였을 경우 이 함수가 실행
    passport.serializeUser((user, done) => {
        done(null, user.id);    // 세션에 user의 id만 저장함
        // done 되는 순간 다시 routes/auth.js의 (loginError) => {}부분이 실행
    });

    // 세션에 id를 저장하는 이유
    // { id: 3, 'connect.sid': s%3189203810391280 }
    // 세션 쿠키는 browser로 가며, 브라우저는 세션 쿠키를 같이 넣어서 보내줌, 서버가 쿠키를 보고 id를 체크하여 deserializeUser에서 복구

    passport.deserializeUser((id, done)=>{
        User.findOne(
            { where: { id },
            include: [{
                model: Post,
            },{
                model: User,
                attributes: ['id','nick'],
                as: 'Followers',
            },{
                model: User,
                attributes: ['id','nick'],
                as: 'Followings',
            }],
        })
            .then(user => done(null, user))
            .catch(err => done(err));
    });

    local();
    kakao();
};