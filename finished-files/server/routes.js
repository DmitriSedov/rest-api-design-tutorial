const express = require( "express" );
const router = express.Router();
const { handleRoot } = require( "./handlers/rootHandler" );
const { authenticate } = require( "./handlers/authHandler" );
const { getUserProfile } = require( "./handlers/usersHandler" );
const notesHandler = require( "./handlers/notesHandler" );
const verifyToken = require( "./middlewares/auth" );
const validateNote = require( "./middlewares/noteValidation" );

// root
router.get( "/", handleRoot );

// /auth
router.post( "/auth", authenticate );

// users/:id
router.get( "/users/:id", verifyToken, getUserProfile );

// /notes
router.get( "/notes", verifyToken, notesHandler.getNotes );
router.post( "/notes", verifyToken, notesHandler.createNote );

// /notes/:id
router.get( "/notes/:id", [ verifyToken, validateNote ], notesHandler.getNoteById );
router.put( "/notes/:id", [ verifyToken, validateNote ], notesHandler.updateNote );
router.patch( "/notes/:id", [ verifyToken, validateNote ], notesHandler.editText );
router.delete( "/notes/:id", [ verifyToken, validateNote ], notesHandler.deleteNote );

// invalid route example
router.post( "/notes/:id", verifyToken, notesHandler.handlePostToNote );

module.exports = router;