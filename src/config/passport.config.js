import passport from 'passport';
import local from 'passport-local';
import GitHubStrategy from 'passport-github2';

import userModel from '../Dao/models/user.model.js';
import { createHash, isValidPassword } from '../utils.js';
import { getUserRole } from '../helpers/getUserRole.js';

const LocalStrategy = local.Strategy;

const initializePassport = () => {

  // Local Register strategy
  passport.use('register', new LocalStrategy(
    {
      passReqToCallback: true,
      usernameField: 'email'
    },
    async (req, username, password, done) => {
      const { first_name, last_name } = req.body;
      try {

        const user = await userModel.findOne({ email: username });
        // El usuario ya existe
        if( user ) {
          console.log('user already exist');
          return done(null, false)
        }
        
        const newUser = {
          first_name,
          last_name,
          email: username,
          password: createHash( password ),
        }
        newUser.role = getUserRole(newUser);
        
        const result = await userModel.create( newUser );
        return done(null, result);

      } catch (error) {
        
        return done('Error al registrar usuario ' + error);

      }
    }
  ));
  
  // Local Login strategy
  passport.use('login', new LocalStrategy(
    {
      usernameField: 'email'
    },
    async (username, password, done) => {
      try {
        const user = await userModel.findOne({ email: username });
        // El usuario no existe
        if( !user ) return done(null, false);
        
        // La contraseña no es válida
        if( !isValidPassword(user, password) ) return done(null, false);
        
        return done(null, user);

      } catch (error) {

        return done('Error el logear usuario ' + error)

      }
    }
  ));

  // Github login strategy
  passport.use('github', new GitHubStrategy(
    {
      clientID: 'Iv1.b5c47551f9ed2702',
      clientSecret: '481d9ceefc870d8423e8742c291245d4a34564fe',
      callbackURL: 'http://localhost:8080/api/sessions/githubcallback',
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log( profile );
      try {

        const user = await userModel.findOne({email: profile._json.login});
        // Si el usuario ya existe en nuestra app, lo logeamos 
        if( user ) return done(null, user);
        // Si no existe, creamos el usuario
        const newUser = {
          first_name: profile._json.name,
          last_name: '',
          email: profile._json.login,
          password: '',
        }
        newUser.role = getUserRole( newUser );

        console.log(newUser)
        console.log(profile._json)

        const result = await userModel.create( newUser );
        done(null, result);

      } catch( error ) {

        done('Error al logear usuario ' + error);

      }
    }
  ));

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser( async (id, done) => {
    const user = await userModel.findById( id );
    done( null, user );
  });

}

export default initializePassport;