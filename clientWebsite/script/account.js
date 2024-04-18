function writeTokenToLocal(token) {
  if(!token) return;
  localStorage.setItem("hackOBank-token", token);
}
function readTokenFromLocal() {
  return localStorage.getItem("hackOBank-token") || null;
}
function deleteTokenFromLocal() {
  localStorage.removeItem("hackOBank-token");
}
function redirect(url) {
  window.location.href = url;
}
function getAccountData(callback = function(){}) {
  fetch("../api/getData", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      type: "get account details",
      token: token,
    }),
  })
  .then((response) => response.json())
  .then((response) => {
    console.log(response);
    if(response?.type === "account details") {
      accountData.username = response.username;
      accountData.balance = response.balance;
      accountData.transactions = response.transactions;
      callback();
    }

  })
  .catch((error) => {
    console.error(error);
  });
}
let token = readTokenFromLocal();
const accountData = {
  username: "John Doe",
  balance: 0,
  transactions: [],
}

function graphDataToChart(canvasID = "", data = {title:"",labels:[],data:[],color:null,moneyType:"(USD)"}) {
  const ctx = document.getElementById(canvasID).getContext('2d');
  const chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: data?.labels,
      datasets: [
        {
          label: data?.title || "",
          data: data?.data,
          borderColor: (context) => {
            return data.color || (context.raw >= 0 ? getComputedStyle(document.documentElement).getPropertyValue("--done") : getComputedStyle(document.documentElement).getPropertyValue("--denied"));
          },
          backgroundColor: (context) => {
            return data.color || (context.raw >= 0 ? getComputedStyle(document.documentElement).getPropertyValue("--done") : getComputedStyle(document.documentElement).getPropertyValue("--denied"));
          },
          segment: {
            borderColor: (context) => {
              return data.color || (context.p0.raw <= context.p1.raw ? getComputedStyle(document.documentElement).getPropertyValue("--done") : getComputedStyle(document.documentElement).getPropertyValue("--denied"));
            },
          },
        },
      ],
    },
    options: {
      responsive: false,
      maintainAspectRatio: false,
      elements: {
        line: {
          tension: 0,
        },
        point: {
          pointRadius: 7,
          pointHoverRadius: 9
        }
      },
      plugins: {
        legend: {
          display: false,
        },
        title: {
          display: true,
          text: data?.title || "",
          color: getComputedStyle(document.documentElement).getPropertyValue("--text"),
          font: {
            size: Math.min(20, Number(window.getComputedStyle(document.body).getPropertyValue('font-size').match(/\d+/)[0])) * 1.2,
          }
        },
      },
      scales: {
        x: {
          ticks: {
            maxTicksLimit: 5,
            color: getComputedStyle(document.documentElement).getPropertyValue(
              "--primary"
            ),
            font: {
              size: Math.min(20, Number(window.getComputedStyle(document.body).getPropertyValue('font-size').match(/\d+/)[0])), // Set the font size for the y-axis labels
            },
          },
          grid: {
            color: "rgba(255,255,255,0.2)"
          }
        },
        y: {
          grid: {
            color: function(context) {
              if (context.tick.value > 0) {
                return data.color || (getComputedStyle(document.documentElement).getPropertyValue("--done-transparent"));
              } else if (context.tick.value < 0) {
                return data.color || (getComputedStyle(document.documentElement).getPropertyValue("--denied-transparent"));
              }

              return '#fff';
            },
          },
          display: true,
          title: {
            display: true,
            text: data?.moneyType || "",
            color: getComputedStyle(document.documentElement).getPropertyValue(
              "--primary"
            ),
            font: {
              size: Math.min(20, Number(window.getComputedStyle(document.body).getPropertyValue('font-size').match(/\d+/)[0])), // Set the font size for the y-axis title
            },
          },
          ticks: {
            maxTicksLimit: 5,
            color: (context) => {
              if(context.tick.value === 0) return "#fff";
              return data.color || (context.tick.value > 0 ? getComputedStyle(document.documentElement).getPropertyValue("--done") : getComputedStyle(document.documentElement).getPropertyValue("--denied"));
            },
            font: {
              size: Math.min(20, Number(window.getComputedStyle(document.body).getPropertyValue('font-size').match(/\d+/)[0])) / 1.25, // Set the font size for the y-axis labels
            },
          },
          beginAtZero: true,
        },
      },
    },
  });
  chart.update();
} 


const sampleUserFinancialData = [
  { date: 1680288000000, newBalance: 5000, previousBalance: 1000, type: "deposit" },
  { date: 1680892800000, newBalance: 4500, previousBalance: 5000, type: "withdraw" },
  { date: 1680892800000, newBalance: 8000, previousBalance: 4500, type: "deposit" },
];

function getFinancialDataForTimeframe(transactionData = [], timeframe = "all") {
  let filteredData = [...transactionData];
  if(timeframe !== "all") {
    filteredData = transactionData.filter(item => {
      const dateObj = new Date(item.date);
      const dateString = `${(dateObj.getMonth() + 1).toString().padStart(2, '0')}/${dateObj.getDate().toString().padStart(2, '0')}/${dateObj.getFullYear().toString().slice(2)}`;
      return dateString.includes(timeframe);
    });
  }

  const balanceData = {
    labels: filteredData.map(item => {
      const dateObj = new Date(item.date);
      return `${(dateObj.getMonth() + 1).toString().padStart(2, '0')}/${dateObj.getDate().toString().padStart(2, '0')}/${dateObj.getFullYear().toString().slice(2)}`;
    }),
    data: filteredData.map(item => item.newBalance),
  };

  const depositData = {
    labels: filteredData.filter(item => item.type === "deposit").map(item => {
      const dateObj = new Date(item.date);
      return `${(dateObj.getMonth() + 1).toString().padStart(2, '0')}/${dateObj.getDate().toString().padStart(2, '0')}/${dateObj.getFullYear().toString().slice(2)}`;
    }),
    data: filteredData.filter(item => item.type === "deposit").map(item => item.newBalance - item.previousBalance),
  };

  const withdrawalData = {
    labels: filteredData.filter(item => item.type === "withdraw").map(item => {
      const dateObj = new Date(item.date);
      return `${(dateObj.getMonth() + 1).toString().padStart(2, '0')}/${dateObj.getDate().toString().padStart(2, '0')}/${dateObj.getFullYear().toString().slice(2)}`;
    }),
    data: filteredData.filter(item => item.type === "withdraw").map(item => item.previousBalance - item.newBalance),
  };

  return {
    balanceData,
    depositData,
    withdrawalData,
  };
}

