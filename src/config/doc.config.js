import swaggerJsDoc from 'swagger-jsdoc'

import __dirname from "../utils.js";

const swaggerOptions = {
	definition: {
		openapi: '3.0.1',
		info: {
			title: 'eCommerce CoderHouse API',
			description: 'API para el proyecto final del curso de NodeJS de CoderHouse',
		}
	},
	apis: [`${__dirname}/docs/**/*.yaml`]
}

export const swaggerSpecs = swaggerJsDoc( swaggerOptions );

