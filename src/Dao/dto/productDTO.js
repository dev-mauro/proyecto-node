export default class ProductDTO {
  constructor(product) {
    for (const prop in product) {
      this[prop] = product[prop];
    }
    this.status = this.status ?? true;
    this.thumbnails = this.thumbnails || [];
  }
}