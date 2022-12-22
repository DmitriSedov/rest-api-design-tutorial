const usersCtrl = require( "../controllers/usersController" );
const notesCtrl = require( "../controllers/notesController" );

/*
  This middleware function will perform some common validation steps 
  for single "note" resources such as 
  - Making sure the note exists else throw `404 Not Found`.
  - Making sure user has access to the note else throw `404 Not Found`.

  If all is well, then it will store the entire note object in `res.locals`
  and make it available for future middlewares.
*/
module.exports = function validateNote( req, res, next ) {
  /*
    Get all the info about the user.
    Use the `res.locals.user` object to obtain the authenticated 
    and decoded payload from the auth middleware.
    The payload format is: { "sub": 12345, "name": "John Doe" }
  */
  const userId = res.locals.user.sub,
    user = usersCtrl.getUserById( userId );
  
  // find the note with the input note ID in the database.
  // if the note does not exist, `undefined` will be returned.
  const note = notesCtrl.getNoteById( req.params.id ),
    noteExists = typeof note !== "undefined";

  // the user maybe authenticated but check whether the user 
  // is authorized to access this note.
  const isAuthorized = usersCtrl.canUserAccessNote( user, req.params.id );

  /*
    If the note does not exist or the user is not authorized to access the note, 
    then throw `404 Not Found`.
    Why throw a 404 if the note exists but user is not authorized to access it? 
    Because we want to maintain secrecy for protected resources. 
    If the user is not authorized to access a resource, then for all intents 
    and purposes, that resource doesn't exist for that user.
  */  
  if( !noteExists || !isAuthorized ) {
    res.status( 404 ).json({ 
      "message": `Note with ID '${ req.params.id }' does not exist.` 
    });
    return;
  }

  // if validation is successful, store the note for future use 
  // in `res.locals.note` and call the next middleware.
  res.locals.note = note;

  // invokes the next middleware
  next();
}