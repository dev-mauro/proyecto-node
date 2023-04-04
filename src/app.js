import express from "express";
import { ProductManager } from "./classes/ProductManager.js";

const productManager = new ProductManager();

const app = express();
const PORT = 8080;

app.use( express.urlencoded({extended: true}) );

app.listen( PORT, ( ) => {
  console.log(`Listening PORT ${ PORT }`);
});

app.get( '/products', async (req, res) => {

  const { limit } = req.query;
  const products = await productManager.getProducts();
  
  if(!limit) return res.send( JSON.stringify({ products }) );

  res.send( JSON.stringify({products: products.slice(0, limit)}) );

} );

app.get( '/products/:pid', async (req, res) => {

  const { pid } = req.params;

  try {

    const requestedProduct = await productManager.getProductById( pid );
    res.send( JSON.stringify({product: requestedProduct}) );

  } catch( error ) {

    res.send(`No existe producto con ID solicitado`);
  
  }
} );