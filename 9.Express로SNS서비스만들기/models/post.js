const Sequelize = require('sequelize');

// 게시글의 클래스
module.exports = class Post extends Sequelize.Model {
    static init(sequelize){
        return super.init({
            // 콘텐츠 -> 길이140 내용必
            content: {
                type: Sequelize.STRING(140),
                allowNull: false,
            },
            // 이미지 -> 길이200 내용null가능 1개 가능
            // 여러 개 올리려면 table을 생성하여 1:다 관계를 맺어주면 됨
            img: {
                type: Sequelize.STRING(200),
                allowNull: true,
            },
        }, {
            // delete하면 deleteAt대신 진짜 삭제할 것
            // utf8mb4로 이모티콘까지 저장 가능
            sequelize,
            timestamps: true,
            underscored: false,
            modelName: 'Post',
            tableName: 'posts',
            paranoid: false,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
        });
    }
    // 게시글 테이블의 관계 설정
    static associate(db){
        // 게시글과 유저는 다:1 관계
        db.Post.belongsTo(db.User);
        // 게시글과 해시태그는 다:다 관계
        db.Post.belongsToMany(db.Hashtag, {through: 'PostHashtag'});
    }
}