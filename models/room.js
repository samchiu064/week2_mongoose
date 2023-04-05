const mongoose = require('mongoose');

const roomSchema = mongoose.Schema({
  name: String,
  price: {
    type: Number,
    required: [true, '欄位必填'],
  },
  rating: Number,
}, { versionKey: false, timestamps: true });

const Room = mongoose.model('rooms', roomSchema);

module.exports = Room;
