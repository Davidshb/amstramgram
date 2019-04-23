const { AccountDeleteTimeout, ...rest } = require('./functions')

module.exports = {
  ...require('./mails'),
  isDev: process.env.NODE_ENV !== 'production',
  tasks: () => {
    new AccountDeleteTimeout().build()
  },
  ...rest,
  url: this.isDev ? 'localhost:3000/' : '/'
}
