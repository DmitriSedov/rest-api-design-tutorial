const express = require( "express" ),
  app = express(),
  routes = require( "./routes.js" );

// load environment variables
require('dotenv').config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use( "/", routes );

app.listen( process.env.PORT, () => console.log( `Listening on port ${process.env.PORT}` ) );