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
        const hashtags = req.body.content.match(/#[^\s#]*/g);
        if(hashtags){
            const result = await Promise.all(
                hashtags.map(tag => {
                    return Hashtag.findOrCreate({
                        where: { title: tag.slice(1).toLowerCase() },
                    })
                }),
            );
            await post.addHashtags(result.map(r => r[0]));
        }
        res.redirect('/');
    }
    catch(error){
        console.error(error);
        next(error);
    }
});

module.exports = router;