import { fileURLToPath } from 'url';
import { dirname } from 'path';
import bcrypt from 'bcrypt';

const __filename = fileURLToPath( import.meta.url );
const __dirname = dirname( __filename );

// Hashea la contraseña
const createHash = ( password ) => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

// Compara la contraseña
const isValidPassword = ( user, password ) => bcrypt.compareSync(password, user.password);


export { createHash, isValidPassword };
export default __dirname;