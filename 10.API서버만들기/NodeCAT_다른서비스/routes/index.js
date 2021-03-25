const express = require('express');
const axios = require('axios');
//const { response } = require('express');

const router = express.Router();

const URL = 'http://localhost:8002/v2';
// origin에 넣어 두어 요청이 어디에서 왔는지 headers.origin에서 check
axios.defaults.headers.origin = 'http://localhost:4000';

// 요청을 보내는 미들웨어, 토큰이 만료되었을 경우 자동으로 재발급 받아주는 기능 추가
const request = async(req, api) => {
  try {
    if (!req.session.jwt) { // 세션에 토큰이 없으면 토큰 발급 시도
      const tokenResult = await axios.post(`${URL}/token`, {
        clientSecret: process.env.CLIENT_SECRET,
      });
      // 세션에 토큰 저장
      req.session.jwt = tokenResult.data.token;
    }
    // 토큰이 있으면 바로 요청을 보내면 된다
    return await axios.get(`${URL}${api}`, {
      headers: {authorization: req.session.jwt },
    });
  } 
  catch (error) {
    console.error(error);
    if (error.response.status === 419) { // 토큰 만료 시
      // 제거 하고 request함수를 다시 실행하여 토큰 재발급
      delete req.session.jwt;
      return request(req, api);
    }
    return error.response;
  }
};

// 요청1
router.get('/mypost', async(req, res, next) => {
  try{
    // api 서버 주소를 보냄
    const result = await request(req, '/posts/my');
    res.json(result.data);
  }
  catch(error){
    console.error(error);
    next(error);
  }
});

// 요청2
router.get('/search/:hashtag', async(req, res, next) => {
  try{
    const result = await request(req, `/posts/hashtag/${encodeURIComponent(req.params.hashtag)}`);
    res.json(result.data);
  }
  catch(error){
    console.error(error);
    next(error);
  }
});

router.get('/',(req, res)=>{
  res.render('main',{ key : process.env.CLIENT_SECRET });
})

module.exports = router;
