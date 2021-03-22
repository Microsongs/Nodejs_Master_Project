const Sequelize = require('sequelize');

// 모델 생성 클래스가 Sequelize의 무델이므로 Mysql의 table과 매칭
module.exports = class User extends Sequelize.Model{
    // User 설정, 꼭 static으로 해야 함
    static init(sequelize){
        return super.init({
            // id primary key는 생략, 원래는 아래와 같이 되어있음
            /*
            id: {
                type: Sequelize.INTEGER(11),
                allowNull: false,
                primaryKey: true,
            } 
            */
            // email -> 길이40, null가능, 고유적임 -> 빈 값 2개는 같은 것으로 치지 않음
            email: {
                type: Sequelize.STRING(40),
                allowNull: true,
                unique: true
            },
            // 닉네임 -> 길이15, null불가능
            nick: {
                type: Sequelize.STRING(15),
                allowNull: false,
            },
            // 비밀번호 -> 길이40, null가능, SNS 로그인 시 비밀번호 없을 수 있음
            password: {
                type: Sequelize.STRING(100),
                allowNull: true,
            },
            // 로그인 제공자 : local은 Nodebird의 email로 로그인, 네이버, 카카오, 구글 등 로그인 일 경우 해당 로그인
            provider: {
                type: Sequelize.STRING(10),
                allowNull: false,
                defaultValue: 'local',
            },
            // 카카오, 네이버, 구글 등으로 로그인, SNS아이디를 알려주어 저장을 하고 있어야 함
            snsId: {
                type: Sequelize.STRING(30),
                allowNull: true,
            }
        }, {
            // timestamps와 paranoid가 true이므로 CreatedAt UpdatedAt DeleteAt이 각각 기록됨
            // charset과 collate를 적어야 한글 지원
            sequelize,
            timestamps: true,
            underscored: false,
            modelName: "User",
            tableName: "users",
            paranoid: true,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }
    // User 테이블의 관계 설정
    static associate(db){
        // 유저와 게시글은 1:다 관계
        db.User.hasMany(db.Post);
        //1:다 관계
        db.User.hasMany(db.Domain);
        // 유저와 유저는 다:다 관계
        db.User.belongsToMany(db.User, {
            foreignKey: 'followingId',
            as: 'Followers',
            through: 'Follow',
        });
        db.User.belongsToMany(db.User, {
            foreignKey: 'followerId',
            as: 'Followings',
            through: 'Follow',
        });
    }
}