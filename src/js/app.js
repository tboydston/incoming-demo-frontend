const dataURL = "https://incoming-demo.optimalprime.com/data/depositData.json";
const refreshPeriod = 20000;

async function loadData() {
  try {
    const depositDataResponse = await fetch(dataURL);

    let depositData = await depositDataResponse.json();

    updateChainData(depositData, "BTC");
    updateChainData(depositData, "TBTC");

    document.getElementById(
      `lastDataRefresh`
    ).innerHTML = `Data refreshes every ${
      refreshPeriod / 1000
    } seconds. <br> Last Refresh: ${new Date()}`;
  } catch (error) {
    console.error("Error:", error);
  }

  setTimeout(loadData, refreshPeriod);
}

function updateChainData(depositData, coin) {
  const coinDataName = coin === "TBTC" ? "BTCt" : coin;

  document.getElementById(`${coin}-address-table`).innerHTML = "";
  document.getElementById(`${coin}-deposit-table`).innerHTML = "";

  const coinData = depositData[coinDataName];

  let addressTable = createAddressesTable(
    depositData[coinDataName].addresses,
    coin
  );
  let depositTable = createDepositsTable(depositData[coinDataName], coin);

  document.getElementById(`${coin}-chainHeight`).innerHTML =
    coinData.chainHeight;
  document.getElementById(`${coin}-highestDepositBlock`).innerHTML =
    coinData.highestDepositBlock;
  document.getElementById(`${coin}-lastBlockTime`).innerHTML = new Date(
    coinData.lastBlockTime
  );
  document.getElementById(`${coin}-lastDepositTime`).innerHTML = new Date(
    coinData.lastDepositTime
  );

  document.getElementById(`${coin}-address-table`).appendChild(addressTable);
  document.getElementById(`${coin}-deposit-table`).appendChild(depositTable);
}

function createAddressesTable(data, chainName) {
  let linkName = chainName === "TBTC" ? "btc-testnet" : "btc";

  let table = document.createElement("table");
  let tbody = document.createElement("tbody");

  table.classList.add("table");
  table.classList.add("table-striped");

  let headerRow = document.createElement("tr");
  let pathHeader = document.createElement("th");

  pathHeader.textContent = "Path";
  headerRow.appendChild(pathHeader);
  let addressHeader = document.createElement("th");
  addressHeader.textContent = "Address";
  headerRow.appendChild(addressHeader);
  table.appendChild(headerRow);

  for (let item of data) {
    let addLink = `<a href="https://live.blockcypher.com/${linkName}/address/${item.address}" target="_blank" >${item.address}</a>`;

    let row = document.createElement("tr");
    let pathCell = document.createElement("td");
    pathCell.textContent = item.path;
    row.appendChild(pathCell);
    let addressCell = document.createElement("td");
    addressCell.innerHTML = addLink;
    row.appendChild(addressCell);
    tbody.appendChild(row);
  }

  table.appendChild(tbody);
  return table;
}

function createDepositsTable(chainData, chainName) {
  let data = chainData.deposits;

  let linkName = chainName === "TBTC" ? "btc-testnet" : "btc";

  let table = document.createElement("table");
  let tbody = document.createElement("tbody");

  table.classList.add("table");
  table.classList.add("table-striped");

  let headerRow = document.createElement("tr");

  let blockHeader = document.createElement("th");
  blockHeader.textContent = "Block";

  let confirmationsHeader = document.createElement("th");
  confirmationsHeader.textContent = "Confirmations";

  let txIdHeader = document.createElement("th");
  txIdHeader.textContent = "Txid";

  let addressHeader = document.createElement("th");
  addressHeader.textContent = "Address";

  let amountHeader = document.createElement("th");
  amountHeader.textContent = "Amount";

  headerRow.appendChild(blockHeader);
  headerRow.appendChild(confirmationsHeader);
  headerRow.appendChild(txIdHeader);
  headerRow.appendChild(addressHeader);
  headerRow.appendChild(amountHeader);

  table.appendChild(headerRow);

  for (let item of data) {
    let blockLink = `<a href="https://live.blockcypher.com/${linkName}/block/${item.block}" target="_blank" >${item.block}</a>`;
    let txLink = `<a href="https://live.blockcypher.com/${linkName}/tx/${
      item.txid
    }" target="_blank" >${item.txid.slice(0, 15)}...</a>`;
    let addLink = `<a href="https://live.blockcypher.com/${linkName}/address/${item.address}" target="_blank" >${item.address}</a>`;
    let confirmations =
      item.block === 0 ? "Unconfirmed" : chainData.chainHeight + 1 - item.block;

    let row = document.createElement("tr");

    let blockCell = document.createElement("td");
    blockCell.innerHTML = item.block === 0 ? "0" : blockLink;
    row.appendChild(blockCell);

    let confirmationsCell = document.createElement("td");
    confirmationsCell.textContent = confirmations;
    row.appendChild(confirmationsCell);

    let txIdCell = document.createElement("td");
    txIdCell.innerHTML = txLink;
    row.appendChild(txIdCell);

    let addressCell = document.createElement("td");
    addressCell.innerHTML = addLink;
    row.appendChild(addressCell);

    let amountCell = document.createElement("td");
    amountCell.textContent = item.amount;
    row.appendChild(amountCell);

    tbody.appendChild(row);
  }

  table.appendChild(tbody);
  return table;
}
