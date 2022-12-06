const express = require( "express" );
const router = express.Router();
// route handlers
const { handleRoot } = require( "./handlers/rootHandler" );
const noteHandlers = require( "./handlers/noteHandlers" );

// root endpoint
router.get( "/", handleRoot );

// notes or collection endpoints
router.get( "/notes", noteHandlers.getNotes );
router.post( "/notes", noteHandlers.createNote );

// singleton `note` endpoints
router.get( "/notes/:id", noteHandlers.getNote );
router.put( "/notes/:id", noteHandlers.updateNote );
router.patch( "/notes/:id", noteHandlers.editText );
router.delete( "/notes/:id", noteHandlers.deleteNote );

// `PUT` is typically not used with collection resources(unless you want to replace the entire collection). 
// which is why we'll treat this as an invalid route.
router.put( "/notes", noteHandlers.handleInvalidRoute );

module.exports = router;