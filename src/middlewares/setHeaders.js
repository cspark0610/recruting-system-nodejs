const setHeaders = (_req, res, next) => {
  res.header(
    'Access-Control-Allow-Origin',
    'https://6687-186-58-42-123.ngrok.io',
  ); // update to match the domain you will make the request from
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept',
  );
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  next();
};

module.exports = setHeaders;
