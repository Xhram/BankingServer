function createAccount(username, password) {
  fetch("../api/createAccount", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      type: "create account",
      username: username,
      password: password,
    }),
  })
  .then((response) => response.json())
  .then((response) => {
    console.log(response);
    
  })
  .catch((error) => {
    console.error(error);
  });
}

const sampleUserFinancialData = [
  { date: '2023-04-01', balance: 5000, deposit: 1000, withdrawal: 500 },
  { date: '2023-04-08', balance: 5500, deposit: 800, withdrawal: 300 },
  { date: '2023-04-15', balance: -6000, deposit: 900, withdrawal: 400 },
  { date: '2023-04-22', balance: -6300, deposit: 700, withdrawal: 400 },
  { date: '2023-04-29', balance: 2600, deposit: 800, withdrawal: 500 }
];
function getFinancialDataForTimeframe(timeframe) {

  // Implement logic to fetch user financial data based on the timeframe
  
  // For this example, we'll use the sample data
  
  return {
  
    labels: sampleUserFinancialData.map(item => item.date),
    
    balanceData: sampleUserFinancialData.map(item => item.balance),
    
    depositData: sampleUserFinancialData.map(item => item.deposit),
    
    withdrawalData: sampleUserFinancialData.map(item => item.withdrawal)
  
  };

}
let financialData = getFinancialDataForTimeframe();
const ctx = document.getElementById('savings').getContext('2d');
const myChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: sampleUserFinancialData.map(item => item.date),
    datasets: [
      {
        label: 'Account Balance',
        data: sampleUserFinancialData.map(item => item.balance),
        borderColor: getComputedStyle(document.documentElement).getPropertyValue('--primary'),
        backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--primary-transparent'),
        fill: true
      }
    ]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: false
      },
      legend: {
        display: false
      }
    },
    scales: {
      x: {
        ticks: {
          font: {
            size: 12,
          }
        },
        display: true,
        title: {
          display: true,
          text: 'Date',
          font: {
            size: 10 // Set the font size for the x-axis title
          }
        },
      },
      y: {
        display: true,
        title: {
          display: true,
          text: 'Account Balance (USD)',
          font: {
            size: 14 // Set the font size for the y-axis title
          }
        },
        ticks: {
          font: {
            size: 120 // Set the font size for the y-axis labels
          }
        },
        beginAtZero: true
      }
    }
  }
});
myChart.update();
