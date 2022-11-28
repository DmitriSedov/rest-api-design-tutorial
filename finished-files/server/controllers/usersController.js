let data = require( "../data/data" );

exports.getUserById = id => data.users.find( user => user.id == id );

exports.canUserAccessNote = ( user, noteId ) => user.notes.find( userNoteId => userNoteId == noteId );

exports.getUserByCredentials = ( email, password ) => data.users.find( user => user.email == email && user.password == password );

exports.addUserNote = ( userId, noteId ) => {
  // get all the info about the user and add `noteId` to `user.notes` array.
  const user = this.getUserById( userId )
  user.notes = [ ...user.notes, noteId ];
}

exports.removeNote = ( userId, noteId ) => {
  // get the full user object from the input `userId`.
  const user = this.getUserById( userId );
  // filter the `user.notes` array and exclude the note with the ID `noteId`.
  // this will remove the note's ID from the `user.notes` array.
  user.notes = user.notes.filter( nId => nId != noteId );
}