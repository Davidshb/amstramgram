const mailjet = require('node-mailjet').connect(process.env.MAILJET_API_KEY_PUBLIC, process.env.MAILJET_API_KEY_PRIVATE)
const ejs = require('ejs')
const path = require('path')

const MailTypes = Object.freeze({
  NewUser: 0,
  resetPassword: 1
})

const newUser = ({ Email, confirmation_link, name }) =>
  ejs.renderFile(path.resolve(__dirname, './templates/newUser.ejs'), {
    name,
    confirmation_link
  }, (error, data) => {
    if (error) return console.log(error)

    const mail = {
      Messages: [
        {
          From: { Email: 'no-reply@amstramgram.ml', Name: 'no-reply' },
          To: [{ Email }],
          Subject: 'Compte créé Amstramgram',
          TextPart: `Vous venez de créer un compte`,
          HTMLPart: data
        }
      ]
    }

    return mailjet
      .post('send', { 'version': 'v3.1' })
      .request(mail)
      .then(res => console.log(`email status ${Email} ${res.response.res.statusMessage}`))
      .catch(err => console.error(err))
  })

module.exports = {
  MailTypes,
  newMessage: function (type, data) {
    switch (type) {
      case MailTypes.NewUser:
        return newUser(data)
      case MailTypes.resetPassword:
        return
    }
  }
}
