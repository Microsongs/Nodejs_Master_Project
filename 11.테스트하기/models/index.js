// sequlize 연결
const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
// 설정 파일 불러옴 -> config의 development를 가져옴
const config = require('../config/config')[env];

// 앞으로 만들 모델들
const User = require('./user');
const Post = require('./post');
const Hashtag = require('./hashtag');
const Domain = require('./domain');

const db = {};
const sequelize = new Sequelize(
  config.database, config.username, config.password, config,
);

db.sequelize = sequelize;
db.User = User;
db.Post = Post;
db.Hashtag = Hashtag;
db.Domain = Domain;

User.init(sequelize);
Post.init(sequelize);
Hashtag.init(sequelize);
Domain.init(sequelize);

User.associate(db);
Post.associate(db);
Hashtag.associate(db);
Domain.associate(db);

// db를 내보냄
module.exports = db;