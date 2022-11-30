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