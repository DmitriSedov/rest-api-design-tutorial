const express = require( "express" ),
  app = express(),
  data = require( "./data" );

// parse raw requests into a property on the `request` object that we can use.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Since this is just a demo, declare environment and config variables as constants
const PORT = 3002;
  API_SERVER_URL = "http://localhost:3001/";

/*
  Since this is just a demo, the API only handles the root endpoint.
  It returns an array of "notes" from `data.js`.
*/
app.get( "/", ( req, res ) => {
  // The request can only originate from the API server,
  // so verify that the value of the `Origin` header is set to the API server domain
  // otherwise throw a `403 Access Forbidden` message.
  if( req.get( "Origin" ) !== API_SERVER_URL ) {
    return res.status( 403 ).json({ "message": "Access forbidden." });
  }
  
  // return data...in this case, an array of "notes"
  res.json( data.notes );
});

// Start the DB server!
app.listen( PORT, () => console.log( `👂 DB server listening on port ${ PORT }` ) );