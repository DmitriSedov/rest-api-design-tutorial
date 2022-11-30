const express = require( "express" );
const router = express.Router();
// import handlers
const { handleRoot } = require( "./handlers/rootHandler" );
const { authenticate } = require( "./handlers/authHandler" );
const { getUserProfile } = require( "./handlers/usersHandler" );
// import middlewares
const notesHandler = require( "./handlers/notesHandler" );
const verifyToken = require( "./middlewares/auth" );
const validateNote = require( "./middlewares/noteValidation" );

// root endpoint
router.get( "/", handleRoot );

router.post( "/auth", authenticate );

// We don't have routes for creating, updating or deleting users since those endpoints are covered for the `notes` resource.
// This sole `users` resource endpoint serves as a good example for Caching.
router.get( "/users/:id", verifyToken, getUserProfile );

// notes or collection endpoints
router.get( "/notes", verifyToken, notesHandler.getNotes );
router.post( "/notes", verifyToken, notesHandler.createNote );

// singleton `note` endpoints
router.get( "/notes/:id", [ verifyToken, validateNote ], notesHandler.getNoteById );
router.put( "/notes/:id", [ verifyToken, validateNote ], notesHandler.updateNote );
router.patch( "/notes/:id", [ verifyToken, validateNote ], notesHandler.editText );
router.delete( "/notes/:id", [ verifyToken, validateNote ], notesHandler.deleteNote );

// invalid route example
router.post( "/notes/:id", verifyToken, notesHandler.handlePostToNote );

module.exports = router;