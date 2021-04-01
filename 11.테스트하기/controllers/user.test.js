const { addFollowing } = require('./user');
// require할 필요가 없으므로 .jest로 모킹해준다, 위에 있어야 가짜로 바꾸고 require함
jest.mock('../models/user');
const User = require('../models/user');


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
        // 원래 User.findOne이 promise를 리턴하기 때문, 해당 값을 넣으면 무조건 id:1 name:zerocho를 찾게됨
        User.findOne.mockReturnValue(Promise.resolve({
            id : 1,
            name : 'zerocho',
            addFollowings(value){
                return Promise.resolve(true);
            }
        }));
        // 비동기 함수이므로 await
        await addFollowing(req, res, next);  
        expect(res.send).toBeCalledWith('success');
    });

    test('사용자를 못 찾으면 res.status(404).send(no user)를 호출함', async () => {
        // 사용자를 못찾았으므로 resolve도 null
        User.findOne.mockReturnValue(Promise.resolve(null));
        await addFollowing(req, res, next);
        expect(res.status).toBeCalledWith(404);
        expect(res.send).toBeCalledWith('no user');
    });
    test('DB에서 에러가 발생하면 next(error)를 호출함', async () => {
        const error = '테스트용 에러';
        // reject는 catch로 바로 보냄
        User.findOne.mockReturnValue(Promise.reject(error));
        await addFollowing(req, res, next);
        expect(next).toBeCalledWith(error);
    });
})