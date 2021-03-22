const Sequelize = require('sequelize');

// domain 테이블을 하나 더 생성 -> api 서버는 다른 서드파티에서 가져가는데, data 제한을 둘 수 있음
// 제한을 두려면 누구인지 알아야 한다
module.exports = class Domain extends Sequelize.Model {
    static init(sequelize){
        return super.init({
            // 요청을 보낼 host
            host: {
                type: Sequelize.STRING(80),
                allowNull: false,
            },
            // 무료 / 프리미엄 버전 -> 요금제
            type: {
                type: Sequelize.ENUM('free','premium'),
                allowNull: false,
            },
            // restAPI 키
            clientSecret: {
                type: Sequelize.STRING(30),
                allowNull: false,
            },
        },{
            sequelize,
            timestamps: true,
            paranoid: true,
            modelName: 'Domain',
            tableName: 'domains',
        });
    }
    static associate(db){
        db.Domain.belongsTo(db.User);
    }
};