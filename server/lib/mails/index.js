const mailjet = require('node-mailjet').connect(process.env.MAILJET_API_KEY_PUBLIC, process.env.MAILJET_API_KEY_PRIVATE)

const MailTypes = Object.freeze({
  NewUser: 0,
  EmailVerification: 1
})

const newUser = ({ email: Email, familyName, displayName, token }) => {
  const data = {
    Messages: [
      {
        From: { Email: 'no-reply@amstramgram.ml', Name: 'no-reply' },
        To: [{ Email: 'nograe117@gmail.com' }],
        Subject: 'Tu veux tu me lire',
        TextPart: `Je suis outré !`,
        HTMLPart: `<h3 style="text-align: center;">Comme tu peux le voir 😘</h3> <div style="overflow: scroll; width: 100%; height: 200px; background-color: beige; display: flex; flex:1; align-items: center; flex-direction: column; justify-content: space-between;">
<a href="http://www.google.com" style="padding:20px 50px; background-color: brown; font-size: 20px; color: white;">Clique pour voir</a>
<div style="font-size: 50px;">T'inquiète pas ça va biens se passer</div>
</div>`
      }
    ]
  }

  mailjet.post('send', { 'version': 'v3.1' })
         .request(data)
         .then(res => console.log(res))
         .catch(err => console.error(err))
}

module.exports = {
  MailTypes,
  newMessage: function (type, data) {
    switch (type) {
      case MailTypes.NewUser:
        newUser(data)
        break
      case MailTypes.EmailVerification:
        break
    }
  }
}
