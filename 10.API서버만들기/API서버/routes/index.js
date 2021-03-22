const express = require('express');
const { v4 : uuidv4 } = require('uuid');
const {User, Domain} = require('../models');
const { isLoggedIn} = require('./middlewares');

const router = express.Router();

router.get('/', async (req, res, next) => {
    try{
        const user = await User.findOne({
            where: {id : req.user && req.user.id || null},
            include: { model: Domain}
        });
        // localhost:8002로 접속하면 해당 부분이 실행되어 login.html로 가서 로그인하게끔
        res.render('login', {
            user,
            domains: user && user.Domains,
        });
    }
    catch(err){
        console.error(err);
    }
})