const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({

    info: {

        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: true
        },
        residence: {
            type: String,
        },

        education: {
            type: String,
        },
        workplace: {
            type: String,
        },
    },

    email: {
        type: String,
        required: true,

    },
    password: {
        type: String,
        required: true
    },
    tokens: [{
        token:
            { type: String }
    }],
    avatar: {
        date: {
            type: String
        },
        data: {
            type: Buffer
        },
        description: {
            type: String
        }
    },
    profilePic: {
        date: {
            type: String
        },
        data: {
            type: Buffer
        },
        description: {
            type: String
        }
    },
    pictures: [{
        picture: {
            data: {
                type: Buffer
            }
        }
    }],

    invitationsSent: [{
        _id: { type: String }
    }],

    invitationsRecieved: [{
        _id: { type: String }
    }],

    friends: [{
        _id: { type: String }
    }],

    blocked: [{
        _id: { type: String }
    }],

    restrictedInfo: {
        type: Boolean,
        default: false
    },

    restrictedPhotos: {
        type: Boolean,
        default: false,
    },

    posts: [{
        post: {
            user_id: { type: String },
            userFirstName: { type: String },
            userLastName: { type: String },
            userAvatar: { data: { type: Buffer } },

            type: { type: String },
            date: { type: String },
            photos: [
                {
                    data:
                        { type: Buffer }
                }],
            description: { type: String },
            commentsId:{type:String},
            title:{type:String},
            description:{type:String},
            range:{type:String},

        }

    }]



})

userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar
    delete userObject.pictures

    return userObject

}

const User = mongoose.model('user', userSchema)

module.exports = User