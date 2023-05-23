const privateRoute = (req, res, next) => {
  const { user } = req.session;
  if( !user ) res.redirect('/login');
  else next();
}

const publicRoute = (req, res, next) => {
  const { user } = req.session;
  if( user ) res.redirect('/profile');
  else next();
};

export {
  privateRoute,
  publicRoute,
}