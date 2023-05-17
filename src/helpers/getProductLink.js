function getProductLink(query, page = 1, baseURL = 'http://localhost:8080/api/products'){
  const {limit = 10, sort, category, status} = query;

  let link = `${baseURL}?limit=${limit}&page=${page}`;

  if( category ) link += `&category=${category}`;
  if( status ) link += `&status=${status}`;
  if( sort ) link += `&sort=${sort}`;

  return link;
}

export { getProductLink };