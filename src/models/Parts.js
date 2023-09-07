const mongoose = require('mongoose');

const partsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  brand: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Brand',
    required: true
  },
  stock: {
    type: Number,
    default: 0
  },
  price : {
    type: Number,
    require: true,
    default: 0,
    min: 0,
    max: 9999.99,
    get: value => value.toFixed(2),
    set: value => parseFloat(value.toFixed(2)),
  },
  image: {
    data: Buffer,
    contentType: String
  }
});

const Parts = mongoose.model('Parts', partsSchema);

module.exports = Parts;
