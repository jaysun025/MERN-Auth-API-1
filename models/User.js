const mongoose = require('../db/connection')

const options = { 
    timestamps: true,
    toJSON: { 
        virtuals: true,
        transform: (_doc, userDocToReturn) => {
            delete userDocToReturn.password
            return userDocToReturn
        }
    },
}

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
}, options)

module.exports = mongoose.model('User', userSchema)