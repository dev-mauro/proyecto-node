import mongoose from "mongoose";

const cartCollection = "carts";

const cartSchema = new mongoose.Schema({
  products: {
    type: [
      {
        product: {type: mongoose.Schema.ObjectId, ref: 'products'},
        quantity: Number,
      }
    ],
  }
});

const cartModel = mongoose.model(cartCollection, cartSchema);

export default cartModel;