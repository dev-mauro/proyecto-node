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

// Impide el acceso a usuarios no administradores
const adminRoute = (req, res, next) => {
  const { role } = req.session.user || {};
  if( role === 'admin' )
    req.authorized = true;
  else
    req.authorized = false;

  next();
}

// Impide el acceso a usuarios no premium o administradores 
const premiumRoute = (req, res, next) => {
  const { role } = req.session.user || {};
  if( role != 'premium' && role != 'admin' )
    return res.status(401).send({
      "status": "error",
      "message": "You are not authorized to perform this action."
    });

  else next();
}

export {
  privateRoute,
  publicRoute,
  adminRoute,
  premiumRoute,
}