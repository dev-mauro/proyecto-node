import express from "express";
import handlebars from 'express-handlebars'
import mongoose from "mongoose";
import { Server } from "socket.io";

import productRouter from "./routes/products.router.js";
import cartRouter from "./routes/carts.router.js";
import viewRouter from "./routes/views.router.js";
import chatRouter from "./routes/chat.router.js";
import __dirname from "./utils.js";

const app = express();
const PORT = 8080;

// Server config
app.use( express.json() );
app.use( express.urlencoded({extended: true}) );
app.use( express.static(__dirname + '/public') );

// Handlebars config
app.engine( 'handlebars', handlebars.engine() );
app.set( 'view engine', 'handlebars' );
app.set( 'views', __dirname + '/views' );

// Mongoose connect
mongoose.connect("mongodb+srv://silvac:contrasena123@cluster0.bmoglka.mongodb.net/ecommerce?retryWrites=true&w=majority");

const server = app.listen( PORT, ( ) => {
  console.log(`Listening at PORT ${ PORT } - http://localhost:${PORT}`);
});

// Socket.io config
const socketServerIO = new Server( server );
app.set('io', socketServerIO);

// Server router
app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);
app.use('/chat', chatRouter);
app.use('/', viewRouter );
