const passport = require('passport')
const Strategy = require('passport-jwt').Strategy

const options = {
    secretOrKey: 'some string value only your app knows',
    // How passport should find and extract the token from
    // the request.
    jwtFromRequest: 
  }

// construct the strategy (will define options and verifyCallback soon)
const strategy = new Strategy(options, verifyCallback)

// Now that we've constructed the strategy, we 'register' it so that
// passport uses it when we call the `passport.authenticate()`
// method later in our routes
passport.use(strategy)

// Initialize the passport middleware based on the above configuration
passport.initialize()

