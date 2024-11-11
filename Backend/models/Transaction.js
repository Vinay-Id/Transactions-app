const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  quantitySold: Number,
  dateOfSale: Date,
  category: String,
  isSold: Boolean
});

const Transaction = mongoose.model('Transaction', transactionSchema);
module.exports = Transaction;
