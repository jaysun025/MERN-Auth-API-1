const express = require('express')
const router = express.Router()
const User = require('../models/User')
const bcrypt = require('bcrypt')
const { createUserToken } = require('../middleware/auth')

// SIGN UP
// POST /api/signup
router.post('/signup', (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
  .then(hash => ({email: req.body.email, password : hash }))
  .then(hashedUser => User.create(hashedUser))
//.then(createdUser => res.status(201).json(createdUser))
  .then(createdUser => createUserToken(req, createdUser))
  .then(token => res.status(201).json({token}))
  .catch(next)
})

// LOG IN
// POST /api/login
router.post('/login', (req, res, next)=>{
    User.findOne({email: req.body.email})
    .then(foundUser=>createUserToken(req, foundUser))
    .then(token=>res.json({token}))
    .catch(next)
})

module.exports = router