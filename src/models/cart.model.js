import { Schema, model } from 'mongoose';

const cartCollection = 'carts';

const cartSchema = new Schema({
  products: [
    {
      products: {
        type: Schema.Types.ObjectId,
        ref: 'products',
        required: true
      },
      quantity: {
        type: Number,
        default: 1
      }
    }
  ]
});

cartSchema.pre('findOne', function () {
  this.populate('products.product');
});
