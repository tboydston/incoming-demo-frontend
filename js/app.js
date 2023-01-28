async function loadData() {
  let depositData = {};
  let addressData = {};

  try {
    const depositDataResponse = await fetch("../data/depositData.json");
    depositData = await depositDataResponse.json();
    const addressDataResponse = await fetch("../data/addressData.json");
    addressData = await depositDataResponse.json();
  } catch (error) {
    console.error("Error:", error);
  }

  loadTable(depositData, "BTC");
  loadTable(depositData, "BTCt");
}

function loadTable(depositData, coin) {
  var table = parseToHTMLTable(depositData[coin].deposits);
  document.getElementById(`${coin}-Deposits`).appendChild(table);
}

// Function to parse JSON data to HTML table
function parseToHTMLTable(data) {
  var table = document.createElement("table");
  var thead = document.createElement("thead");
  var tbody = document.createElement("tbody");
  var headRow = document.createElement("tr");

  // Extract the keys from the first object in the data array
  // These will be used as the table headers
  var headers = Object.keys(data[0]);
  for (var i = 0; i < headers.length; i++) {
    var th = document.createElement("th");
    th.innerHTML = headers[i];
    headRow.appendChild(th);
  }
  thead.appendChild(headRow);
  table.appendChild(thead);

  // Loop through the data array to create the rows and cells
  for (var i = 0; i < data.length; i++) {
    var row = document.createElement("tr");
    for (var j = 0; j < headers.length; j++) {
      var cell = document.createElement("td");
      cell.innerHTML = data[i][headers[j]];
      row.appendChild(cell);
    }
    tbody.appendChild(row);
  }
  table.appendChild(tbody);
  return table;
}
