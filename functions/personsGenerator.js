const { isObjectIdOrHexString } = require("mongoose")
const User = require("../models/User")


async function personsGenerator(invited) {

  let persons = []


  for (let i=0; i < invited.length; i++) {

    const user = await User.findById(invited[i])
    
    let personForClient = {}
    personForClient.info = user.info
    personForClient.avatar = user.avatar
    personForClient._id = user._id
    persons.push(personForClient)

  }

  return persons

}

module.exports = personsGenerator