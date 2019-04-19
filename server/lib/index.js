const { AccountDeleteTimeout } = require('./functions')

module.exports = {
  ...require('./mails'),
  tasks: () => {
    new AccountDeleteTimeout().build()
  }
}
