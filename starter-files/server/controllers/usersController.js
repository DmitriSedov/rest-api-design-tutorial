let data = require( "../data/data" );

/*
 * Returns the full user object from `data.users` where the user ID matches the input ID.
 */
exports.getUserById = id => data.users.find( user => user.id == id );

/*
 * Returns a boolean value indicating whether the input `user` has access to a note represented by the input note ID.
 */
exports.canUserAccessNote = ( user, noteId ) => user.notes.find( userNoteId => userNoteId == noteId );

/*
 * Returns the full user object from `data.users` where the user's email and password matches the inputs.
 * Normally the password will be hashed before the comparison.
 * But we are storing the password directly without hashing for convenience while testing and for minimizing implementation details.
 */
exports.getUserByCredentials = ( email, password ) => data.users.find( user => user.email == email && user.password == password );

/*
 * Associates a note with a user by adding the input note ID into the `notes` array within `data.users`.
 */
exports.addUserNote = ( userId, noteId ) => {
  // get all the info about the user by the `userId`.
  const user = this.getUserById( userId );
  // add the note ID in the `notes` array within `data.users` in an immutable way.
  user.notes = [ ...user.notes, noteId ];
}

/*
 * Removes the association between a note and the user.
 */
exports.removeNote = ( userId, noteId ) => {
  // get all the info about the user by the `userId`.
  const user = this.getUserById( userId );
  // filter the `user.notes` array and exclude the note with the ID `noteId`.
  // this will remove the note's ID from the `notes` array within `data.users`.
  user.notes = user.notes.filter( nId => nId != noteId );
}