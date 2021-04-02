// supertest를 하기위해 만든 파일
const app = require('./app');

// port에 연결
app.listen(app.get('port'),() => {
    console.log(app.get('port'),'번 포트에서 대기중');
});