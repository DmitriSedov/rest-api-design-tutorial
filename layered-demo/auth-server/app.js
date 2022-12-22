const express = require( "express" ),
  app = express(),
  superagent = require( "superagent" );

// parse raw requests into a property on the `request` object that we can use.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Since this is just a demo, declare environment and config variables as constants
const PORT = 3000,
  AUTH_SERVER_URL = `http://localhost:${ PORT }/`,
  API_SERVER_URL = "http://localhost:3001/",
  API_KEY = "MY_API_KEY_1234";

/*
  Since this is just a demo, we'll only define the root route on the AUTH server.
  This route should capture all incoming requests irrespective of the resources 
  being accessed which is why the route name is specified as "*".
  This route handler will check whether the incoming request carries a "valid" API KEY or not.
  If it doesn't, we'll throw a `401 Not Authorized`.
  Else, we'll forward the request to the API server and forward the response from the API server to the client.
*/
app.get( "*", async ( req, res ) => {
  // if `Authorization` header is not set, throw `401 Not Authorized`.
  const authHeader = req.header( "Authorization" );
  if( !authHeader ) {
    return res.status( 401 ).json({ "message": "Access denied. No API KEY provided." });
  }

  // if `Authorization` header does not carry a valid API KEY, throw `401 Not Authorized`.
  const apiKey = authHeader.replace("Bearer ","");
  if( apiKey !== API_KEY ) {
    return res.status( 401 ).json({ "message": "Access denied. Invalid API KEY." });
  }

  // forward the request to the API server. 
  // Ideally, we'd attach the resource URI from the current auth server request to the below URI of the API server.
  // But again we don't want to complicate things and simply demonstrate an architecture for layered systems.
  // So simply forward the request to the root resource on the API server.
  const responseFromAPI = await superagent
    .get( API_SERVER_URL )
    .set( "Origin", AUTH_SERVER_URL )
    .catch( response => {
      console.log( response );
      res.status( 500 ).json({ "message": "Uh oh! Something went wrong." })
    } );

  // forward the response from the API server to the client.
  res.send( responseFromAPI.text );
});

// Start the auth server!
app.listen( PORT, () => console.log( `👂 Auth server listening on port ${ PORT }` ) );