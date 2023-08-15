import chai from 'chai';
import supertest from 'supertest';
import mongoose from 'mongoose';

import userModel from '../src/Dao/models/user.model.js';

const expect = chai.expect;
const requester = supertest( 'http://localhost:8080' );

describe('Sessions Test', () => {

  before(function() {
    mongoose.connect('mongodb+srv://silvac:contrasena123@cluster0.bmoglka.mongodb.net/ecommerce');
    this.cookie;
  })

  after(async function() {
    // Eliminar usuario creado
    await userModel.deleteOne({ email: 'test@test.com'});
  })

  it('POST /api/sessions/register registra usuario correctamente', async function() {
    const userMock = {
      first_name: 'test',
      last_name: 'test',
      email: 'test@test.com',
      age: 100,
      password: 'test'
    };

    const registerResponse = await requester.post('/api/sessions/register').send( userMock ); 

    expect( registerResponse.statusCode ).to.be.equal( 201 );
  });

  it('POST /api/sessions/login logea usuario correctamente', async function() {
    const userMock = {
      email: 'test@test.com',
      password: 'test',
    };

    const loginResponse = await requester.post('/api/sessions/login').send( userMock );

    expect( loginResponse.statusCode ).to.be.equal( 200 ); 

    const loginCookie = loginResponse.headers[ 'set-cookie' ][0].split('=');
    this.cookie = {
      name: loginCookie[0],
      value: loginCookie[1].split(';')[0],
    };
  });
  
  it('DELETE /api/sessions/logout cierra sesión correctamente', async function() {
    const logoutResponse = await requester.delete('/api/sessions/logout').set( 'Cookie', `${this.cookie.name}=${this.cookie.value}` );

    expect( logoutResponse.statusCode ).to.be.equal( 200 );
  });

});