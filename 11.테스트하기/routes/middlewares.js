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

