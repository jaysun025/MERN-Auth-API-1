// Require Mongoose so we can use it later in our handlers
const mongoose = require('mongoose');

const handleErrors = (err, req, res, next) => {
    // If the error contains a status code, set the 
    // set the variable to that code
    // if not, set it to a default 500 code
    const statusCode = err.statusCode || 500
    // If the error constains a message, set the variable to that message
    // if not, set it to a generic 'Internal Server Error'
    const message = err.message || 'Internal Server Error'
    // Set the status and send the message as a response to the client
    res.status(statusCode).send(message)
}

module.exports = { handleErrors }
