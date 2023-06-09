import productService from '../services/product.service.js'
import { emitChangeInProducts } from "../helpers/emitChangeInProducts.js";
import { getProductLink } from "../helpers/getProductLink.js";

class ProductController {

  // Lista todos los productos. Acepta ?limit query.
  getProducts = async(req, res) => {
    const result = await productService.getProducts( req.query );
  
    const prevLink = result.hasPrevPage ? 
      getProductLink(req.query, result.prevPage) : null;
    const nextLink = result.hasNextPage ?
      getProductLink(req.query, result.nextPage) : null;
  
    res.send( JSON.stringify({
      status: "success",
      ...result,
      prevLink,
      nextLink,
    }) );
  
  }

  // Lista el producto con el pID solicitado
  getProductById = async(req, res) => {
    const { pid } = req.params;
  
    try {
  
      const requestedProduct = await productService.getProductById( pid );
      res.send( {product: requestedProduct} );
  
    } catch( error ) {
  
      res.status(400).send({
        "status": "not-found",
        "message": error.message
      });
    
    }
  }

  // Agrega un producto a la base de datos
  addProduct = async(req, res) => {
    const newProduct = req.body;
  
    try {
      const result = await productService.addProduct( newProduct );
  
      res.send({
        "status": "success",
        "newProduct": newProduct
      });
  
      emitChangeInProducts( req );
  
    } catch (error) {
      res.status(400).send({
        "status": "bad request",
        "message": error.message
  
      });
    }
  }

  // Actualiza un producto de la base de datos
  updateProduct = async(req, res) => {
    const productUpdate = req.body;
    const { pid } = req.params;
  
    try {
  
      const result = await productService.updateProduct(pid, productUpdate);
      res.send({
        "status": "success",
        "update": {
          id: pid,
          ...productUpdate
        },
      });
  
      emitChangeInProducts( req );
  
    } catch(error) {
      res.status(400).send({
        "status": "bad request",
        "message": error.message
      });
    }
  }

  // Elimina un producto de la base de datos
  deleteProduct = async(req, res) => {
    const { pid } = req.params;
  
    try {
  
      const result = await productService.deleteProduct( pid );
      res.send({
        "status": "success",
        "deletedID": pid
      });
  
      emitChangeInProducts( req );
  
    } catch(error) {
      res.send({
        "status": "not found",
        "message": error.message
      });
    }
  
  }
}

export default new ProductController();