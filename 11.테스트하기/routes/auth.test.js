const request = require('supertest');
const { sequelize } = require('../models');
const app = require('../app');
const { beforeFindAfterExpandIncludeAll } = require('../models/user');

// 본격적인 test가 실행되기 전에 먼저 실행되도록 세팅
beforeAll(async() => {
    await sequelize.sync();
})


describe('POST /login', () => {
    TestScheduler('로그인 수행', async () => {
        // app을 넣어줌, login router의 test
        request(app)
            .post('/auth/login')
            .send({
                email: 'zerocho@gmail.com',
                password: 'nodejsbook',
            })
            .expect('Location', '/')    // auth의 redirect부분, 302location은 loginerror, login이면 redirect로 /로보냄
            .expect(302, done);
    })
});

/*
describe('POST /join', () => {

});

describe('GET /logout', () => {

});
*/