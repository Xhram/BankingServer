if(!token) redirect("../index.html"); //redirect user if they dont have account
const getChartData = function(){
  document.getElementById("name").innerHTML = accountData.username;
  document.getElementById("balanceAmmount").innerHTML = "$" + accountData.balance;

  const allTransactionData = getFinancialDataForTimeframe(accountData.transactions);
  graphDataToChart("balance", {
    title: "Balance",
    moneyType: "(USD)",
    labels: allTransactionData.balanceData.labels,
    data: allTransactionData.balanceData.data,
  });
  graphDataToChart("deposits", {
    title: "Money Deposited",
    moneyType: "(USD)",
    labels: allTransactionData.depositData.labels,
    data: allTransactionData.depositData.data,
    color: getComputedStyle(document.documentElement).getPropertyValue("--done"),
  });
  graphDataToChart("withdraws", {
    title: "Money Withdrawn",
    moneyType: "(USD)",
    labels: allTransactionData.withdrawalData.labels,
    data: allTransactionData.withdrawalData.data,
    color: getComputedStyle(document.documentElement).getPropertyValue("--denied"),
  });
}
getAccountData(getChartData);

function withdraw(){
  const value = parseInt(document.getElementById("a").value);
  if(!value && value != 0) return;
  fetch("../api/withdraw", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      type: "withdraw",
      token: token,
      ammount: value,
    }),
  })
  .then((response) => response.json())
  .then((response) => {
    console.log(response);
    if(response?.type === "withdraw") {
      getAccountData(getChartData);
    }

  })
  .catch((error) => {
    console.error(error);
  });
}
function deposit() {
  const value = parseInt(document.getElementById("a").value);
  if(!value && value != 0) return;
  fetch("../api/deposit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      type: "deposit",
      token: token,
      ammount: value,
    }),
  })
  .then((response) => response.json())
  .then((response) => {
    console.log(response);
    if(response?.type === "deposit") {
      getAccountData(getChartData);
    }

  })
  .catch((error) => {
    console.error(error);
  });
}
function simulate() {
  const yearly = parseInt(document.getElementById("b").value);
  const dailySalary = yearly / (365 - (52 * 2));
  if(!dailySalary && dailySalary != 0) return;
  for(let i = 0; i < 5; i++) {
    //five days
    fetch("../api/simulate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: "deposit",
        token: token,
        ammount: value,
      }),
    })
    .then((response) => response.json())
    .then((response) => {
      console.log(response);
      if(response?.type === "deposit") {
        //request 5 times :)
        //amazing code
        getAccountData(getChartData);
      }

    })
    .catch((error) => {
      console.error(error);
    });
  }
}