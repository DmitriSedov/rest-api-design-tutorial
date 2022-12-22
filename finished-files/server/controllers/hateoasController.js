/**
 * This function takes different params related to pagination, filtering and sorting as inputs 
 * and concatenates them into a complete query-string ready to be used in a URL.
 * 
 * For example, if I call `generateQueryString( "foo", 10, 2, "updatedAt", "desc" )`, 
 * this function will return the string: "?q=foo&limit=10&page=2&sort=updatedAt&order=desc"
 */
 function generateQueryString( filter, limit, page, sort, order ){
  const arrQueryParams = [];

  if( filter != "" ) {
    // since the search string can contain user-entered text, make sure to URL-encode it.
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
 * Adds HATEOAS links to the response of `/notes` or `notes/{id}`. 
 */
exports.hateoasify = ( response, qs={} ) => {
  const isCollection = Array.isArray( response );

  return isCollection ? hateoasifyNotes( response, qs ) : hateoasifyNote( response );
}


/*
 * Adds HATEOAS links to the response of the collection resource endpoint: `/notes`. 
 */
function hateoasifyNotes( responseNotes, qs ) {
  const { q, limit, page, sort, order } = qs;

  // add a `links` array to each individual note object within the `notes` array.
  // Each `links` array will expose a `self` link which can be used to derive more information about the singleton note.
  responseNotes.forEach( n => {
    n.links = [{ rel: "self", href: `/notes/${n.id}`, method: "GET" }]
  });

  // add a "links" array to the entire response object. 
  // This `links` property will expose actions on the collection of notes i.e. `/notes`.
  const links = [
    { rel: "self", href: `/notes${generateQueryString( q, limit, page, sort, order )}`, method: "GET" },
    { rel: "add-note", href: "/notes", method: "POST" },
  ];

  // add pagination related entries to the `links` array i.e. `first`, `prev`, `next` and `last`.
  const lastPage = Math.ceil( responseNotes.length / limit );
  // don't include the `first` and `prev` links in the `links` array for the 1st page.
  if( page > 1 ) {
    links.push( { rel: "first", href: `/notes${generateQueryString( q, limit, 1, sort, order )}`, method: "GET" } );
    links.push( { rel: "prev", href: `/notes${generateQueryString( q, limit, page-1, sort, order )}`, method: "GET" } );
  }
  // don't include the `next` and `last` links in the `links` array for the last page.
  if( page < lastPage ) {
    links.push( { rel: "next", href: `/notes${generateQueryString( q, limit, parseInt(page) + 1, sort, order )}`, method: "GET" } );
    links.push( { rel: "last", href: `/notes${generateQueryString( q, limit, lastPage, sort, order )}`, method: "GET" } );
  }
  // based on `limit` and `page`, exclude notes that are not part of the current page. return the selected ones in the response.
  minIndex = page == 1 ? 0 : ( ( page - 1 ) * limit );
  maxIndex = page == lastPage ? ( responseNotes.length - 1 ) : ( page * limit ) - 1;
  responseNotes = responseNotes.filter( ( item, index ) => index >= minIndex && index <= maxIndex );

  return {
    notes: responseNotes,
    links
  };
}


/*
 * Adds HATEOAS links to the response of a singleton note resource endpoint: `/notes/{id}`.
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