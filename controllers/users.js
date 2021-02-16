const express = require('express')
const router = express.Router()
const User = require('../models/User')
const bcrypt = require('bcrypt')
const { createUserToken } = require('../middleware/auth')

// SIGN UP
// POST /api/signup
router.post('/signup', (req, res) => {
  bcrypt.hash(req.body.password, 10)
  .then(hash => ({email: req.body.email, password : hash }))
  .then(hashedUser => User.create(hashedUser))
  .then(createdUser => res.json(createdUser))
  .catch(err => {console.log(err)})
})

// LOG IN
// POST /api/login
router.post('/login', (req, res)=>{
    User.findOne({email: req.body.email})
    .then(foundUser=>createUserToken(req, foundUser))
    .then(token=>res.json({token}))
    .catch(err=>console.log(err))
})

module.exports = router