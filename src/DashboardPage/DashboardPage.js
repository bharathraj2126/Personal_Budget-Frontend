  import React, { useState, useEffect } from 'react';
  import { Link } from 'react-router-dom';
  import axios from 'axios';
  import Chart from 'chart.js/auto';

   export const calculateDifferenceForCategoryAndMonth = (categoryName, month, dataSource) => {
    const categoryIndex = dataSource.labels.indexOf(categoryName);
  
    if (categoryIndex !== -1) {
      const budget = dataSource.datasets[0].data[categoryIndex];
      const expenses = dataSource.datasets[0].expense[categoryIndex];
      const matchingMonthIndex = dataSource.datasets[0].month.indexOf(month);
  
      if (matchingMonthIndex !== -1 && categoryIndex !== -1 && matchingMonthIndex === categoryIndex) {
        const difference = budget - expenses;
        return difference;
      } else {
        return null;
      }
    } else {
      return null;
    }
  };
  
  function DashboardPage() {
    const username = localStorage.getItem('username');
    const token = localStorage.getItem('jwt');
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
    ];

    function decodingJWT(token) {
      try {
          const base64payload = (token.split('.')[1]).replace(/-/g, '+').replace(/_/g, '/');
          const jsonPayload = decodeURIComponent(atob(base64payload).split('').map(function(c) {
               return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          }).join(''));
  
          return JSON.parse(jsonPayload);
          } catch (error) {
              return {};
          }
      }
      useEffect(() => {
        const existingToken = localStorage.getItem('jwt');
        if (existingToken) {
          const decodedToken = decodingJWT(existingToken);
          const issuedAt = decodedToken.iat; 
          const expiresIn = decodedToken.exp - issuedAt;
          const currentTimeInSeconds = Math.floor(Date.now() / 1000);
      const warningTime = expiresIn - 20;
      const warningTimeout = setTimeout(() => {
        const userResponse = window.confirm('Your session will expire in 20 seconds. Do you want to continue?');

        if (!userResponse || currentTimeInSeconds-issuedAt>expiresIn) {
          localStorage.removeItem('jwt');
          localStorage.removeItem('username');
          window.location.reload();
        }
      }, warningTime * 1000);

      return () => clearTimeout(warningTimeout);
    }
  }, []);

    const options = months.map((month) => ({
      label: month,
      value: month,
    }));

    const [selectedMonth1, setSelectedMonth1] = React.useState('');
    const [selectedMonth2, setSelectedMonth2] = React.useState('');

    const handleChange1 = (event) => {
      setSelectedMonth1(event.target.value);
    };
    const handleChange2 = (event) => {
      setSelectedMonth2(event.target.value);
    };
    const [dataSource, setDataSource] = useState({
      datasets: [
        {
          data: [],
          backgroundColor: [],
          expense: [],
          month: [],
        },
      ],
      labels: [],
    });

    const createChart = () => {
      const ctx = document.getElementById('myChart').getContext('2d');
      const existingChart = Chart.getChart(ctx);
      if (existingChart) {
        existingChart.destroy();
      }
    
      const filteredExpenses = dataSource.datasets[0].expense.filter(
        (expense, index) => dataSource.datasets[0].month[index] === selectedMonth1
      );
      const filteredBudget = dataSource.datasets[0].data.filter(
        (budget, index) => dataSource.datasets[0].month[index] === selectedMonth1
      );
      const filteredLabels = dataSource.labels.filter(
        (_, index) => dataSource.datasets[0].month[index] === selectedMonth1
      );
    
      if (filteredLabels.length === 0) {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('No expenses this month', ctx.canvas.width / 2, ctx.canvas.height / 2);
      } else {
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: filteredLabels,
          datasets: [
            {
              label: 'Total Budget',
              data: filteredBudget,
              backgroundColor: 'red',
              borderWidth: 1,
            },
            {
              label: 'Expense',
              data: filteredExpenses,
              backgroundColor: 'orange',
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            y: {
              display: false,
            },
          },
        },
      });
    };
  };

    const createPieChart = () => {
      const ctx = document.getElementById('chart2').getContext('2d');
    
      const existingChart = Chart.getChart(ctx);
      if (existingChart) {
        existingChart.destroy();
      }
    
      const filteredData = dataSource.datasets[0].expense.filter(
        (expense, index) => dataSource.datasets[0].month[index] === selectedMonth2
      );
      const filteredLabels = dataSource.labels.filter(
        (_, index) => dataSource.datasets[0].month[index] === selectedMonth2
      );
      const filteredColors = dataSource.datasets[0].backgroundColor.filter(
        (_, index) => dataSource.datasets[0].month[index] === selectedMonth2
      );
    
      if (filteredData.length === 0) {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('No expenses this month', ctx.canvas.width / 2, ctx.canvas.height / 2);
      } else {
        new Chart(ctx, {
          type: 'pie',
          data: {
            labels: filteredLabels,
            datasets: [
              {
                data: filteredData,
                backgroundColor: filteredColors, 
                borderWidth: 1,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            legend: {
              position: 'right',
            },
          },
        });
      }
    };
    const date = new Date();
    const monthName = months[date.getMonth()];
    const createStackedLineChart = () => {
      const ctx = document.getElementById('chart3').getContext('2d');
      const existingChart = Chart.getChart(ctx);
      if (existingChart) {
        existingChart.destroy();
      }
      const filteredExpenses = dataSource.datasets[0].expense.filter(
        (expense, index) => dataSource.datasets[0].month[index] === monthName
      );
      const filteredBudget = dataSource.datasets[0].data.filter(
        (budget, index) => dataSource.datasets[0].month[index] === monthName
      );
      
      if (filteredBudget.length === 0) {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('No expenses this month', ctx.canvas.width / 2, ctx.canvas.height / 2);
      } else {
      const amountDifference = filteredBudget.map((budget, index) => {
        const expenses = filteredExpenses[index];
        return budget - expenses;
      });
    
      new Chart(ctx, {
        type: 'line',
        data: {
          labels: dataSource.labels,
          datasets: [
            {
              label: 'Budget',
              data: filteredBudget,
              borderColor: 'rgba(0, 255, 0, 0.8)',
              backgroundColor: 'rgba(0, 255, 0, 0.2)',
              borderWidth: 2,
              fill: 'origin',
            },
            {
              label: 'Expenses',
              data: filteredExpenses,
              borderColor: 'rgba(255, 0, 0, 0.8)',
              backgroundColor: 'rgba(255, 0, 0, 0.2)',
              borderWidth: 2,
              fill: '-1',
            },
            {
              label: 'Amount Difference',
              data: amountDifference,
              borderColor: 'rgba(0, 0, 255, 0.8)',
              backgroundColor: 'rgba(0, 0, 255, 0.2)',
              borderWidth: 2,
              fill: '-1',
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              display: true,
              title: {
                display: true,
                text: 'Months',
              },
            },
            y: {
              display: true,
              title: {
                display: true,
                text: 'Amount',
              },
            },
          },
        },
      });
    };
  };
  const createLineChart = () => {
    const ctx = document.getElementById('chart4').getContext('2d');
    const existingChart = Chart.getChart(ctx);
    if (existingChart) {
      existingChart.destroy();
    }
  
    const totalBudgetByMonth = new Array(12).fill(0);
    const totalExpensesByMonth = new Array(12).fill(0);
  
    dataSource.datasets[0].data.forEach((budget, index) => {
      const monthIndex = months.indexOf(dataSource.datasets[0].month[index]);
      totalBudgetByMonth[monthIndex] += budget;
      totalExpensesByMonth[monthIndex] += dataSource.datasets[0].expense[index];
    });
  
    const budgetLineData = {
      label: 'Budget',
      data: totalBudgetByMonth,
      borderColor: 'rgba(160, 82, 45, 0.8)', 
      backgroundColor: 'rgba(160, 82, 45, 0.2)',
      borderWidth: 2,
      fill: false,
     
    };
    
    const expenseLineData = {
      label: 'Expenses',
      data: totalExpensesByMonth,
      borderColor: 'orange', 
      backgroundColor: 'orange',
      borderWidth: 2,
      fill: false,
    };
    
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: months,
        datasets: [budgetLineData, expenseLineData],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            display: true,
            title: {
              display: true,
              text: 'Months',
            },
          },
          y: {
            display: true,
            title: {
              display: true,
              text: 'Amount',
            },
          },
        },
      },
    });
  };
  
  
  
    useEffect(() => {
      createPieChart(); 
    }, [selectedMonth2, dataSource]);

    useEffect(() => {
      createChart(); 
    }, [selectedMonth1, dataSource]);
    const [totalBudget, setTotalBudget] = useState(0);
    const [totalExpense, setTotalExpense] = useState(0);
    const createDataTable = () => {
      const tableContainer = document.getElementById('table-container');
    
      const table = document.createElement('table');
      table.classList.add('data-table');
    
      const caption = document.createElement('caption');
      caption.textContent = 'Budget and Expenses Data';
      table.appendChild(caption);
    
      const headerRow = document.createElement('tr');
    
      const headers = ['Category', 'Month', 'Budget', 'Expenses', 'Amount Difference'];
      headers.forEach(headerText => {
        const headerCell = document.createElement('th');
        headerCell.textContent = headerText;
        headerRow.appendChild(headerCell);
      });
    
      table.appendChild(headerRow);
    
      dataSource.labels.forEach((category, index) => {
        const month = dataSource.datasets[0].month[index];
        const budget = dataSource.datasets[0].data[index];
        const expenses = dataSource.datasets[0].expense[index];
        const amountDifference = budget - expenses;
    
        const row = document.createElement('tr');
    
        const cells = [category, month, budget, expenses, amountDifference];
        cells.forEach(cellData => {
          const cell = document.createElement('td');
          cell.textContent = cellData;
          row.appendChild(cell);
        });
    
        table.appendChild(row);
      });
    
      tableContainer.innerHTML = '';
    
      tableContainer.appendChild(table);
    };
    
    const getBudget = () => {
      axios
        .get(`https://jellyfish-app-c3gkm.ondigitalocean.app/api/budget/${username}  `, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(function (res) {
          console.log(res.data);
           let budgetTotal = 0;
        let expenseTotal = 0;
          for (var i = 0; i < res.data.length; i++) {
            budgetTotal += res.data[i].budget;
            expenseTotal += res.data[i].expense;
            dataSource.datasets[0].data[i] = res.data[i].budget;
            dataSource.labels[i] = res.data[i].title;
            dataSource.datasets[0].backgroundColor[i] = res.data[i].color;
            dataSource.datasets[0].expense[i] = res.data[i].expense;
            dataSource.datasets[0].month[i] = res.data[i].month;
          }
          setTotalBudget(budgetTotal);
        setTotalExpense(expenseTotal);
          // createChart();
          console.log('dataSource:::',dataSource);
          createStackedLineChart();
          createLineChart();
          createDataTable();
        })
        .catch(function (error) {
          console.error('Error fetching budget data:', error);
        });
    };

    useEffect(() => {
      getBudget();
      
    }, []);
  
  const getFormattedDate = () => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const today = new Date();
    return today.toLocaleDateString('en-US', options);
  };
    return (
      <div className="dashboard">
    <section className="dash-head">
    <div className="heading-container">
        <h1 className="dashboard-head">WELCOME TO {username}'s DASHBOARD</h1>
        <Link to="/login" className="logout-link">
          Logout
        </Link>
      </div>
      <div className="summary-date-container">
        <div className="date-container">
          <h2 className="date">{getFormattedDate()}</h2>
          <Link to="/newcategory" className="create-category">
            Add/ Modify Categories
          </Link>
          <Link to="/deletecategory" className="create-category">
            Delete Categories
          </Link>
        </div>
        <div className="summary-container">
  <div className="summary-item">
    <p className="label">Total Budget in Amt</p>
    <p className="value">${totalBudget}</p>
  </div>
  <div className="summary-item">
    <p className="label">Total Expenses in Amt</p>
    <p className="value">${totalExpense}</p>
  </div>
  <div className="summary-item">
    <p className="label">Remaining Balance</p>
    <p className="value">${totalBudget - totalExpense}</p>
  </div>
  <div className="summary-item">
    <p className="label">Total Expenses in Percentage</p>
    <p className="value">{((totalExpense / totalBudget) * 100).toFixed(2)}%</p>
  </div>
</div>
      </div>
      <section className="charts">
  <article className="chart chart1">
    <h3>Bar Chart for Budget and Expenses based on Category in {selectedMonth1}</h3>
    <label>
  Select a month:
  <select value={selectedMonth1} onChange={handleChange1} aria-label="Select a month">
    <option value={''} disabled hidden>
      Select a month
    </option>
    {options.map((option) => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    ))}
  </select>
</label>
    <div>
      <canvas id="myChart"> </canvas>
    </div>
  </article>
  <article className="chart chart2">
    <h3>Pie Chart for All Expenses in <b>{selectedMonth2}</b> </h3>
    <div>
    <label> 
  Select a month:
  <select value={selectedMonth2} onChange={handleChange2} aria-label="Select a month">
    <option value={''} disabled hidden>
      Select a month
    </option>
    {options.map((option) => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    ))}
  </select>
</label>
      <div>
        <canvas id="chart2"> </canvas>
      </div>
    </div>
  </article>
  <article className="chart chart3">
  <h3>Ranges for budget and expenses for current month </h3>
  <div className="chart-container">
    <canvas id="chart3"> </canvas>
  </div>
</article>
<article className="chart chart4">
  <h3>Ranges for budget and expenses for all the months </h3>
  <div className="chart-container">
    <canvas id="chart4"> </canvas>
  </div>
</article>
</section>
 <div id="table-container" className="data-table-container">
        </div>   
        </section>
      </div>
    );
  }

  export default DashboardPage;
