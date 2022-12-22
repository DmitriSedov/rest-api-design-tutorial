const express = require( "express" ),
  app = express(),
  cors = require( "cors" ),
  routes = require( "./routes.js" );

// load environment variables
require('dotenv').config();

// parse raw requests into a property on the `request` object that we can use.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// enable CORS for easily testing API endpoints 
// via `fetch()` directly from the browser's Console window
app.use( cors() );

// handle our routes
app.use( "/", routes );

// generic error handler
app.use((err, req, res, next) => {
  console.error( err );
  res.status( 500 ).json({ "message": "Uh oh! Something went wrong.😑", "error_message": err.message });
});

// Start the server!
app.listen( process.env.PORT, () => console.log( `👂 Listening on port ${ process.env.PORT }` ) );