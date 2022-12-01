const express = require( "express" );
const router = express.Router();
// route handlers
const { handleRoot } = require( "./handlers/rootHandler" );
const notesHandler = require( "./handlers/notesHandler" );

// root endpoint
router.get( "/", handleRoot );

// notes or collection endpoints
router.get( "/notes", notesHandler.getNotes );
router.post( "/notes", notesHandler.createNote );

// singleton `note` endpoints
router.get( "/notes/:id", notesHandler.getNoteById );
router.put( "/notes/:id", notesHandler.updateNote );
router.patch( "/notes/:id", notesHandler.editText );
router.delete( "/notes/:id", notesHandler.deleteNote );

// `PUT` is typically not used with collection resources(unless you want to replace the entire collection). 
// which is why we'll treat this as an invalid route.
router.put( "/notes", notesHandler.handleInvalidRoute );

module.exports = router;