const notesCtrl = require( "../controllers/notesController" );
const { getUserById } = require( "../controllers/usersController" );
const { hateoasify } = require( "../controllers/hateoasController" );
const { paginate } = require( "../controllers/paginationController" );

exports.getNotes = ( req, res ) => {
  // get all info about the user
  const user = getUserById( res.locals.user.sub );

  // Initialize params for filtering, searching, sorting and pagination.
  // This makes sure that we set defaults if these are not included in the URI.
  const params = {
    q: req.query.q || "",
    limit: req.query.limit || 2,
    page: req.query.page || 1,
    sort: req.query.sort || "updatedAt",
    order: req.query.order || "asc"
  };

  // validate query-string params
  if( isNaN( params.limit ) || isNaN( params.page ) || params.limit < 0 || params.page < 0 || ![ "updatedAt", "createdAt" ].includes( params.sort ) || ![ "asc", "desc" ].includes( params.order )) {
    return res.status( 400 ).json({ "message": "Invalid request" });
  }

  // get array of note objects from the array of note IDs
  let responseNotes = notesCtrl.getNotesByIds( user.notes );

  // filter notes by performing a text search
  responseNotes = notesCtrl.filterNotes( responseNotes, params.q );

  // paginate the results so that only results in the 
  // current page are included in the response
  const paginationInfo = paginate( responseNotes, params.page, params.limit  );
  responseNotes = paginationInfo.paginatedResults;
  params.lastPage = paginationInfo.lastPage;

  // sort on the "createdAt" or "updatedAt" fields in either "asc" or "desc" order
  responseNotes = notesCtrl.sortNotes( responseNotes, params.sort, params.order );

  // add links for HATEOAS and return the response JSON
  res.json( hateoasify( responseNotes, params ) );
}

exports.getNote = ( req, res ) => {
  // Use the `res.locals` object to get the note provided by the 
  // `noteValidation` middleware. Add HATEOAS links to the response 
  // along with the note object. 
  res.json( hateoasify( res.locals.note ));
}

exports.createNote = ( req, res ) => {
  // ExpressJS extracts the note's `text` from the request body and stores 
  // it in `req.body`. If no `text` is provided, return `400 Bad Request`.
  if( !( "text" in req.body ) ) {
    return res.status( 400 ).json({ "message": "Invalid request" });
  }
  const { text } = req.body;

  // create the new note
  // The auth middleware stores the authenticated user info in `res.locals.user`. 
  const newNote = notesCtrl.createNote( res.locals.user.sub, text );

  // Add the new note URI in the `Location` header as per convention
  const newNoteURI = `/notes/${ newNote.id }`;
  res.setHeader( "Location", newNoteURI );
  // send success response to the client with status code `201 Created`.
  // Also include the new note object in the response payload.
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
  // The noteValidation middleware stores the current note in `res.locals.note`.
  notesCtrl.editText( res.locals.note, req.body.text );

  // send success response to the client. No response body required.
  res.status( 204 ).send();
}

exports.deleteNote = ( req, res ) => {
  // delete the note from the database
  // The auth middleware stores the authenticated user info in `res.locals.user`. 
  // The noteValidation middleware stores the current note in `res.locals.note`.
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