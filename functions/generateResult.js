
const User = require("../models/User")

async function generateResult(inq, _id) {
    let friends = []

    friends = await User.find({ 'info.lastName': { "$regex": inq, $options: 'i' } })

    let firstName = await User.find({ 'info.firstName': { "$regex": inq, $options: 'i' } })

    
    if (friends.length > 0) {

        firstName.forEach(item => {
            friends.forEach(friend => {
                if (friend._id.toString() !== item._id.toString()) {
                    friends.concat(friend)
                }
            }
            )
        }
        )
    }
    else {
        friends = [...friends, ...firstName]
    }

    let friendsForClient = []

    friends.map(friend => {

        if (!friend.restrictedInfo) {
            
            friendsForClient.push({
                _id: friend._id,
                firstName: friend.info.firstName,
                lastName: friend.info.lastName,
                avatar: friend.avatar,
                residence: friend.info.residence,
                education: friend.info.education,
                workplace: friend.info.workplace,

            })
        }
        else if (friend.restrictedInfo) {

            let isAFriend

            if (friend.friends.find(
                    item => {

                        return item._id === _id.toString()
                    }
                )) {
                isAFriend = true
            }
            else { isAFriend = false }


            if (isAFriend) {

                friendsForClient.push({
                    _id: friend._id,
                    firstName: friend.info.firstName,
                    lastName: friend.info.lastName,
                    avatar: friend.avatar,
                    residence: friend.info.residence,
                    education: friend.info.education,
                    workplace: friend.info.workplace,

                })

            }else{

                friendsForClient.push({
                _id: friend._id,
                firstName: friend.info.firstName,
                lastName: friend.info.lastName,
                avatar: friend.avatar,
            })
            }
        }
    })

        const userIndex = friendsForClient.findIndex
        (friends=>friends._id.toString()===_id.toString())

        if(userIndex!==-1)friendsForClient.splice(userIndex, 1)



    return friendsForClient
}



module.exports = generateResult