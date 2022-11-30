const express = require( "express" ),
  app = express(),
  routes = require( "./routes.js" );

// load environment variables
require('dotenv').config();

// parse raw requests into a property on the `request` object that we can use.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// handle our routes
app.use( "/", routes );

// Launch the app!
app.listen( process.env.PORT, () => console.log( `Listening on port ${process.env.PORT}` ) );