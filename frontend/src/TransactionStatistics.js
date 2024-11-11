import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TransactionStatistics = ({ selectedMonth }) => {
  const [statistics, setStatistics] = useState({});

  useEffect(() => {
    fetchStatistics();
  }, [selectedMonth]);

  const fetchStatistics = async () => {
    const response = await axios.get('http://localhost:5000/api/statistics', {
      params: { month: selectedMonth },
    });
    setStatistics(response.data);
  };

  return (
    <div>
      <h2>Transaction Statistics for {selectedMonth}</h2>
      <div>
        <p>Total Sale Amount: ${statistics.totalAmount || 0}</p>
        <p>Total Sold Items: {statistics.soldItems || 0}</p>
        <p>Total Not Sold Items: {statistics.notSoldItems || 0}</p>
      </div>
    </div>
  );
};

export default TransactionStatistics;
