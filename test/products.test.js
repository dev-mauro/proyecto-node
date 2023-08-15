import chai from 'chai';
import supertest from 'supertest';

import productService from '../src/services/product.service.js';

const expect = chai.expect;
const requester = supertest( 'http://localhost:8080' );
// const requester = supertest( app );

describe('Products Test', () => {

  before( function() {
    this._id;
  });

  it('GET /api/products trae los productos en un array', async function() {
    const { _body } = await requester.get( '/api/products' );
    const { status, payload } = _body;

    expect( status ).to.be.equal( 'success' );
    expect( payload ).to.be.an( 'array' );
  });

  it('POST /api/products inserta un producto', async function() {

    const productMock = {
      "title": "Galletas Cariocas",
      "description": "Galletas de chocolate con crema de vainilla",
      "price": 100,
      "code": "ABC123",
      "stock": 10,
      "status": true,
      "category": "Dulces"
    };

    const { statusCode, _body } = await requester.post( '/api/products' ).send( productMock );

    expect( statusCode ).to.be.equal( 200 );
    expect( _body.newProduct ).to.haveOwnProperty( '_id' );

    this._id = _body.newProduct._id;
  });

  // Inicia sesión como Admin y elimina el producto
  it('DELETE /api/products elimina el producto', async function() {
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

    const { statusCode } = await requester
      .delete( `/api/products/${this._id}` )
      .set( 'Cookie', `${cookie.name}=${cookie.value}` );

    expect( statusCode ).to.be.equal( 200 );
  });

});