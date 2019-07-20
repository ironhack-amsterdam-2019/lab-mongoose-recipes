require('dotenv').config();

let url = process.env.DB_URL

module.exports = {
  modelBaseDirectory: 'models',
  models: '**/*.js',
  data: 'data',
  db: url
};