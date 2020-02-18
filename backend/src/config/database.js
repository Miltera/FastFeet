/*require('dotenv').config();

module.exports = {
  dialect: 'postgres',
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  },
};*/

module.exports = {
  dialect: 'sqlite',
  storage: 'dbFastfeet.sqlite3',
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  },
};
