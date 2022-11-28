let data = require( "../data/data" );
const { v4: uuidv4 } = require( "uuid" );
const usersCtrl = require( "./usersController" );

/*
Accepts an array of note IDs and returns an array of corresponding note objects.
*/
exports.getNotesByIds = ( noteIds, returnPartialRep=true ) => {
  // loop over each noteId
  return noteIds.map( noteId => {
    // get the corresponding note object from the database.
    // Will be "undefined" if not found.
    const note = data.notes.find( note => note.id == noteId );
    if( typeof note == "undefined" || !returnPartialRep ) {
      // return the "note" object if it is "undefined" or if we need to return the complete representation.
      return note;
    } else {
      // Exclude the createdAt property to return a partial/compact representation for collections.
      const { createdAt, ...partialNote } = note;
      return partialNote;
    }
  });
}

exports.getNoteById = id => data.notes.find( note => note.id == id );

exports.filterNotes = ( notes, textToSearch ) => {
  return textToSearch == ""
    ? notes
    : user.notes.filter( note => note.text.toLowerCase().includes( textToSearch.toLowerCase() ));
}

exports.sortNotes = ( notes, sort, order ) => {
  return notes.sort(( note1, note2 ) => {
    if( order == "desc" ) {
      return note2[ sort ] - note1[ sort ];
    } else {
      return note1[ sort ] - note2[ sort ];
    }
  });
}

exports.createNote = ( userId, text ) => {
  // create the new note
  const newNote = {
    "id": uuidv4(),
    text,
    "createdAt": Date.now(),
    "updatedAt": Date.now()
  };

  // add the new note to the database
  data.notes = [ ...data.notes, newNote ];

  // associate the note with the authorized user
  usersCtrl.addUserNote( userId, newNote.id )

  return newNote;
}

exports.updateNote = ( id, text, createdAt, updatedAt ) => {
  const newNote = { id, text, createdAt, updatedAt };
  // get the index of the note within `data.notes`.
  const index = this.getNoteIndex( id );

  // remove the previous note and insert the new one within `data.notes`.
  data.notes = [ ...data.notes.slice( 0, index ), newNote, ...data.notes.slice( index + 1 ) ];

  // technically, the note's `id` can also be updated via PUT but practically, it's never updated.
  // so I'm skipping updating the `id` in `users.notes` array. 
}

exports.getNoteIndex = id => data.notes.findIndex( note => note.id == id );

exports.editText = ( note, text ) => {
  // update the note text along with the timestamp
  const updatedNote = { ...note, text, "updatedAt": Date.now() };
  // get the index of the note within `data.notes`.
  const index = this.getNoteIndex( note.id );
  // update the note in `data.notes`.
  data.notes = [ ...data.notes.slice( 0, index ), updatedNote, ...data.notes.slice( index + 1 ) ];
}

exports.deleteNote = ( userId, note ) => {
  // get the index of the note within `data.notes`.
  const index = this.getNoteIndex( note.id );
  // delete the note from the database 
  data.notes = [ ...data.notes.slice( 0, index ), ...data.notes.slice( index + 1 ) ];
  // remove the note from `user.notes`
  usersCtrl.removeNote( userId, note.id );
}