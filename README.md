[![General Assembly Logo](https://camo.githubusercontent.com/1a91b05b8f4d44b5bbfb83abac2b0996d8e26c92/687474703a2f2f692e696d6775722e636f6d2f6b6538555354712e706e67)](https://generalassemb.ly/education/web-development-immersive)

# Express API & Authentication

Throughout this tutorial, we'll build an Express API as the back end to a boilplate application that has users and authenticates them using Passport middleware.

## Basic Express API Setup

First let's quickly set up a basic project environment.

### Scaffold the Project

1. From the command line, create a new directory and switch into it with `mkdir MERN-AUTH-API && cd MERN-AUTH-API`.
1. Run `git init` to initialize the repository for Git.
1. Create a `.gitignore` and add the node_modules directory to it with `echo node_modules > .gitignore`
1. Creat a `.env` file with `touch .env`
1. Create an `index.js` file with `touch index.js`.
1. Create some directories inside your project to organize your code with `mkdir models db controllers middleware`.
1. Run `npm init -y` to initialize the repository for npm.
1. Install dependencies with `npm i express cors mongoose dotenv`.
1. Open the directory in VS Code with `code .`.

1.  Create your directory folders:
<!-- INIT_DIRECTORY_DIAGRAM - START -->
```md
MERN-AUTH-API
    ├── index.js
    ├── controllers
    ├── middleware
    ├── models
    └── db
```
<!-- INIT_DIRECTORY_DIAGRAM - START -->
<!-- prettier-ignore-end -->

12. Save, add, and commit your files:

```bash
git add .
git commit -m "Initial commit"
```

13. Create a new repository on GitHub and copy the code in the section that reads: **`…or push an existing repository from the command line`** by clicking the copy icon on the right side of the code block.
1. Paste the code in the Terminal window.

### TODO: Set up cluster on Atlas

### Connect to MongoDB

1. Create a file in the `db` directory called `connection.js` and add the following code:

```js
const mongoose = require('mongoose');
const DB_CONNECTION_STRING = `<put your connection string here>`

mongoose
  .connect()
  .then((DB_CONNECTION_STRING) =>
    console.log(`Connected to db: ${instance.connections[0].name}`)
  )
  .catch((error) => console.log('Connection failed!', error));

module.exports = mongoose;
```

Make sure to add a db username and password and name to the appropriate parts of the connection string. For example: `mongodb+srv://sei:seisei@sei-mern-auth.a0ell.mongodb.net/SEI-MERN-Auth?retryWrites=true&w=majority`

2.Back in the Terminal make sure you're in the `MERN-AUTH-API` directory and run the file to test your connection using NodeJS with `node db/connection.js`. If you get a `Connection failed` error or do not see `Connected to db: job-board`, [check and make sure that your MongoDB server is running](https://git.generalassemb.ly/seir-129/mongo-install-homework). Otherwise, you should see output similar to the following:

```bash
(node:48059) DeprecationWarning: current URL string parser is deprecated, and will be removed
in a future version. To use the new parser, pass option { useNewUrlParser: true } to MongoClient.connect.
(node:48059) DeprecationWarning: current Server Discovery and Monitoring engine is deprecated,
and will be removed in a future version. To use the new Server Discover and Monitoring engine,
pass option { useUnifiedTopology: true } to the MongoClient constructor.
Connected to db: job-board
```

3. Let's get rid of the warnings by modifying the `mongoose.connect()` method like so [mongoose deprecation docs](https://mongoosejs.com/docs/deprecations.html):

```js
mongoose
  .connect(DB_CONNECTION_STRING, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  })
  ...
```

4. Back in the Terminal, type `control + C` to stop the process that's running and return to the command prompt. Now, try running the connection.js file again with `node db/connection.js`. This time you should only see the connection message.

5. Great! But, we know that this API isn't always going to be run on our Atlas cluster, so we should use an environment variable for the connection string. 

* Move your connection string to be an environment variable by putting it in your `.env` file, then import and configure `dotenv` at the top of `db/connection.js`.

* You'll also need to change the `connect` argument to include the `process.env.DB_CONNECTION_STRING`. 

6. Finally, export your connected mongoose instance for use in other files by adding `module.exports = mongoose`

The completed file will look like this:

```js
// Import dotenv and configure it for use in this file
require('dotenv').config()
// Import Mongoose to interface with MongoDB
const mongoose = require('mongoose');

// Use Mongoose's connect method to connect to MongoDB by passing it the db URI.
// Pass a second argument which is an object with the options for the connection.
mongoose.connect(process.env.DB_CONNECTION_STRING, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  })
  // If the connection is successful, give a message in the Terminal with the db name
  .then(instance =>
    console.log(`Connected to db: ${instance.connections[0].name}`)
  )
  // If the connection fails, give a message and pass along the error so we see it in
  // the Terminal.
  .catch(error => console.log('Connection failed!', error));

// Export the connection so we can use it elsewhere in our app.
module.exports = mongoose;
```

6. Save and close the file in VS Code and back in the Terminal, type `control + C` to stop the process that's running and return to the command prompt. Add and commit your changes!

### Setup a Server

1. In the `index.js` file lets create a basic Express server and get it running. We need to require Express and store it in a variable called `express`. Then we'll invoke express to instantiate the Express application object and store that in a variable called `app`. Finally, we'll listen on port 8000 for requests and add a callback so we know its running. The basic server looks like this:

```js
const express = require('express');
const app = express();

app.listen(8000, () => {
  console.log('listening on port 8000');
});
```

2. Use `nodemon` to run the server.

3. This server doesn't do anything at all, so lets build it out a bit more. We know we'll be adding our routes in here so let's require `mongoose` and while we're at it import the [cors package](https://www.npmjs.com/package/cors) and set up the middleware. Remember, to use a middleware in Express we need to pass it to the `app.use()` method.
1. We're also going to have to use two of the built-in middleware packages since we're going to be making requests via AJAX to the server, so add `app.use(express.json())` and `app.use(express.urlencoded({ extended: true }))`.
1. Lastly, again, we know that eventually we'll be running this on a remote server, so lets create a PORT environment variable. We can assign the variable the value of the PORT environment variable that will be set in Heroku OR if that environment variable doesn't exist, it should use 8000.

The completed file should look like this when done:

```js
// Require necessary NPM packages
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Instantiate express application object
const app = express();

// The `.use` method sets up middleware in Express

// Set up cors middleware and make sure that it
// comes before our routes are used.
app.use(cors());

// The urlencoded middleware parses requests which use
// a specific content type (such as when using Axios)
app.use(express.urlencoded({ extended: true }))

// Run server on designated port
app.listen(process.env.PORT || 8000, () => {
  console.log('SEI MERN AUTH API running')
})
```

### Create the User Model

1. Create a new file in the `models` directory called `User.js`.
1. Create a basic user model. To keep things simple, our model is going to be super streamlined with just `email` and `password` fields. We'll also add a timestamp [option](https://mongoosejs.com/docs/guide.html#options) so we automatically get the `createdAt` and `updatedAt` fields.

```js
const mongoose = require('../db/connection');
const options = {
  timestamps: true
}
const userSchema = new mongoose.Schema({
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
}, options)

module.exports = mongoose.model('User', userSchema);
```

### Test User Model

Create a `db/userTest.js` file and import the user model. Add mongoose code to create a new user ([mongoose docs for inserting](https://mongoosejs.com/docs/models.html#compiling)):

```js
const User = require('../models/User')

User.create({
    email: 'test@test.com',
    password: 'testpassword'
}, (err, createdUser) => {
    if (err) console.log('Error added test user', err)
    else console.log('success!', createdUser)
})
```
Run `node db/userTest.js` and check that the test user was added successfully (you'll see the console log if it did, but also look in your collection on Atlas)!

### Create Routes for the User Resource

1. Create a new file in the `controllers` directory called `users.js`.
1. Require express, the user model, and create a router and export it:

```js
const express = require('express');
const router = express.Router();

// routes/controllers here

module.exports = router;
```

You'll also need to write the controller middleware for users in `index.js`:



1. Stub out the routes for our user resource. They will be:

- /signup: a POST route that will create a new user in the database
- /login: a POST route that will create a new authorization token for the user

```js
// SIGN UP
// POST /api/signup
router.post('/signup', (req, res) => {
    res.send('hit signup post route')
})

// Log IN
// POST /api/signin
router.post('/login', (req, res) => {
    res.send('hit login post route')
})
```

Import the user controllers to `index.js` underneath any other middleware you have:

```js
// Import the user resource actions
app.use('/api', require('./controllers/users'))
```

Test that these routes are being hit via Postman!

3. Import the `User` model into your users controller
`const User = require('../models/User')`

4. Add create to the signup controller:

```js
router.post('/signup', (req, res, next) => {
  User.create(req.body)
    .then((createdUser) => res.send(createdUser))
    .catch(err=>{
      console.log('Oops, there was an error creating the user!')
    })
})
```

Use Postman to sign up a new user!

5. We're building an API that will send data in JSON format, so let's be legit and use the [JSON response method](http://expressjs.com/en/api.html#res.json) provided by express. 

```js
router.post('/signup', (req, res, next) => {
  User.create(req.body)
    .then(createdUser => res.json(createdUser)) 
    .catch(err => {console.log(err)})
})
```

In order for this to work, we also have to include the [express JSON middleware](http://expressjs.com/en/api.html#express.json) in `index.js`:

```js
// Add `express.json` middleware which will
// parse JSON requests into JS objects before
// they reach the route files.
app.use(express.json());
```

Check out [this medium article](https://medium.com/gist-for-js/use-of-res-json-vs-res-send-vs-res-end-in-express-b50688c0cddf) or the express docs to learn more about the differences between `.json` and `.send`.

Try signing up another user to make sure all is still functioning. You shouldn't notice any difference in behavior of your app.

### Prevent Passwords from Being Sent to Clients

You may have noticed that when you created a new user, you got back a user document with the user's password. That's a huge security hole in our API right now. We can fix it using Mongoose [Virtuals](https://mongoosejs.com/docs/tutorials/virtuals.html) pretty easily though. Virtuals are used to transform data without persisting the transformation in MongoDB. We'll create a virtual that will automatically remove the password field any time we use a toJSON method (including `JSON.stringify()`, Mongoose's `.toJSON()` method or Express' `.json()` method). Even though the field is being deleted by the virtual, it remains safe and sound in our database.

1. Open the `models/User.js` file.
1. Update the schema as follows to add a virtual:

```js
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
```

Create a new user in Postman. :tada: No more password being sent! However, it seems we introduced another issue. Now, we have both an `_id` and an `id` field. Technically, this additional `id` field is just a virtual because we used a toJSON virtual. You can verify that itʼs not storing the value in MongoDB separately. If it bugs you, you can add `id: false` as a key/value pair in the options object that has the `timestamps` and `toJSON` properties.

### Store a Hashed Password

We're breaking a cardinal rule of user security by saving the user's password in plain text. Even in a-just-for-fun, non-commercial app, we're opening ourselves up to financial liability and risking the security of users who often reuse the same password on multiple sites. So lets fix that, shall we?

When it comes to storing password data securely, the only thing we can do is not store it at all. Instead we should store a hash of the password. Hashing is a **one-way function**. Hashed values are not designed to be reversed to obtain the original input value like encrypted values, which are designed to be decrypted. If you apply the same hashing algorithm to the same value you'll always get the same hash though. That means we can store the hash of the password and when users sign into the system, we can hash the password they send and compare it with the hash in the database to verify that they provided the correct password.

1. We'll use a popular npm package called `bcrypt` to hash our passwords, so in the Terminal run `npm i bcrypt`.
1. Require the `bcrypt` package in your `controllers/users.js` file with `const bcrypt = require('bcrypt');`.
1. To hash the password, we'll use the `bcrypt.hash()` method which takes two arguments. The first argument is the value we want to hash and the second is the number of salt rounds. Salting is a way to make the hash stronger. Each time the value is salted, it is transformed in some way by adding another value to it. The more times you salt, the more the original value is changed and obscured. We're going to use `10` salt rounds. The bcrypt `.hash()` method is asynchronous.

```js
  ...
const bcrypt = require('bcrypt');
  ...

//Using promise chain
router.post('/signup', (req, res) => {
  bcrypt.hash(req.body.password, 10)
  .then(hash => ({email: req.body.email, password : hash }))
  .then(hashedUser => User.create(hashedUser))
  .then(createdUser => res.json(createdUser))
  .catch(err => {
    console.log(err)
  })
})
```

Create a new user with a different email address in Postman. If you look in Mongo, you should see that the password is now hashed and looks something like this:

```json
"password" : "$2b$10$5g62t1K7SUovJ2.XonHfy.kiDWQr/UEpR1ha8DSwAWWpBob5WXAKy"
```
If your passwords are hashed, add and commit your changes.

## Add Authentication

In this part of the tutorial, we'll be tackling the steps needed to add authentication to our app. We'll be using [Passport](http://www.passportjs.org/) to simplify the authentication process. To use Passport, we need to install it in our app along with one (or more) of the over [500 strategies](http://www.passportjs.org/packages/) it offers for authentication. For this tutorial, we'll be employing a strategy which uses JSON Web Tokens ([JWT](https://jwt.io/introduction/)).

JWT is an open standard and an excellent choice for modern applications based on REST architectures. The fundamental premise of the REST architectural style is that the **server does not store any state** about the client session on the server side, hence the name Representational **State Transfer**. In REST, every HTTP request happens in complete isolation. It is up to the client to send (i.e., transfer) whatever state is needed to carry out the request. JWT provides a lightweight approach to transferring state from the client to the server in a secure fashion.

### Configure Passport

Each Passport strategy has to be configured for your specific app. Basically, Passport gives us a callback and we fill it in with any logic needed to get the user from our database that matches some bit of data that Passport extracts from a request. After configuring the strategy with the code to retrieve the user from the database, we register the strategy, and initialize Passport.

Once initialized, weʼll run the passport strategy as route middleware. When run as middleware, Passport receives the request, extracts the user information from the token, then attaches the user info back to the request object so it is accessible by whatever action (route) it hits.

1. Create a new file in the `middleware` directory called `auth.js`.
1. Install passport
```bash
npm i passport
```
1. import it into `auth.js`. Stub out the generic passport structure:

```js
const passport = require('passport')

// construct the strategy (TODO)
const strategy

// 'Register' the strategy so that passport uses it
//  when we call the `passport.authenticate()`
//  method later in our routes
passport.use(strategy)

// Initialize the passport middleware based on the above configuration
passport.initialize()
```

1. Install passport's [JWT strategy](http://www.passportjs.org/packages/passport-jwt/)
```bash
npm i passport-jwt
```
1. import the `Strategy` constructor from `passport-jwt and construct the strategy:
```js
const passport = require('passport')
const Strategy = require('passport-jwt').Strategy

// construct the strategy (will define options and verifyCallback soon)
const strategy = new Strategy(options, verifyCallback)

...
```
1. Create an `options` object that we'll pass into the `Strategy` constructor.
```js
const Strategy = require('passport-jwt').Strategy

const options = {}

// construct the strategy (will define options and verifyCallback soon)
const strategy = new Strategy(options, verifyCallback)
```
1. The options object requires a `secretOrKey` field

```js
const Strategy = require('passport-jwt').Strategy

const options = {
  secretOrKey: 'some string value only your app knows'
}

// construct the strategy (will define options and verifyCallback soon)
const strategy = new Strategy(options, verifyCallback)
```
1. and : `npm i jsonwebtoken`.
1. Add the following code to `auth.js`. This code configures Passport to get the id for us out of the request token, find the matching user in the database and then add that user to the request object. It exports a middleware called `requireToken` that we can add to our routes where we want them to be accessible only for authenticated users. The `createUserToken` uses the `jsonwebtoken` package to create and encrypt the tokens according to the standard, which we'll call from our `/signin` route.

```js
// Require the needed npm packages
const passport = require('passport');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Create a secret to be used to encrypt/decrypt the token
// This can be any string value you want -- even gibberish.
const secret =
  process.env.JWT_SECRET || 'some string value only your app knows';

// Require the specific `strategy` we'll use to authenticate
// Require the method that will handle extracting the token
// from each of the requests sent by clients
const { Strategy, ExtractJwt } = require('passport-jwt');

// Minimum required options for passport-jwt
const opts = {
  // How passport should find and extract the token from
  // the request.  We'll be sending it as a `bearer` token
  // when we make requests from our front end.
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  // Any secret string to use that is unique to your app
  // We should store this in an environment variable so it
  // isn't ever pushed to GitHub!
  secretOrKey: secret,
};

// Require the user model
const User = require('../models/User');

// The callback will be passed the data that was
// extracted and decrypted by passport from the token that we get from
// the client request!  This data (jwt_payload) will include the user's id!
const strategy = new Strategy(opts, function (jwt_payload, done) {
  // In the callback we run our custom code. With the data extracted from
  // the token that we're passed as jwt_payload we'll have the user's id.
  // Using Mongoose's `.findOneById()` method, we find the user in our database
  User.findById(jwt_payload.id)
    // To pass the user on to our route, we use the `done` method that
    // that was passed as part of the callback.  The first parameter of
    // done is an error, so we'll pass null for that argument and then
    // pass the user doc from Mongoose
    .then((user) => done(null, user))
    // If there was an error, we pass it to done so it is eventually handled
    // by our error handlers in Express
    .catch((err) => done(err));
});

passport.use(strategy);
passport.initialize();

// Create a variable that holds the authenticate method so we can
// export it for use in our routes
const requireToken = passport.authenticate('jwt', { session: false });

// Create a function that takes the request and a user document
// and uses them to create a token to send back to the user
const createUserToken = (req, user) => {
  // Make sure that we have a user, if it's null that means we didn't
  // find the email in the database.  If there is a user, make sure
  // that the password is correct.  For security reason, we don't want
  // to tell the client whether the email was not found or that the
  // password was incorrect.  Instead we send the same message for both
  // making it much harder for hackers.
  if (
    !user ||
    !req.body.password ||
    !bcrypt.compareSync(req.body.password, user.password)
  ) {
    const err = new Error('The provided username or password is incorrect');
    err.statusCode = 422;
    throw err;
  }
  // If no error was thrown, we create the token from user's id and
  // return the token
  return jwt.sign({ id: user._id }, secret, { expiresIn: 36000 });
};

module.exports = {
  requireToken,
  createUserToken,
};
```

let's create a `JWT_SECRET` environment variable to store in it

```
JWT_SECRET=some string value only your app knows
```

### Add the Signin Controller

Now that we have a way to create a token for users when they login, we can add the logic to our `/signin` route.

1. Open the `controllers/users.js` file.
1. Use destructuring to require `createUserToken` from the auth file:

```js
const { createUserToken } = require('../middleware/auth');
```

3. Update the `/signin` route as follows:

```js
// SIGN IN
// POST /api/signin
router.post('/signin', (req, res, next) => {
  User.findOne({ email: req.body.email })
    // Pass the user and the request to createUserToken
    .then((user) => createUserToken(req, user))
    // createUserToken will either throw an error that
    // will be caught by our error handler or send back
    // a token that we'll in turn send to the client.
    .then((token) => res.json({ token }))
    .catch(next);
});
```

Go test signing up in Postman!!! Use a POST request that has a body containing an JSON object with an email and hashed password (copy it from what you got back when you signed up). You should now see a response that looks like:

```js
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVlNGQ4NWE0ODE4ODVhM2Q4ZjE5NTNhNSIsImlhdCI6MTU4MjIwMjAyNSwiZXhwIjoxNTgyMjM4MDI1fQ.OgmgQQ_yRyAKZlqGSglrFRjpbEwB5CnKj3HxyhznTss"
}
```

We're so close to done now! All that's left is to set up our job route to use the token! Add and commit your changes.

## Add Authorization

Along with authenticating the user, we now have to handle user authorization. What's the difference? When the user logs into the system successfully, we _authenticate_ them based on the credentials they send (such as a proper combination of email and password). Authorization means determining whether the user is actually authorized to perform some action in the system.

With the token, we can determine which user is making a request. With that information, we can determine if the specific user making the request is _authorized_ to carry out a specific action, such as create documents or delete or update a specific document.

To add this functionality, we have to change up the update and delete methods that we're using because we want to test that the user is allowed to update/delete the record before we carry out that operation. So, we'll use the `findById` method, check the that user is authorized for that document, then we'll separately do the delete or update.

1. Update the handleValidateId function in `middleware/error_handler.js` as follows:

```js
const handleValidateOwnership = (req, document) => {
  const ownerId = document.owner._id || document.owner;
  // Check if the current user is also the owner of the document
  if (!req.user._id.equals(ownerId)) {
    throw new OwnershipError();
  } else {
    return document;
  }
};
```

2. Open the `controllers/jobs.js`.
3. Add `handleValidateOwnership` to the destructured require statement for error handlers and include the `requireToken` from auth.

```js
const {
  handleValidateId,
  handleRecordExists,
  handleValidateOwnership,
} = require('../middleware/custom_errors');
const { requireToken } = require('../middleware/auth');
```

4. Update the POST, PUT and DELETE routes as follows:

```js
// CREATE
// POST api/jobs
router.post('/', requireToken, (req, res, next) => {
  Job.create({ ...req.body, owner: req.user._id })
    .then((job) => res.status(201).json(job))
    .catch(next);
});

// UPDATE
// PUT api/jobs/5a7db6c74d55bc51bdf39793
router.put('/:id', handleValidateId, requireToken, (req, res, next) => {
  Job.findById(req.params.id)
    .then(handleRecordExists)
    .then((job) => handleValidateOwnership(req, job))
    .then((job) => job.set(req.body).save())
    .then((job) => {
      res.json(job);
    })
    .catch(next);
});

// DESTROY
// DELETE api/jobs/5a7db6c74d55bc51bdf39793
router.delete('/:id', handleValidateId, requireToken, (req, res, next) => {
  Job.findById(req.params.id)
    .then(handleRecordExists)
    .then((job) => handleValidateOwnership(req, job))
    .then((job) => job.remove())
    .then(() => {
      res.sendStatus(204);
    })
    .catch(next);
});
```

Phew... that was a lot! All that's left now is to add the sign out feature.

## Setup Postman to Run Tests Sequentially

Postman actually contains a ton of helpful features for running API tests. One feature that can be particularly helpful is the ability to set up an environment for your API that stores variables. Even better, we can automatically update the variables when we receive a response from the server. This is especially helpful when you're dealing with requests that are dependent upon data other requests. For example, we now have to set that long-ass token into the Authorization header of everyone of our POST, DELETE and PUT routes for our job resource, and since the token expires after some time, we’ll have to do it regularly.

### Create Environment Variables

1. Open Postman.
1. Click on the gear icon (:gear:) on the top right side of the window just below the taskbar.
1. When the Manage Environments modal appears, click the orange Add button at the bottom of the modal.
1. Give your environment a descriptive name such as **Job Board API**.
1. For the first variable, name it `url` and set the **initial value** and **current value** column to: `http://localhost:8000/api`.

1. Add a second variable named `id` and set its initial value to an empty string (`''`).
1. Add a third variable named `token` and also set its initial value to an empty string (`''`).
1. Click the orange Add button on this screen and then close the modal by clicking the x in the upper right corner.
1. In the environments dropdown selection list choose your new **Job Board API** environment.

### Add Test Script to the Signin Request

Now you can update your `/signin` request in Postman. Instead of manually having to copy and paste the token to each of our resource request in Postman, we can have Postman automatically run some code when the response to our signin request is received and set the token in the variable we created.

1. Open the signin request you created earlier in Postman.
1. In the toolbar below the request URL input field, click the **Tests** tab and add the following code:

```js
var data = pm.response.json();
pm.environment.set('token', data.token);
```

Click the blue Send button and then click the eyeball icon next to the environments dropdown. You should now see the **token** variable is set. :tada:

### Set the Authorization Header in the Jobs Post Request

With the token stored in a variable, it’s easy for us to add it to our authenticated requests.

1. Open the request you created for the post to the `/jobs` route.
1. In the toolbar below the request URL input field, click the **Headers** tab.
1. Add a header with `Authorization` set for the key and `Bearer {{token}}` set for the value.
1. Back in the toolbar, click the **Tests** tab and add the following code:

```js
var data = pm.response.json();
pm.environment.set('id', data._id);
```

Make sure youʼve still got JSON data set in the **Body** tab and click the blue Send button. Assuming that all went well, you should see the newly created job in the response window. You'll also have an id for the newly created job that you can easily use in your DELETE and PUT requests by changing the url on the requests to: `{{url}}/jobs/{{id}}`... How awesome is that!

## Handle Authentication in React

In terms of making the Fetch or Axios requests to the API in React, you'll now have to add the `Authorization` header to authenticated requests, such as:

```js
axios({
  url: `${APIURL}/jobs`
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${props.token}`
  },
  data: job
});

/*** ALTERNATIVELY USING FETCH ***/

fetch(`${APIURL}/jobs`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${props.token}`
  },
  body: JSON.stringify(job)
});
```

One approach to handling the token is to use React's built in Context API to store the value when it is returned after the user logs in. [Storing the user and accessing via useContext Hook](https://www.youtube.com/watch?v=lhMKvyLRWo0) is easier than passing around the token via props and eliminates prop drilling entirely.

Alternatively, you can create state to hold your user in the App.js, along with a method to set the user state and pass that as a prop to your signin form's `handleSubmit` method. When the AJAX call to your server is successful and you get the token back from the API, you can call the method that sets the token in state in App. Now you can pass the token to all of the components that need it as props.

There are also third party state management tools that could be used to store the token. They range from very basic ([`react-hooks-global-state`](https://www.npmjs.com/package/use-global-state)) to complex ([Redux](https://redux.js.org/)).

## Test Authenticated Routes

To write tests for authenticated routes, you'll need to use the [before or beforeEach hooks](https://mochajs.org/#hooks) in Mocha to generate a user token. You may find that using the async/await syntax is more straightforward here than using promise chains, but both will work. You can also use superagent as described in this [article](https://codeburst.io/authenticated-testing-with-mocha-and-chai-7277c47020b7).

---

Adapted from https://git.generalassemb.ly/jmeade11/mern-auth-tutorial
