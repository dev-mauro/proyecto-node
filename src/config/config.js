import dotenv from 'dotenv'
import { Command, Option } from 'commander'

import __dirname from '../utils.js';

// Definición de entornos disponibles
// nombre entorno : path archivo .env
const environments = {
  'dev': `${__dirname}/.env.dev`,
  'prod': `${__dirname}/.env.prod`
}

// Definición de persistencias disponibles
const availablePersistences = ['file', 'mongo']

// Configuración de parámetros
const program = new Command();

// opción de modo de ejecución
program.addOption( 
  new Option('-m, --mode <mode>', 'modo de ejecución')
  .default('dev')
  .choices( Object.keys(environments) ) 
);
  
// opción de persistencia de aplicacion
program.addOption( 
  new Option('-p, --persistence <persistence>', 'persistencia usada')
  .default('mongo')
  .choices( availablePersistences )
);

program.parse();

// Se obtiene el modo de los parámetros
const currentEnv = program.opts().mode;

// Se obtiene la persistencia a utilizar de los parámetros
const persistence = program.opts().persistence;

// Se setea el entorno actual
dotenv.config({
  path: environments[currentEnv]
});

const {
  PORT,
  MONGO_URL: mongoURL,
  SECRET: secret,
} = process.env;

export { PORT, mongoURL, secret, persistence, currentEnv }