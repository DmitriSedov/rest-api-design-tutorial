const express = require( "express" );
const router = express.Router();
// route handlers
const { handleRoot } = require( "./handlers/rootHandler" );
const { authenticate } = require( "./handlers/authHandler" );
const { getUserProfile } = require( "./handlers/userHandlers" );
const noteHandlers = require( "./handlers/noteHandlers" );
// middlewares
const verifyToken = require( "./middlewares/auth" );
const validateNote = require( "./middlewares/noteValidation" );

// root endpoint
router.get( "/", handleRoot );

// auth endpoint
router.post( "/auth", authenticate );

// singleton user endpoint. Good example for Caching.
router.get( "/users/:id", verifyToken, getUserProfile );

// notes or collection endpoints
router.get( "/notes", verifyToken, noteHandlers.getNotes );
router.post( "/notes", verifyToken, noteHandlers.createNote );

// singleton `note` endpoints
router.get( "/notes/:id", verifyToken, validateNote, noteHandlers.getNote );
router.put( "/notes/:id", verifyToken, validateNote, noteHandlers.updateNote );
router.patch( "/notes/:id", verifyToken, validateNote, noteHandlers.editText );
router.delete( "/notes/:id", verifyToken, validateNote, noteHandlers.deleteNote );

// `PUT` is typically not used with collection resources, 
// unless you want to replace the entire collection. 
// which is why we'll treat this as an invalid route.
router.put( "/notes", verifyToken, noteHandlers.handleInvalidRoute );

module.exports = router;