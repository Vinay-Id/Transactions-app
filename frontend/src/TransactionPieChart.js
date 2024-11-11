import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';
import axios from 'axios';

const TransactionPieChart = ({ selectedMonth }) => {
  const [pieData, setPieData] = useState([]);

  useEffect(() => {
    fetchPieChartData();
  }, [selectedMonth]);

  const fetchPieChartData = async () => {
    const response = await axios.get('http://localhost:5000/api/pie-chart', {
      params: { month: selectedMonth },
    });

    const data = {
      labels: response.data.map((item) => item._id),
      datasets: [
        {
          data: response.data.map((item) => item.count),
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4e73df', '#6f42c1'],
        },
      ],
    };
    setPieData(data);
  };

  return (
    <div>
      <h2>Transaction Pie Chart for {selectedMonth}</h2>
      <Pie data={pieData} />
    </div>
  );
};

export default TransactionPieChart;
