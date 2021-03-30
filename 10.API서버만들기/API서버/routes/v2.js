const express = require('express');
const jwt = require('jsonwebtoken');
// CORS 방지용
const cors = require('cors');
const url = require('url');

const { verifyToken, apiLimiter } = require('./middlewares');
const { Domain, User, Post, Hashtag } = require('../models');
const { urlencoded } = require('express');

const router = express.Router();

/*
// 아래 방법은 모든 것을 허용함 -> 처음부터 없는 것이랑 다름이 없음
router.use(cors({
    origin: true,
    credentials: true,
}));
*/
// 미들웨어 확장 패턴으로 cors 미들웨어를 확장
router.use(async (req, res, next) => {
    const domain = await Domain.findOne({
        // 요청 보낼떄 설정한 origin을 꺼내 host를 설정 ?는 앞이 undefined면 그대로, 객체면 뒤에서 host 꺼내옴
        where: {host: url.parse(req.get('origin'))?.host }
    });
    // domain에서 요청이 온 경우 cors모듈을 붙여줌
    if(domain){
        cors({
            origin: true,
            credentials: true,
        })(req, res, next);
    }
    else{
        next();
    }
})


// 토큰 발급 라우트
router.post('/token', apiLimiter, async(req, res) => {
    const { clientSecret } = req.body;
    try{
        const domain = await Domain.findOne({
            where: { clientSecret },
            include: {
                model: User,
                attribute: ['nick', 'id'],
            },
        });
        if(!domain){
            return res.status(401).json({
                code: 401,
                message:'등록되지 않은 도메인입니다. 먼저 도메인을 등록하세요',
            });
        }
        const token = jwt.sign({
            id: domain.User.id,
            nick: domain.User.nick,
        }, process.env.JWT_SECRET, {
            expiresIn: '1m', //1분
            issuer: 'nodebird',
        });
        // CORS해결, 모든 브라우저에서 접근 가능, 활용성 떨어짐
        /*
        res.setHeader('Access-Control-Allow-Origin','*');
        res.setHeader('Access-Control-Allow-Credentials','*');
        */
        return res.json({
            code: 200,
            message: '토큰이 발급되었습니다.',
            token,
        });
    }
    catch(error){
        console.error(error);
        return res.status(500).json({
            code: 500,
            message: '서버 에러',
        });
    }
});
//토큰 발급 테스트 라우터
router.get('/test',verifyToken, (req, res) => {
    res.json(req.decoded);
});

// nodebird의 data를 보내주는 router
router.get('/posts/my', verifyToken,apiLimiter, (req, res) => {
    // 자신의 data를 가져온다
    Post.findAll({ where: { userId: req.decoded.id}})
        .then((posts) => {
            res.json({
                code: 200,
                payload: posts,
            });
        })
        .catch((error) => {
            console.error(error);
            return res.status(500).json({
                code: 500,
                message: '서버 에러',
            });
        })
});

// hashtag로 검색하는 라우터
// 에러를 붙여주는 이유 : code만 보고 어떤 error인지 알 수 있도록
router.get('/posts/hashtag/:title', verifyToken, async(req, res) => {
    try{
        const hashtag = await Hashtag.findOne({ where: {title:req.params.title} });
        if(!hashtag){
            return res.status(404).json({
                code: 404,
                message: '검색 결과가 없습니다.',
            });
        }
        const posts = await hashtag.getPosts();
        return res.json({
            code: 200,
            payload: posts,
        });
    }
    catch(error){
        console.error(error);
        return res.status(500).json({
            code: 500,
            message: '서버 에러',
        });
    }
})

module.exports = router;