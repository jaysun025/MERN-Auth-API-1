const express = require('express')
const router = express.Router()
const User = require('../models/User')
const bcrypt = require('bcrypt')

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
router.post('/login', (req, res) => {
    res.send('hit login post route')
})

module.exports = router