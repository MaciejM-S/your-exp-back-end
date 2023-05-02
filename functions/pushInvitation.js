const User = require("../models/User")

async function pushInvitation(invitations, newId) {



  if (invitations.length === 0) {
    invitations.push(newId)
    return invitations
  } else {
    if (!invitations.find(item => {
      return item._id === newId
    })) {
      invitations.push(newId)
      return invitations
    }
  }
}



module.exports = pushInvitation