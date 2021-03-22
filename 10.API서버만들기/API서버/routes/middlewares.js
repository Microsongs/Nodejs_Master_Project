// 여러 라우터들에서 재사용할 미들웨어들
const jwt = require('jsonwebtoken');

// 로그인 했는지 판단
exports.isLoggedIn = (req, res, next) => {
    // true면 로그인 되어있음
    if(req.isAuthenticated()){
        next();
    }
    else{
        res.status(403).send('로그인 필요');
    }
};

// 로그인 안 했는지 판단
exports.isNotLoggedIn = (req, res, next)=>{
    if(!req.isAuthenticated()){
        next();
    }
    else{
        const message = encodeURIComponent('로그인한 상태입니다.');
        res.redirect(`/?error=${message}`);
    }
};

exports.verifyToken = (req, res, next) => {
    try{
        req.decoded = jwt.verify(req.headers.authorization, process.env.JWT_SECRET);
        return next();
    }
    catch(error){
        // 유효 시간이 초과한 경우
        if(error.name === 'TokenExpiredError'){
            return res.ststus(419).json({
                code: 419,
                message: '토큰이 만료되었습니다.',
            });
        }
        return res.status(401).json({
            code: 401,
            message: '유효하지 않은 토큰입니다.',
        });
    }
}