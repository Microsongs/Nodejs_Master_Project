const { addFollowing } = require('./user');

describe('addFollowing', () => {
    // 가짜 req,res,next 
    const req = {
        user: { id:1 },
        params: { id:2 },
    };
    const res = {
        status: jest.fn(()=>res),
        send: jest.fn(),
    };
    const next = jest.fn();

    // test1 -> if(user)
    test('사용자를 찾아 팔로잉을 추가하고 success를 응답해야 함', async () => {
        // 비동기 함수이므로 await
        await addFollowing(req, res, next);  
        expect(res.send).toBeCalledWith('success');
    });

    test('사용자를 못 찾으면 res.status(404).send(no user)를 호출함', async () => {
        await addFollowing(req, res, next);
        expect(res.status).toBeCalledWith(404);
        expect(res.send).toBeCalledWith('no user');
    });
    test('DB에서 에러가 발생하면 next(error)를 호출함', async () => {
        const error = '테스트용 에러';
        await addFollowing(req, res, next);
        expect(next).toBeCalledWith(error);
    });
})