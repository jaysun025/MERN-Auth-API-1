const express = require('express')
const router = express.Router()
const User = require('../models/User')

// SIGN UP
// POST /api/signup
router.post('/signup', (req, res) => {
    User.create(req.body)
    .then((user) => res.json(user))
    .catch(err=>{
      console.log('Oops, there was an error creating the user!')
    })
})

// LOG IN
// POST /api/login
router.post('/login', (req, res) => {
    res.send('hit login post route')
})

module.exports = router