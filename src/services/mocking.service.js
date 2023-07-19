import { Faker, en } from '@faker-js/faker'

const customFaker = new Faker({locale: [en]});

class MockingService {

  createProductMock( quantity ) {
    const products = [];

    for(let i = 0; i < quantity; i++) {
      products.push({
        title: customFaker.commerce.productName(),
        description: customFaker.commerce.productDescription(),
        price: customFaker.commerce.price(),
        thumbnails: [],
        code: customFaker.string.alpha(2) + customFaker.string.numeric(2),
        stock: parseInt( customFaker.string.numeric(2) ),
        status: customFaker.datatype.boolean(),
        category: customFaker.commerce.department(),
      });
    }

    return products;
  }

}

export default new MockingService();