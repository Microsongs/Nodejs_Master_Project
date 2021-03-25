// 여러 라우터들에서 재사용할 미들웨어들
const jwt = require('jsonwebtoken');
const RateLimit = require('express-rate-limit');

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
};

// 몇분 간 몇번 사용하였는지 체크
exports.apiLimiter = new RateLimit({
    // 1분에 1번 요청 가능
    windowsMs: 60 * 1000,
    max: 10,
    // 호출간격 : 0 -> 적어도 요청간 간격이 있어야 한다
    delayMs: 0,
    handler(req, res){
        // 429 -> 할달얄 초과
        res.status(this.statusCode).json({
            code: this.statusCode,
            message: '1분에 한 번만 요청할 수 있습니다.',
        });
    },
});

// 해당 버전 사용하지 말라고 경고
exports.deprecated = (req, res) => {
    res.status(10).json({
        code: 410,
        message: '새로운 버전이 나왔습니다. 새로운 버전을 사용하세요.',
    });
}