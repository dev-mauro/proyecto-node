import productModel from "../Dao/models/product.model.js";

const emitChangeInProducts = async(req) => {
  const io = req.app.get('io');

  if( !io.sockets.sockets.size ) return;

  const products = await productModel.find();

  io.emit( 'change-in-products', products );
}

export { emitChangeInProducts }