const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const nunjucks = require('nunjucks');
const dotenv = require('dotenv');   // 환경 변수 관리하는 패키지
const passport = require('passport');
// dotenv는 require하고 나서 제일 위에 적용해 주어야 함
dotenv.config();
const pageRouter = require('./routes/page');
const authRouter = require('./routes/auth');
const postRouter = require('./routes/post');
const { sequelize } = require('./models');
const passportConfig = require('./passport');

const morgan = require('morgan');
const path = require('path');

const app = express();
// 배포 시 port를 다르게 설정하기 위함
app.set('port', process.env.PORT || 8001);
// nunjucks 설정
app.set('view engine','html');
nunjucks.configure('views',{
    express: app,
    watch: true,
});

// 시퀄라이즈 동기화
// force: true일 경우 db 변경시 테이블을 삭제하고 생성, 
// alter: true일 경우 db 변경시 테이블을 삭제하지 않지만 가끔 수정 시 에러가 발생
sequelize.sync({ force: false })
    .then(()=>{
        console.log('데이터베이스 연결 성공');
    })
    .catch((err) => {
        console.error(err);
    });
// passport 연결
passportConfig();

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
// img를 요청하지만 실제로는 uploads폴더 내의 img를 가져간다
app.use('/img',express.static(path.join(__dirname, 'uploads')));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,
        secure: false,
    },
}));
// router에 가기 전에 미들웨어 2개를 미리 연결
// express-session의 session을 사용하므로 app.use(session) 아래에 위치해야 함
app.use(passport.initialize());
app.use(passport.session());

// localhost:8001/은 pageRouter로 넘겨줌
app.use('/',pageRouter);
// localhost:8001/auth은 authRouter로 넘겨줌
app.use('/auth',authRouter);
app.use('/post',postRouter);

// 404 처리 미들웨어
app.use((req,res,next)=>{
    const error = new Error(`${req.method} ${req.url} 라우터가 없습니다`);
    error.status = 404;
    next(error);
});

// error 처리 미들웨어
app.use((err, req, res, next)=>{
    res.locals.message = err.message;
    // 개발 모드일 때에만 stack trace를 보여주게 설정함
    res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
    res.status(err.status || 500);
    res.render('error');
});

// port에 연결
app.listen(app.get('port'),() => {
    console.log(app.get('port'),'번 포트에서 대기중');
});