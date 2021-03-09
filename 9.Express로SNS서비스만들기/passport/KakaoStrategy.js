const passport = require('passport');
const KakaoStrategy = require('passport-kakao').Strategy;

const User = require('../models/user');

module.exports = () => {
    passport.use(new KakaoStrategy({
        // 카카오라는 서비스로 로그인을 하도록 구현을 하는 것이기 때문에 설정을 해주어야 함
        // developers.kakao.com에서 로그인 해야함 -> 내 application들어가서 애플리케이션을 추가함
        clientID: process.env.KAKAO_ID,
        callbackURL: '/auth/kakao/callback',
    }, async(accessToken, refreshToken, profile, done) => {
        console.log('kakao profile', profile);
        try{
            const exUser = await User.findOne({
                where: {snsId: profile.id, provider: 'kakao' },
            });
            if(exUser){
                done(null, exUser);
            }
            else{
                const newUser = await User.create({
                    email: profile._json && profile._json.kakao_account_email,
                    nick: profile.displayName,
                    snsId: profile.id,

                })
            }
        }
    }))
}