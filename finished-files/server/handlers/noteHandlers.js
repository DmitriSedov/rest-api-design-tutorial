const notesCtrl = require( "../controllers/notesController" );
const { getUserById } = require( "../controllers/usersController" );
const { hateoasify } = require( "../controllers/hateoasController" );

exports.getNotes = ( req, res ) => {
  // get all info about the user
  const user = getUserById( res.locals.user.sub );

  // initialize query-string params for filtering, searching, sorting and pagination
  const qs = {
    q: req.query.q || "",
    limit: req.query.limit || 2,
    page: req.query.page || 1,
    sort: req.query.sort || "updatedAt",
    order: req.query.order || "asc"
  };

  // validate query-string params
  if( isNaN( qs.limit ) || isNaN( qs.page ) || qs.limit < 0 || qs.page < 0 || ![ "updatedAt", "createdAt" ].includes( qs.sort ) || ![ "asc", "desc" ].includes( qs.order )) {
    return res.status( 400 ).json({ "message": "Invalid request" });
  }

  let responseNotes = notesCtrl.getNotesByIds( user.notes );
  // filter notes by performing a text search
  responseNotes = notesCtrl.filterNotes( responseNotes, qs.q );
  // sort on the "createdAt" or "updatedAt" fields in either "asc" or "desc" order
  responseNotes = notesCtrl.sortNotes( responseNotes, qs.sort, qs.order );

  // add links for HATEOAS and return the response JSON
  res.json( hateoasify( responseNotes, qs ) );
}

exports.getNote = ( req, res ) => {
  // add HATEOAS links to the response along with the note object. 
  // Use the `res.locals` object to get note provided by the `noteValidation` middleware.
  res.json( hateoasify( res.locals.note ));
}

exports.createNote = ( req, res ) => {
  // throw 400 Bad Request if the format of the request is invalid
  if( !( "text" in req.body ) ) {
    return res.status( 400 ).json({ "message": "Invalid request" });
  }
  const { text } = req.body;

  const newNote = notesCtrl.createNote( res.locals.user.sub, text );

  // send success response to the client
  const newNoteURI = `/notes/${newNote.id}`;
  res.setHeader( "Location", newNoteURI );
  res.status( 201 ).json( hateoasify( newNote ));
}

exports.updateNote = ( req, res ) => {
  // validate whether the request body contains all the properties inside a note object i.e. `id`, `text`, `createdAt`, `updatedAt`.
  // if it doesn't then PUT will replace the existing note object with the new one without the missing properties.
  if( !(( "id" in req.body ) && ( "text" in req.body ) && ( "createdAt" in req.body ) && ( "updatedAt" in req.body )) ) {
    return res.status( 400 ).json({ "message": "Invalid request" });
  }

  // update the note in `notes`
  const { id, text, createdAt, updatedAt } = req.body;
  notesCtrl.updateNote( id, text, createdAt, updatedAt );

  // send success response to the client
  res.status( 204 ).send();
}

exports.editText = ( req, res ) => {
  // throw 400 Bad Request if `text` is not provided in the request payload.
  if( !( "text" in req.body ) ) {
    return res.status( 400 ).json({ "message": "Invalid request" });
  }

  // everything seems fine, let's update the note text.
  notesCtrl.editText( res.locals.note, req.body.text );

  // send success response to the client. No response body required.
  res.status( 204 ).send();
}

exports.deleteNote = ( req, res ) => {
  // delete the note from the database
  notesCtrl.deleteNote( res.locals.user.sub, res.locals.note );

  // send success response to the client
  res.status( 204 ).send();
}

exports.handleInvalidRoute = ( req, res ) => {
  // set `Allow` header to indicate which HTTP methods are allowed for this resource
  res.setHeader( "Allow", "GET, POST" );

  // return `405 Method Not Allowed`
  res.status( 405 ).send();
}