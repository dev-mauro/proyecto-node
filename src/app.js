import express from "express";
import handlebars from 'express-handlebars'
import mongoose from "mongoose";
import { Server } from "socket.io";
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from "passport";

import productRouter from "./routes/products.router.js";
import cartRouter from "./routes/carts.router.js";
import sessionRouter from "./routes/session.router.js"
import viewRouter from "./routes/views.router.js";
import chatRouter from "./routes/chat.router.js";
import mockingRouter from "./routes/mocking.router.js"
import loggerRouter from "./routes/logger.router.js";

import __dirname from "./utils.js";
import initializePassport from "./config/passport.config.js"
import { PORT, mongoURL, secret } from "./config/config.js";
import errorHandler from "./middlewares/errorHandler.middleware.js";
import { addLogger } from "./middlewares/winston.middleware.js";

const app = express();

// Server config
app.use( express.json() );
app.use( express.urlencoded({extended: true}) );
app.use( express.static(__dirname + '/public') );

// Handlebars config
app.engine( 'handlebars', handlebars.engine() );
app.set( 'view engine', 'handlebars' );
app.set( 'views', __dirname + '/views' );

// Session config
app.use( session({
  store: MongoStore.create({
    mongoUrl: mongoURL,
    mongoOptions: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  }),
  secret,
  resave: false,
  saveUninitialized: false,
}));

// Passport config
initializePassport();
app.use( passport.initialize() );
app.use( passport.session() );


const server = app.listen( PORT, ( ) => {
  console.log(`Listening at PORT ${ PORT } - http://localhost:${PORT}`);
});

// Socket.io config
const socketServerIO = new Server( server );
app.set('io', socketServerIO);

// Server router
app.use(addLogger);
app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);
app.use('/api/sessions', sessionRouter);
app.use('/chat', chatRouter);
app.use('/', viewRouter );
app.use('/mocking', mockingRouter );
app.use('/loggertest', loggerRouter);
app.use(errorHandler);