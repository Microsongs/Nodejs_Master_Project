const Sequelize = require('sequelize');

module.exports = class Hashtag extends Sequelize.Model{
    static init(sequelize){
        return super.init({
            // 해시태그 -> 이름만 존재
            title: {
                type: Sequelize.STRING(15),
                allowNull: false,
                unique: true,
            }
        },{
            sequelize,
            timestamps: true,
            underscored: false,
            modelName: 'Hashtag',
            tableName: 'hashtags',
            paranoid: false,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
        });
    }
    static associate(db){
        // 해시태그와 게시글은 다:다 관계
        db.Hashtag.belongsToMany(db.Post, {through: 'PostHashtag'});
    }
};