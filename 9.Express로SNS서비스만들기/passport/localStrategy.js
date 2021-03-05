const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const User = require('../models/user');

module.exports = () => {
    // auth.js의 passport.authenticate('local') 부분이 실행되면 이 부분이 실행됨
    passport.use(new LocalStrategy({
        usernameField: 'email', // req.body.email -> req.body.이름과 일치해야함
        passwordField: 'password',  //req.body.password
    }, async (email, passowrd, done) => {
        try{
            // email을 가진 사람이 있는지 check
            const exUser = await User.findOne({ where: {email} });
            // 가진 사람이 있을 경우
            // done 함수는 done(서버 에러, 로그인 성공, 로그인 실패 시 메세지)
            if(exUser){
                // hash화한 비밀번호와 비교하는 bcrypt.compare
                const result = await bcrypt.compare(password, exUser.password);
                if(result){
                    done(null, exUser);
                }
                else{
                    done(null, false, {message: '비밀번호가 일치하지 않습니다'});
                }
            }
            else{
                done(null, false, { message: '가입되지 않은 회원입니다.'});
            }
        }
        catch(error){
            console.error(error);
            done(error);
        }
    }));
}