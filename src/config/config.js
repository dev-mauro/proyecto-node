import dotenv from 'dotenv'
import { Command, Option } from 'commander'

import __dirname from '../utils.js';

// Definición de entornos disponibles
// nombre entorno : path archivo .env
const environments = {
  'dev': `${__dirname}/.env.dev`,
  'prod': `${__dirname}/.env.prod`
}

// Configuración de parámetros
const program = new Command();
program
  .addOption( new Option('-m, --mode <mode>', 'modo de ejecución')
  .default('dev')
  .choices( Object.keys(environments) ));

program.parse();

// Se obtiene el modo de los parámetros
const currentEnv = program.opts().mode;


// Se setea el entorno actual
dotenv.config({
  path: environments[currentEnv]
});

const {
  PORT,
  MONGO_URL: mongoURL,
  SECRET: secret,
} = process.env;

export { PORT, mongoURL, secret }