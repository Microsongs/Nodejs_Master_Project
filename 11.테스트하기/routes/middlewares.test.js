const { isLoggedIn, isNotLoggedIn } = require('./middlewares');

// describe는 테스트의 그룹화
describe('isLoggedIn', () => {
    // 가짜 req, res, next 가짜를 만드는 행위 : 모킹
    const res = {
        status: jest.fn(() => res),
        send: jest.fn(),
    };
    const next = jest.fn();

    test('로그인 되어 있으면 isLoggedIn이 next를 호출해야 함', () => {
        const req = {
            isAuthenticated: jest.fn(() => true),
        };
        isLoggedIn(req, res, next);
        // 가짜를 만들어 호출 횟수를 테스트
        expect(next).toBeCalledTimes(1);
    });
    
    test('로그인 되어 있지 않으면 isLoggedIn이 error를 호출해야 함', () => {
        const req = {
            isAuthenticated: jest.fn(() => false),
        }
        isLoggedIn(req, res, next);
        expect(res.status).toBeCalledWith(403);
        expect(res.send).toBeCalledWith('로그인 필요');
    });
});

describe('isNotLoggedIn', () => {
    // 가짜 req, res, next 가짜를 만드는 행위 : 모킹
    const res = {
        status: jest.fn(() => res),
        send: jest.fn(),
        redirect: jest.fn(),
    };
    const next = jest.fn();
    
    test('로그인 되어 있으면 isNotLoggedIn이 error를 호출해야 함', () => {
        const req = {
            isAuthenticated: jest.fn(() => true),
        };
        const message = encodeURIComponent('로그인한 상태입니다.');
        isNotLoggedIn(req, res, next);
        expect(res.redirect).toBeCalledWith(`/?error=${message}`);
    });
    
    test('로그인 되어 있지 않으면 isNotLoggedIn이 next를 호출해야 함', () => {
        const req = {
            isAuthenticated: jest.fn(() => false),
        }
        isNotLoggedIn(req, res, next);
        expect(next).toBeCalledTimes(1);
    });
});
