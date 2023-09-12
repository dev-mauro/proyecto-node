import productService from '../services/product.service.js'
import { emitChangeInProducts } from "../helpers/emitChangeInProducts.js";
import { getProductLink } from "../helpers/getProductLink.js";

import {generateProductIDError, generateAddProductError} from "../errors/productErrorCauseGenerator.js"; 
import CustomError from '../errors/CustomError.js';
import EErrors from '../errors/EErrors.js';
import userModel from '../Dao/models/user.model.js';
import { transporter } from '../config/gmail.config.js';

class ProductController {

  // Lista todos los productos. Acepta ?limit query.
  getProducts = async(req, res) => {
    const result = await productService.getProducts( req.query );
  
    const prevLink = result.hasPrevPage ? 
      getProductLink(req.query, result.prevPage) : null;
    const nextLink = result.hasNextPage ?
      getProductLink(req.query, result.nextPage) : null;
  
    res.send({
      status: "success",
      ...result,
      prevLink,
      nextLink,
    });
  
  }

  // Lista el producto con el pID solicitado
  getProductById = async(req, res) => {
    const { pid } = req.params;
  
    if(pid == null) {
      CustomError.createError({
        name: "Product ID Error",
        cause: generateProductIDError(pid),
        message: "There is no product ID in the request.",
        code: EErrors.PRODUCT_ID_NOT_VALID,
      });
    }

    try {
  
      const requestedProduct = await productService.getProductById( pid );
      res.send( {product: requestedProduct} );
  
    } catch( error ) {
      req.logger.error( error.message );
      res.status(404).send({
        "status": "not-found",
        "message": error.message
      });
    
    }
  }

  // Agrega un producto a la base de datos
  addProduct = async(req, res) => {
    const newProduct = req.body;
    const { role, email } = req.session.user || {};

    if(!newProduct.title || !newProduct.price || !newProduct.description || !newProduct.code || !newProduct.stock || !newProduct.category) {
      CustomError.createError({
        name: "Add Product Error",
        cause: generateAddProductError(newProduct),
        message: "Sent product is not valid.",
        code: EErrors.PRODUCT_NOT_VALID,
      });
    }

    if( role === 'premium' )
      newProduct.owner = email;

    try {
      const result = await productService.addProduct( newProduct );
  
      res.send({
        "status": "success",
        "newProduct": result
      });
  
      emitChangeInProducts( req );
  
    } catch (error) {
      req.logger.error( error.message );
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
    const { role, email } = req.session.user || {};

    try {
  
      // Se verifica que el usuario sea el dueño del producto
      if( role === 'premium' ) {
        const { owner } = await productService.getProductById( pid );
        if( owner != email )
          return res.status(401).send({
            "status": "error",
            "message": "You are not authorized to perform this action."
          });
      }

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
      req.logger.error( error.message );
      res.status(404).send({
        "status": "bad request",
        "message": error.message
      });
    }
  }

  // Elimina un producto de la base de datos
  deleteProduct = async(req, res) => {
    const { pid } = req.params;
    const { role, email } = req.session.user || {};

    try {
  
      // Se verifica que el usuario sea el dueño del producto
      if( role === 'premium' ) {
        const { owner } = await productService.getProductById( pid );

        // El usuario es premium pero no dueño del producto. No puede eliminarlo.
        if( owner != email ) {
          return res.status(401).send({
            "status": "error",
            "message": "You are not authorized to perform this action."
          });
        // Es premium y es dueño. Se le notifica a través de email
        } else {
          /*
          const mailOptions = {
            from: 'proyecto-node',
            to: email,
            subject: 'Solicitud de eliminación de producto procesada',
            html: `<h1>Se ha eliminado correctamente el producto ${pid}</h1>`,
          }
          await transporter.sendMail( mailOptions );
          */
        }
      }

      const result = await productService.deleteProduct( pid );

      res.send({
        "status": "success",
        "deletedID": pid
      });
  
      emitChangeInProducts( req );
  
    } catch(error) {
      req.logger.error( error.message );
      res.status(404).send({
        "status": "not found",
        "message": error.message
      });
    }
  
  }
}

export default new ProductController();