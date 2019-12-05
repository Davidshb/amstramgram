const { AccountDeleteTimeout, ...rest } = require('./functions')

module.exports = {
  ...require('./mails'),
  isDev: process.env['NODE_ENV'] !== 'production',
  tasks: async () => {
    return Promise.resolve(AccountDeleteTimeout())
  },
  ...rest,
  url: this.isDev ? 'localhost:3000/' : '/'
}
