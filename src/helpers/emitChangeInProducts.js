import { ProductManager } from '../classes/ProductManager.js';

const emitChangeInProducts = async(req) => {
  const io = req.app.get('io');

  if( !io.sockets.sockets.size ) return;

  const productManager = new ProductManager();
  const products = await productManager.getProducts();

  io.emit( 'change-in-products', products );
}

export { emitChangeInProducts }