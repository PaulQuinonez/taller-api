const mongoose = require('mongoose');
const moment = require('moment');

const maintenanceSchema = new mongoose.Schema({
  technician: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  partsUsed: [{
    part: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Parts',
      required: true
    },
    quantity: {
      type: Number,
      default: 1
    }
  }],
  date: {
    type: String,
    default: moment().format('YYYY-MM-DD'),
    set: function (value) {
      return moment(value).format('YYYY-MM-DD');
    },
    validate: {
      validator: function (value) {
        return moment(value, 'YYYY-MM-DD', true).isValid();
      },
      message: 'Formato de fecha inválido. Utilice el formato YYYY-MM-DD.'
    }
  },
  price: {
    type: Number,
    require: true
  }
});

const Maintenance = mongoose.model('Maintenance', maintenanceSchema);

module.exports = Maintenance;
