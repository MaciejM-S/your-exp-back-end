const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SG_SECRET)




const resetingPasswordEmail = (email, name, newPassword)=>{

const msg = {
  to: email,
  from: 'aaa_tom@interia.pl',
  subject: 'MyExp admin - password reseting',
  // text: 'and easy to do anywhere, even with Node.js',
  html: `
  Hello <strong>${name}</strong>,
  your new password to your Exp profile is: 
  <br/>
  <strong>
  ${newPassword}
  </strong>
  <br/>
  You can use it now to sign in in to your account.
  `,
}

  sgMail
  .send(msg)
  .then(() => {
  })
  .catch((error) => {
    console.error(error)
  })
}

module.exports = resetingPasswordEmail