const jwt = require( "jsonwebtoken" );

/*
  This middleware function reads the token value from the `Authorization` header and verifies it.
  It attaches the token payload into the request object and passes it on to middlewares further up the chain.   
*/
module.exports = function verifyToken( req, res, next ) {
  // read the `Authorization` header. If not provided, return a `401 Not Authorized`.
  const authHeader = req.header( "Authorization" );
  if( !authHeader ) {
    return res.status(401).send("Access denied. No token provided");
  }

  // The value will be in the format, `Bearer <token value>`.
  // Parse the token value by removing the text "Bearer ".
  const token = authHeader.replace( "Bearer ", "" );
  try {  

    // verify the token
    const decodedPayload = jwt.verify( token, process.env.TN_JWT_PRIVATE_KEY );
    
    // In ExpressJS, the `res.locals` object is used to store/expose information that is valid throughout the lifecycle of the request.
    // It is ideal for transferring information between middlewares.
    // So we'll store the decoded payload in `res.locals.user` so that it can be used by middlewares further up the chain.
    res.locals.user = decodedPayload;

    // call the next middleware
    next();

  } catch( err ){
    
    // if the token cannot be decoded, send `400 Bad Request` error.
    return res.status(400).send("Access denied. Invalid token.");
    
  }
}