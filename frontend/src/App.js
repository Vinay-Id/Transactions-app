import React, { useState } from 'react';
import TransactionTable from './TransactionTable';
import TransactionStatistics from './TransactionStatistics';
import TransactionBarChart from './TransactionBarChart';
import TransactionPieChart from './TransactionPieChart';

function App() {
  const [selectedMonth, setSelectedMonth] = useState('March');

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
  };

  return (
    <div className="App">
      <h1>Product Transaction Dashboard</h1>
      <select onChange={handleMonthChange} value={selectedMonth}>
        <option value="January">January</option>
        <option value="February">February</option>
        <option value="March">March</option>
        <option value="April">April</option>
        <option value="May">May</option>
        <option value="June">June</option>
        <option value="July">July</option>
        <option value="August">August</option>
        <option value="September">September</option>
        <option value="October">October</option>
        <option value="November">November</option>
        <option value="December">December</option>
      </select>

      <TransactionTable selectedMonth={selectedMonth} />
      <TransactionStatistics selectedMonth={selectedMonth} />
      <TransactionBarChart selectedMonth={selectedMonth} />
      <TransactionPieChart selectedMonth={selectedMonth} />
    </div>
  );
}

export default App;
