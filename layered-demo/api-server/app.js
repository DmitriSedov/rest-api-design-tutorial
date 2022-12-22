const express = require( "express" ),
  app = express(),
  superagent = require( "superagent" );

// parse raw requests into a property on the `request` object that we can use.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Since this is just a demo, declare environment and config variables as constants
const PORT = 3001,
  AUTH_SERVER_URL = `http://localhost:3000/`,
  API_SERVER_URL = `http://localhost:${ PORT }/`,
  DB_SERVER_URL = "http://localhost:3002/";

/*
  Since this is just a demo, the API only handles the root endpoint.
*/
app.get( "/", async ( req, res ) => {
  // The request can only originate from the auth server,
  // so verify that the value of the `Origin` header is set to the auth server domain
  // otherwise throw a `403 Access Forbidden` message.
  if( req.get( "Origin" ) !== AUTH_SERVER_URL ) {
    return res.status( 403 ).json({ "message": "Access forbidden." });
  }

  // Get the data from the DB server. 
  const responseFromDB = await superagent
    .get( DB_SERVER_URL )
    .set( "Origin", API_SERVER_URL )
    .catch( response => {
      console.log( response );
      res.status( 500 ).json({ "message": "Uh oh! Something went wrong." })
    } );

  // return the data from the DB server to the auth server.
  res.send( responseFromDB.text );
});

// Start the API server!
app.listen( PORT, () => console.log( `👂 API server listening on port ${ PORT }` ) );