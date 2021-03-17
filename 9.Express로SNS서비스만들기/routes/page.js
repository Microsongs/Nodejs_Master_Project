const express = require('express');
const { Post, User } = require('../models');
const router = express.Router();

// 팔로워, 팔로잉 구현 시 사용
router.use((req, res, next)=>{
    // res.locals.user를 위에 설정하여 미들웨어의 특성을 활용하여 중복을 방지할 수 있음
    res.locals.user = req.user;
    res.locals.followerCount = 0;
    res.locals.floolwingCount = 0;
    res.locals.followerIdList = [];
    next();
});

// app.js의 app.use가 '.'이므로 router에서도 앞에 붙는것이 없다.
// 만약 app.js의 app.use가 /user로 연결된다면 router.get에서도 /user/profile 등으로 붙음
// profile로 가면 프로필로 랜더링
router.get('/profile',(req,res)=>{
    res.render('profile',{title:'내 정보 = NodeBIrd'});
})

// join으로 가면 join으로 랜더링
router.get('/join',(req,res)=>{
    res.render('join',{title: '회원가입 = NodeBird'});
})

// 메인 화면을 보여줌
router.get('/',async (req,res,next)=>{
    // twits는 메인 게시물을 넣을 공간
    try{
        const posts = await Post.findAll({
            include:{
                model: User,
                atributes: ['id','nick'],
            },
            order: [['createdAt','DESC']],
        });
        // render에 넣는 변수들은 res.locals에 뺄 수 있다
        res.render('main',{
            title:'NodeBird',
            twits: posts,
        });
    }
    catch(err){
        console.error(err);
        next(err);
    }
});

module.exports = router;