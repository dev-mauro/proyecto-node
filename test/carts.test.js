import chai from 'chai';
import supertest from 'supertest';
import mongoose from 'mongoose';

import cartModel from '../src/Dao/models/cart.model.js';
import productModel from '../src/Dao/models/product.model.js';

const expect = chai.expect;
const requester = supertest( 'http://localhost:8080' );

describe('Carts Test', () => {

  before(function () {
    mongoose.connect('mongodb+srv://silvac:contrasena123@cluster0.bmoglka.mongodb.net/ecommerce');
    this.cartId = '';
    this.productId = '';
  })

  after(async function() {
    await cartModel.deleteOne( {_id: this.cartId} )
    await productModel.deleteOne( {_id: this.productId} )
  });

  it('GET /api/carts/ retorna los carritos en un array', async function() {
    const { statusCode, _body } = await requester.get( '/api/carts' );

    expect( statusCode ).to.be.equal( 200 );
    expect( _body.carts ).to.be.an('array');
  });

  it('POST /api/carts/ crea el carrito en la BD con una lista de productos vacía', async function() {
    const { statusCode, _body } = await requester.post( '/api/carts' );

    if( _body.result._id ) this.cartId = _body.result._id;

    expect( statusCode ).to.be.equal( 200 );
    expect( _body.result.products ).to.be.an('array');
    expect( _body.result.products ).to.be.empty;
  });
  
  it('DELETE /api/carts/ elimina todos los productos del carrito', async function() {
    const productMock = {
      "title": "Galletas Cariocas",
      "description": "Galletas de chocolate con crema de vainilla",
      "price": 100,
      "code": "ABC123",
      "stock": 10,
      "status": true,
      "category": "Dulces"
    };

    // Se crea un nuevo producto
    const createProductResponse = await requester.post( '/api/products' ).send( productMock );

    expect( createProductResponse.statusCode ).to.be.equal( 200 );

    this.productId = createProductResponse._body.newProduct._id;

    // Se inicia sesión como admin
    const adminUser = {
      email: 'adminCoder@coder.com',
      password: '123',
    }

    const loginResponse = await requester.post( '/api/sessions/login' ).send( adminUser );

    expect( loginResponse.statusCode ).to.be.equal( 200 );

    const loginCookie = loginResponse.headers[ 'set-cookie' ][0].split('=');
    const cookie = {
      name: loginCookie[0],
      value: loginCookie[1].split(';')[0],
    }

    // Se agrega el nuevo producto al carrito
    const addProductResponse = await requester
      .post( `/api/carts/${this.cartId}/product/${this.productId}` )
      .set('Cookie', `${cookie.name}=${cookie.value}`);

    expect( addProductResponse.statusCode ).to.equal( 200 );

    // Se eliminan todos los productos del carrito
    const { statusCode } = await requester.delete( `/api/carts/${this.cartId}` );

    expect( statusCode ).to.be.equal( 200 );

    // Se solicitan los productos del carrito para revisar que esté vacío
    const cartResponse = await requester.get( `/api/carts/${this.cartId}` );

    expect( cartResponse.statusCode ).to.equal( 200 )
    expect( cartResponse._body.products ).to.be.an('array');
    expect( cartResponse._body.products ).to.be.empty;
  });

});