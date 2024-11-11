import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';
import axios from 'axios';

const TransactionBarChart = ({ selectedMonth }) => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [{
      label: 'Number of Items Sold',
      data: [],
      backgroundColor: '#4e73df',
    }]
  });

  useEffect(() => {
    fetchBarChartData();
  }, [selectedMonth]);

  const fetchBarChartData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/bar-chart', {
        params: { month: selectedMonth },
      });

      // Check if response.data is valid
      if (response.data && Array.isArray(response.data)) {
        const data = {
          labels: response.data.map((item) => item.range),
          datasets: [
            {
              label: 'Number of Items Sold',
              data: response.data.map((item) => item.count),
              backgroundColor: '#4e73df',
            },
          ],
        };
        setChartData(data);
      } else {
        // Handle empty or invalid response
        console.error('Unexpected data format', response.data);
      }
    } catch (error) {
      console.error('Error fetching bar chart data', error);
    }
  };

  return (
    <div>
      <h2>Transaction Bar Chart for {selectedMonth}</h2>
      {chartData.labels.length === 0 ? (
        <p>Loading chart data...</p>
      ) : (
        <Bar data={chartData} />
      )}
    </div>
  );
};

export default TransactionBarChart;
