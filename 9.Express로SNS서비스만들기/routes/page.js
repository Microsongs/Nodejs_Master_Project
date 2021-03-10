const express = require('express');

const router = express.Router();

// 팔로워, 팔로잉 구현 시 사용
router.use((req, res, next)=>{
    res.locals.user = null;
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
router.get('/',(req,res,next)=>{
    // twits는 메인 게시물을 넣을 공간
    const twits = [];
    res.render('main',{
        title: 'NodeBird',
        twits,
        user: req.user,
    });
});

module.exports = router;