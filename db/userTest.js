const User = require('../models/User')

User.create({
    email: 'test2@test2.com',
    password: 'test2password'
}, (err, createdUser) => {
    if (err) console.log('Error added test user', err)
    else console.log('success!', createdUser)
})