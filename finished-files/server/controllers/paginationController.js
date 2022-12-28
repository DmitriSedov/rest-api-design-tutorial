/*
  Calculates and returns the value of the last page 
  given an array of items and the limit value.
  For example, if there are 30 items in the array and the limit is 10, 
  then the function will return 3.
*/
const getLastPage = ( arrItems, limit ) => Math.ceil( arrItems.length / limit );

/*
  Returns a subset of an array of items that fall within the current page
  along with the value of the last page.
*/
exports.paginate = ( arrItems, page, limit ) => {
  const lastPage = getLastPage( arrItems, limit );

  // calculate the minimum and maximum index of the items for the current page
  const minIndex = page == 1 ? 0 : ( ( page - 1 ) * limit );
  const maxIndex = page == lastPage ? ( arrItems.length - 1 ) : ( page * limit ) - 1;

  // Filter out items that do not fall between the minimum and maximum index 
  const paginatedResults = arrItems.filter( 
    ( item, index ) => index >= minIndex && index <= maxIndex 
  );

  return {
    paginatedResults,
    lastPage
  }
}