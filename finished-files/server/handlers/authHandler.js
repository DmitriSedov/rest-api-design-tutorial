const jwt = require( "jsonwebtoken" );
const usersCtrl = require( "../controllers/usersController" );

/**
 * This is the route handler for the `/auth` route.
 * Accepts the user's email and password as inputs.
 * Upon successful validation, returns a JWT token in the response header. The encrypted token payload contains the user's ID and name.
 * Also included in the response is a `links` array for the next steps that the client can take like "add a new note" or "fetch all notes for this user".
 */
exports.authenticate = ( req, res ) => {
  // throw `400 Bad Request` if either "email" or "password" is not provided.
  if( !( "email" in req.body && "password" in req.body ) ) {
    return res.status( 400 ).json({ "message": "Invalid request" });
  }

  const { email, password } = req.body;

  // check whether a user with this email exists.
  // normally the password will be hashed before the comparison.
  // but we are storing the password directly without hashing for convenience while testing and for minimizing implementation details.
  const user = usersCtrl.getUserByCredentials( email, password );
  if( !user ) {
    return res.status( 401 ).json({ "message": "Invalid credentials" });
  }

  // Use the private key to sign payload and generate the JWT.
  // DO NOT INCLUDE any sensitive information in the payload.
  // Only include some basic info that can identify the user.
  const token = jwt.sign({ sub: user.id, name: user.name }, process.env.TN_JWT_PRIVATE_KEY);
  // Configure a custom header in the response with the token value.
  res.setHeader( "X-Access-Token", token );

  // HATEOAS links
  const links = [
    { "rel": "self", "href": "/auth", "method": "POST" },
    { "rel": "notes", "href": "/notes", "method": "GET" },
    { "rel": "add-note", "href": "/notes", "method": "POST" }
  ]

  res.json({ message: "Authentication successful", user: { id: user.id, name: user.name, email: user.email }, links });
}