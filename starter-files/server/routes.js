const express = require( "express" );
const router = express.Router();
// import handlers
const { handleRoot } = require( "./handlers/rootHandler" );
const { authenticate } = require( "./handlers/authHandler" );
const { getUserProfile } = require( "./handlers/usersHandler" );

// root endpoint
router.get( "/", handleRoot );

router.post( "/auth", authenticate );

// We don't have routes for creating, updating or deleting users since those endpoints are covered for the `notes` resource.
// This sole `users` resource endpoint serves as a good example for Caching.
router.get( "/users/:id", getUserProfile );

// notes or collection endpoints
router.get( "/notes", notesHandler.getNotes );
router.post( "/notes", notesHandler.createNote );

// singleton `note` endpoints
router.get( "/notes/:id", notesHandler.getNoteById );
router.put( "/notes/:id", notesHandler.updateNote );
router.patch( "/notes/:id", notesHandler.editText );
router.delete( "/notes/:id", notesHandler.deleteNote );

// invalid route example
router.post( "/notes/:id", notesHandler.handlePostToNote );

module.exports = router;