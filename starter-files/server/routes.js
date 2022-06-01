const express = require( "express" );
const router = express.Router();

// START here by replacing this line with your own code
router.get( "/", ( req, res ) => res.send( "Hello World" ));

module.exports = router;