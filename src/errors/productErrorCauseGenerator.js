export const generateProductIDError = ( pid ) => {
  return `Product ID ${pid} is not valid.  `
}

export const generateAddProductError = ( product ) => {
  return `Product properties are not complete or are not valid.
  List of expected properties:
  * title: String, received: ${product.title}
  * description: String, received: ${product.description}
  * price: Number, received: ${product.price}
  * code: String, received: ${product.code}
  * stock: Number, received: ${product.stock}
  * category: String, received: ${product.category}
  `
}