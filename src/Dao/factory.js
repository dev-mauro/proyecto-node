import { persistence } from '../config/config.js';

let productDao;
let cartDao;

switch (persistence) {
  case 'file':
    const { ProductManager:productFile } = await import('./managers/ProductManager.js');
    const { CartManager:cartFile } = await import('./managers/CartManager.js');
    productDao = new productFile();
    cartDao = new cartFile();
    break;

  case 'mongo':
    const { connectDB } = await import('../config/dbConnection.js');
    connectDB();
    const { ProductManagerMongo } = await import('./managers/ProductManagerMongo.js');
    const { CartManagerMongo } = await import('./managers/CartManagerMongo.js');
    productDao = new ProductManagerMongo();
    cartDao = new CartManagerMongo();
    break;
}

export { productDao, cartDao };