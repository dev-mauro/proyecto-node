import express from "express";

import productRouter from "./products.router.js";

const app = express();
const PORT = 8080;

app.use( express.json() );
app.use( express.urlencoded({extended: true}) );

app.listen( PORT, ( ) => {
  console.log(`Listening at PORT ${ PORT } - http://localhost:${PORT}`);
});

app.use('/api/products', productRouter);