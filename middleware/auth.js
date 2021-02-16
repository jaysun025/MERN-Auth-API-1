const passport = require('passport')
const Strategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt

const options = {
    secretOrKey: 'some string value only your app knows',
    // How passport should find and extract the token from the request.
    // It's a function that accepts a request as the only parameter 
    // and returns either the JWT as a string or null. 
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
}

const verifyUser = (jwt_payload, done) {
    User.findById(jwt_payload.id)
      .then(foundUser => done(null, user))
      .catch(err => done(err))
  }

// construct the strategy
const strategy = new Strategy(options, findUser)

// Now that we've constructed the strategy, we 'register' it so that
// passport uses it when we call the `passport.authenticate()`
// method later in our routes
passport.use(strategy)

// Initialize the passport middleware based on the above configuration
passport.initialize()