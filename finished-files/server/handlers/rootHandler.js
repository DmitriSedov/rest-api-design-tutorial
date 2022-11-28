exports.handleRoot = ( req, res ) => {
  res.json({
    "links": [
      { "rel": "self", "href": "/", "method": "GET" },
      { "rel": "auth", "href": "/auth", "method": "POST" }
    ]
  });
}