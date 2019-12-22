module.exports = {
  ...require('./mails'),
  isDev: process.env['NODE_ENV'] !== 'production',
  ...require('./functions'),
  url: this.isDev ? 'localhost:3000/' : '/'
}
