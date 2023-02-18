/*
  This function takes different params related to pagination, filtering and 
  sorting as inputs and concatenates them into a complete query-string 
  ready to be used in a URL.
  
  For example, if I call `generateQueryString( "foo", 10, 2, "updatedAt", "desc" )`, 
  this function will return the string: 
  "?q=foo&limit=10&page=2&sort=updatedAt&order=desc"
 */
function generateQueryString( limit, page, filter, sort, order ){
  const arrQueryParams = [];

  if( filter && filter != "" ) {
    // since the search string can contain user-entered text, 
    // make sure to URL-encode it.
    arrQueryParams.push( `q=${ encodeURIComponent( filter ) }` );
  }

  if( limit ) {
    arrQueryParams.push( `limit=${ limit }` );
  }

  if( page ) {
    arrQueryParams.push( `page=${ page }` );
  }

  if( sort ) {
    arrQueryParams.push( `sort=${ sort }` );
  }

  if( order ) {
    arrQueryParams.push( `order=${ order }` );
  }

  // convert the array to a list(string) delimited by "&".
  return arrQueryParams.length ? `?${ arrQueryParams.join( "&" ) }` : "";
}


/*
 Adds HATEOAS links to a collection of notes or an individual note. 
*/
exports.hateoasify = ( response, params ) => {
  const isCollection = Array.isArray( response );

  return isCollection ? hateoasifyNotes( response, params ) : hateoasifyNote( response );
}


/*
  Adds the `links` property for a collection of notes and for each note within it.
*/
function hateoasifyNotes( responseNotes, params ) {
  const { limit, page, lastPage, q, sort, order } = params;

  // Add a `links` array to each individual note object within the collection.
  // The `self` URI can be used to fetch more info about the note.
  responseNotes.forEach( n => {
    n.links = [{ rel: "self", href: `/notes/${ n.id }`, method: "GET" }]
  });

  // Add a "links" array for the entire collection of notes.
  const links = [
    { 
      rel: "self", 
      href: `/notes${ generateQueryString( limit, page, q, sort, order ) }`, 
      method: "GET" 
    },
    { 
      rel: "add-note", 
      href: "/notes", 
      method: "POST" 
    }
  ];

  // Add pagination links `first`, `prev`, `next` and `last` to the `links` array.
  // Don't include `first` and `prev` in the `links` array for the 1st page.
  if( page > 1 ) {
    links.push({ 
      rel: "first", 
      href: `/notes${ generateQueryString( limit, 1, q, sort, order ) }`, 
      method: "GET" 
    });
    links.push( { 
      rel: "prev", 
      href: `/notes${ generateQueryString( limit, page-1, q, sort, order ) }`, 
      method: "GET" 
    });
  }
  
  // Don't include `next` and `last` in the `links` array for the last page.
  if( page < lastPage ) {
    links.push({ 
      rel: "next", 
      href: `/notes${ generateQueryString( limit, parseInt( page ) + 1, q, sort, order ) }`, 
      method: "GET" 
    });
    links.push({ 
      rel: "last", 
      href: `/notes${ generateQueryString( limit, lastPage, q, sort, order ) }`, 
      method: "GET" 
    });
  }

  return {
    notes: responseNotes,
    links
  };
}


/*
  Adds the `links` property to a note object 
*/
function hateoasifyNote( responseNote ) {
  const links = [
    { rel: "self", href: `/notes/${responseNote.id}`, method: "GET" },
    { rel: "edit-text", href: `/notes/${responseNote.id}`, method: "PATCH" },
    { rel: "update", href: `/notes/${responseNote.id}`, method: "PUT" },
    { rel: "delete", href: `/notes/${responseNote.id}`, method: "DELETE" },
    { rel: "notes", href: `/notes`, method: "GET" }
  ]; 

  return {
    ...responseNote,
    links
  };
}