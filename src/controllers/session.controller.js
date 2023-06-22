class SessionController {

  // Registro de nuevo usuario exitoso
  successRegister = async (req, res) => {
    res.status(201).send({
      status: 'success',
      message: 'user registered successfully',
    });
  }

  // Registro de nuevo usuario fallido
  failRegister = async(req, res) => {
    res.status(400).send({
      status: 'Error',
      message: 'There was an error during account registration.',
    });
  }

  // Login exitoso
  successLogin = async(req, res) => {
    const { user } = req;

    req.session.user = {
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      age: user.age,
      cart: user.cart,
      role: user.role,
    }

    res.send({
      status: 'success',
      payload: req.session.user,
    })
  }

  // Login fallido
  failLogin = async(req, res) => {
    res.status(401).send({
      status: 'Error',
      message: 'Invalid credentials'
    })
  }

  // Cierra la sesión iniciada
  logout = async(req, res) => {
    req.session.destroy();
    res.send({
      status: 'success',
      message: 'logout success',
    }); 
  }

  // Github login exitoso
  successGithubLogin = async (req, res) => {
    req.session.user = req.user;
    res.redirect('/products');
  }
}

export default new SessionController();