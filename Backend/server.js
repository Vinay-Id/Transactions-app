const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const cors = require('cors');
const Transaction = require('./models/Transaction');
const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb+srv://c8467326:cMWeXb8VW6lXebdZ@cluster0.lzds4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error: ', err));

app.get('/api/initialize', async (req, res) => {
  try {
    const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
    const data = response.data;
    const transactions = await Transaction.insertMany(data);
    res.status(200).json({ message: 'Database initialized', transactions });
  } catch (err) {
    res.status(500).json({ error: 'Failed to initialize data', err });
  }
});

app.get('/api/transactions', async (req, res) => {
  const { month, search = '', page = 1, perPage = 10 } = req.query;
  
  const searchRegex = new RegExp(search, 'i');  

  try {
    const transactions = await Transaction.find({
      dateOfSale: { $regex: `^${month}`, $options: 'i' }, 
      $or: [
        { title: searchRegex },
        { description: searchRegex },
        { price: searchRegex }
      ]
    })
    .skip((page - 1) * perPage)
    .limit(Number(perPage));

    const totalTransactions = await Transaction.countDocuments({
      dateOfSale: { $regex: `^${month}`, $options: 'i' },
      $or: [
        { title: searchRegex },
        { description: searchRegex },
        { price: searchRegex }
      ]
    });

    res.status(200).json({
      transactions,
      totalTransactions,
      totalPages: Math.ceil(totalTransactions / perPage),
      currentPage: Number(page),
    });
  } catch (err) {
    res.status(500).json({ error: 'Error fetching transactions', err });
  }
});

app.get('/api/statistics', async (req, res) => {
  const { month } = req.query;

  try {
    const totalSales = await Transaction.aggregate([
      { $match: { dateOfSale: { $regex: `^${month}`, $options: 'i' } } },
      { 
        $group: { 
          _id: null, 
          totalAmount: { $sum: '$price' }, 
          soldItems: { $sum: '$quantitySold' }, 
          notSoldItems: { 
            $sum: { 
              $cond: [{ $eq: ['$isSold', false] }, 1, 0] 
            } 
          }
        } 
      }
    ]);

    res.status(200).json(totalSales[0] || {});
  } catch (err) {
    res.status(500).json({ error: 'Error fetching statistics', err });
  }
});

app.get('/api/bar-chart', async (req, res) => {
  const { month } = req.query;

  try {
    const priceRanges = [
      { min: 0, max: 100 },
      { min: 101, max: 200 },
      { min: 201, max: 300 },
      { min: 301, max: 400 },
      { min: 401, max: 500 },
      { min: 501, max: 600 },
      { min: 601, max: 700 },
      { min: 701, max: 800 },
      { min: 801, max: 900 },
      { min: 901, max: Infinity }
    ];

    const barChartData = await Promise.all(priceRanges.map(async range => {
      const count = await Transaction.countDocuments({
        dateOfSale: { $regex: `^${month}`, $options: 'i' },
        price: { $gte: range.min, $lte: range.max }
      });
      return { range: `${range.min}-${range.max}`, count };
    }));

    res.status(200).json(barChartData);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching bar chart data', err });
  }
});

app.get('/api/pie-chart', async (req, res) => {
  const { month } = req.query;

  try {
    const pieChartData = await Transaction.aggregate([
      { $match: { dateOfSale: { $regex: `^${month}`, $options: 'i' } } },
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    res.status(200).json(pieChartData);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching pie chart data', err });
  }
});

app.get('/api/combined', async (req, res) => {
  const { month } = req.query;

  try {
    const [statistics, barChart, pieChart] = await Promise.all([
      axios.get(`http://localhost:5000/api/statistics?month=${month}`),
      axios.get(`http://localhost:5000/api/bar-chart?month=${month}`),
      axios.get(`http://localhost:5000/api/pie-chart?month=${month}`)
    ]);

    res.status(200).json({
      statistics: statistics.data,
      barChart: barChart.data,
      pieChart: pieChart.data
    });
  } catch (err) {
    res.status(500).json({ error: 'Error fetching combined data', err });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
