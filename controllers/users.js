const express = require('express')
const router = express.Router()

// SIGN UP
// POST /api/signup
router.post('/signup', (req, res) => {
    res.send('hit signup post route')
})

// LOG IN
// POST /api/login
router.post('/login', (req, res) => {
    res.send('hit login post route')
})

module.exports = router