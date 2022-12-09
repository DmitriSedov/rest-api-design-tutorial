let data = require( "../data/data" );
const { v4: uuidv4 } = require( "uuid" );
const usersCtrl = require( "./usersController" );

/*
 * Returns the full note object given the note ID.
 */
exports.getNoteById = id => data.notes.find( note => note.id == id );

/*
 * Returns an array of note objects given an array of note IDs.
 * If `returnPartialRep` is `true`, then the note objects are returned without the `createdAt` field.
 * This is helpful when `notes` are being sent in a response as a "collection resource" 
 * where each note object only needs to contain the most useful information upfront.
 * Detailed info about any note in the collection can later be retrieved by invoking the Singleton Note Resource API Endpoint. 
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

/*
 * Returns the index of the note in `data.notes`.
 * This is useful for updating or deleting a single note in an immutable way.
 */
exports.getNoteIndex = id => data.notes.findIndex( note => note.id == id );

/*
 * Creates a new note. 
 * Inserts the note object in `data.notes`. Inserts the note ID in the `notes` array in `data.users` 
 * Returns the new note object.
 */
exports.createNote = ( userId, text ) => {
  // create a new note
  // generate a Universally Unique Identifier using the `uuid` NPM library.
  // Existing data for `notes` and `users` use simple numbers as IDs for our convenience while testing in Postman.
  // Using `uuid` is convenient for generating new notes because otherwise we'll need to keep track of what ID number has already been used.
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

/*
 * Replaces the existing note object with the updated note object in `data.notes` in an immutable way.
 * Returns the updated note object.
 * 
 * Technically, PUT can update the entire note object including the ID,
 * but practically, the ID will be left unchanged in the client PUT request payload.
 * So I'm not going to worry about updating the `notes` array in `data.users`. 
 */
exports.updateNote = ( id, text, createdAt, updatedAt ) => {
  const updatedNote = { id, text, createdAt, updatedAt };
  // Assuming that the note ID has not been changed, get the index of the note within `data.notes`.
  const index = this.getNoteIndex( id );

  // replace the existing note with the updated one within `data.notes` in an immutable way.
  // Ref: https://www.peanutbutterjavascript.com/posts/update-arrays-without-mutating-the-original 
  data.notes = [ ...data.notes.slice( 0, index ), updatedNote, ...data.notes.slice( index + 1 ) ];

  return updatedNote;
}

/*
 * Unlike `updateNote()`, updates only the note `text` and `updatedAt` timestamp fields and nothing else.  
 * Returns the updated note object.
 */
exports.editText = ( note, text ) => {
  // update the note text along with the timestamp
  const updatedNote = { ...note, text, "updatedAt": Date.now() };
  // get the index of the note within `data.notes`.
  const index = this.getNoteIndex( note.id );
  // replace the existing note with the updated one within `data.notes` in an immutable way.
  // Ref: https://www.peanutbutterjavascript.com/posts/update-arrays-without-mutating-the-original 
  data.notes = [ ...data.notes.slice( 0, index ), updatedNote, ...data.notes.slice( index + 1 ) ];

  return updatedNote;
}

/*
 * Deletes a note from `data.notes` and also remove the corresponding note ID from the notes array in `data.users`.
 * It doesn't return anything.  
 */
exports.deleteNote = ( userId, note ) => {
  // get the index of the note within `data.notes`.
  const index = this.getNoteIndex( note.id );
  // delete the note from the database in an immutable way.
  // Ref: https://www.peanutbutterjavascript.com/posts/update-arrays-without-mutating-the-original 
  data.notes = [ ...data.notes.slice( 0, index ), ...data.notes.slice( index + 1 ) ];
  // remove the note ID from the `notes` array in `data.users`
  usersCtrl.removeNote( userId, note.id );
}

/*
 * Accepts an array of note objects and a string to search as input and performs a case-insensitive search for this sub-string in the notes' `text`.
 * Returns a filtered array of note objects where the search string returns a match.
 */
exports.filterNotes = ( notes, textToSearch ) => {
  return textToSearch == ""
    ? notes
    : notes.filter( note => note.text.toLowerCase().includes( textToSearch.toLowerCase() ));
}

/*
 * Accepts an array of note objects and sorting preferences.
 * The `sort` value can either be `createdAt` or `updatedAt`.
 * The `order` value can either be `asc` or `desc`.
 * Returns an array of note objects sorted by the column specified by `sort` and in the order specified by the `order` arguments.
 */
exports.sortNotes = ( notes, sort, order ) => {
  return notes.sort(( note1, note2 ) => {
    if( order == "desc" ) {
      return note2[ sort ] - note1[ sort ];
    } else {
      return note1[ sort ] - note2[ sort ];
    }
  });
}

