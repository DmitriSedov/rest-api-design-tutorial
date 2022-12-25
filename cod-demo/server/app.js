const express = require( "express" ),
  app = express(),
  cors = require( "cors" );

// Since this is just a demo, declare environment and config variables as constants
const PORT = 3000;

// parse raw requests into a property on the `request` object that we can use.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// enable CORS for convenience while testing API endpoints
app.use( cors() );

// Since this is just a demo, the API only handles the root endpoint.
app.get( "/", ( req, res ) => {
  // return some executable JS code in the API response
  res.setHeader( "Content-Type", "text/javascript" );
  res.send( "alert( 'Namaste World!🙏. The JS code behind this alert was sent by the API server and then executed by your browser.' )" );
});

// Start the API server!
app.listen( PORT, () => console.log( `👂 API server listening on port ${ PORT }` ) );