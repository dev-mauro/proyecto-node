import mockingService from '../services/mocking.service.js';

class MockingController {

  // Crea una cantidad de productos aleatorios
  createProductMocks = async(req, res) => {
    const quantity = req.params.quantity || 100;

    const products = mockingService.createProductMock( quantity );

    res.send( JSON.stringify({
      status: "success",
      products,
    }) );

  }

}

export default new MockingController();