exports.hateoasify = ( responseNotes, qs={} ) => {
  const isCollection = Array.isArray( responseNotes );

  return isCollection ? hateoasifyNotes( responseNotes, qs ) : hateoasifyNote( responseNotes );
}

function hateoasifyNotes( responseNotes, qs ) {
  const { q, limit, page, sort, order } = qs;

  // add "links" to each note object inside the notes array
  responseNotes.forEach( n => {
    n.links = [{ rel: "self", href: `/notes/${n.id}`, method: "GET" }]
  });

  // add "links" to the response object and return
  const links = [
    { rel: "self", href: `/notes${generateQueryString( q, limit, page, sort, order )}`, method: "GET" },
    { rel: "add-note", href: "/notes", method: "POST" },
  ];

  // add pagination links
  const lastPage = Math.ceil( responseNotes.length / limit );

  if( page > 1 ) {
    links.push( { rel: "first", href: `/notes${generateQueryString( q, limit, 1, sort, order )}`, method: "GET" } );
    links.push( { rel: "prev", href: `/notes${generateQueryString( q, limit, page-1, sort, order )}`, method: "GET" } );
  }

  if( page < lastPage ) {
    links.push( { rel: "next", href: `/notes${generateQueryString( q, limit, parseInt(page) + 1, sort, order )}`, method: "GET" } );
    links.push( { rel: "last", href: `/notes${generateQueryString( q, limit, lastPage, sort, order )}`, method: "GET" } );
  }

  minIndex = page == 1 ? 0 : ( ( page - 1 ) * limit );
  maxIndex = page == lastPage ? ( responseNotes.length - 1 ) : ( page * limit ) - 1;
  responseNotes = responseNotes.filter( ( item, index ) => index >= minIndex && index <= maxIndex );

  return {
    notes: responseNotes,
    links
  };
}

function hateoasifyNote( responseNotes ) {
  const links = [
    { rel: "self", href: `/notes/${responseNotes.id}`, method: "GET" },
    { rel: "edit", href: `/notes/${responseNotes.id}`, method: "PATCH" },
    { rel: "update", href: `/notes/${responseNotes.id}`, method: "PUT" },
    { rel: "delete", href: `/notes/${responseNotes.id}`, method: "DELETE" },
  ]
  return {
    ...responseNotes,
    links
  };
}

function generateQueryString( filter, limit, page, sort, order ){
  const arrQueryParams = [];

  if( filter != "" ) {
    arrQueryParams.push( `q=${ filter }` );
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

  return arrQueryParams.length ? `?${ arrQueryParams.join( "&" ) }` : "";
}