const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const { Post, Hashtag } = require('../models');
const { isLoggedIn } = require('./middlewares');

const router = express.Router();

// upload 폴더가 없을 경우 upload 폴더 생성
try{
    fs.readdirSync('uploads');
}
catch(error){
    console.error('uploads 폴더가 없어 uploads 폴더를 설정합니다.');
    fs.mkdirSync('uploads');
}

// multer 함수를 실행 -> 객체 내에 single이라는 미들웨어가 들어간다
// multer 설정
const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, cb){
            // uploads 폴더에 이미지 업로드
            cb(null, 'uploads/');
        },
        // 파일 이름
        filename(req, file, cb){
            const ext = path.extname(file.originalname);
            cb(null, path.basename(file. originalname, ext) + Date.now() + ext);
        },
    }),
    // 파일 용량 제한
    limits: {fileSize: 5 * 1024 * 1024},
});

// post 요청을 보내면 upload.single('img') 실행해 form에서 image라는 key로 이미지를 업로드
// 업로드한 결과물이 req.file 안에 적힐 것, 이후 url을 front로 돌려보내줌
router.post('/img', isLoggedIn, upload.single('img'), (req, res)=>{
    console.log(req.file);
    res.json({ url: `/img/${req.file.filename}`});
});

// 게시글 업로드 -> image는 따로 올리므로
const upload2 = multer();
router.post('/', isLoggedIn, upload2.none(), async(req, res, next) => {
    try{ //body들만 업로드
        const post = await Post.create({
            content: req.body.content,
            img: req.body.url,
            UserId: req.user.id,
        });
        // hashtag를 위해 정규 표현식 사용
        const hashtags = req.body.content.match(/#[^\s#]*/g)
        // 만약에 매치가 없으면 null이 뜨니까 if로 검사
        if(hashtags){
            const result = await Promise.all(
                // map은 배열을 다음 배열로 바꿔준다 -> where로 앞의 #을 떼어주고 각각 해줌
                // [#노드, #익스프레스] -> [노드, 익스프레스] -> [findOrCreate(노드), findOrCreate(익스프레스)]
                // [[해시태그, false]는 중복 [해시태그, true]는 새로 생성]
                // findOrCreate는 중복을 막아줌
                hashtags.map(tag => {
                    return Hashtag.findOrCreate({
                        where: { title: tag.slice(1).toLowerCase() },
                    })
                }),
            );
            console.log(result);
            await post.addHashtags(result.map(r => r[0]));
            // addFollowings([아이디])만 가능
            // addHashtags([해시태그 혹은 create의 결과물 혹은 id]) ->
        }
        res.redirect('/');
    }
    catch(error){
        console.error(error);
        next(error);
    }
});

module.exports = router;