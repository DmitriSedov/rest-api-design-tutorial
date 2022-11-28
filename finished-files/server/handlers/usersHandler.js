let data = require( "../data/data" );
const crypto = require( 'crypto' );

/*
  - This method handles the "/users/:id" route. 
  - It returns additional user profile information using the basic user identifiers obtained from JWT payload.
  - Since user profile data like name and email rarely change, this method uses HTTP Caching to cache the user profile data.
  - Cache expiration is managed using the `Cache-Control` directive.
  - `ETag` and `Last-Modified` headers handle cache-invalidation.
*/
exports.getUserProfile = ( req, res ) => {
  // get additional user information from basic user identifiers in JWT payload
  const { id, name, email, createdAt, updatedAt } = data.users.find( user => user.id == req.user.sub );
  // construct the raw response
  const response = { id, name, email, createdAt };

  // generate ETag from fresh data and set the ETag header.
  const freshETag = crypto.createHash( 'md5' ).update( JSON.stringify( response ) ).digest( 'hex' );
  res.setHeader( "ETag", `"${ freshETag }"` );

  // Set the `Cache-Control` header.
  // `private` means private caches like browsers will cache this data but public caches will not.
  // `no-cache` will mandate that caches validate the cached data before using it.
  // `max-age`, in this case, sets the cache to expire after 1 year.
  // `must-revalidate` means caches must not use stale data in caches without validating it first.
  res.setHeader( "Cache-Control","private, no-cache, max-age=31536000, must-revalidate" );
  // Use the `updatedAt` timestamp as the value for the `Last-Modified` header.
  res.setHeader( "Last-Modified", new Date( updatedAt ).toUTCString() );

  // check whether the `If-None-Match` header sent by the client in the request matches the `ETag` value we generated above with fresh data.
  const etagValidationIsSuccessful = req.header( "If-None-Match" ) && `"${freshETag}"` == req.header( "If-None-Match" ),
    // check whether the `If-Modified-Since` header sent by the client in the request matches the `updatedAt` timestamp.
    lastModValidationIsSuccessful = req.header( "If-Modified-Since" ) && new Date( updatedAt ).toUTCString() == req.header( "If-Modified-Since" );
  
  // if the validation is successful, then return a `304 Not Modified` header without any payload.
  if( etagValidationIsSuccessful || lastModValidationIsSuccessful ) {
    return res.status( 304 ).send();
  }
  
  // if the validation is not successful, then send the whole payload in the response.
  res.json( response ); 
}