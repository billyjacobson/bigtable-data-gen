const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const prependFile = require('prepend-file');
const {v4: uuidv4} = require('uuid');

const COLORS = ["red", "orange", "yellow", "green", "blue", "purple"];
const ITEMS = ["blouse", "skirt", "dress", "hat", "shoes", "jacket"];
const NUM_CUSTOMERS = 5_000;
const TRANSACTIONS_FACTOR = 4;
const NUM_RECOMMENDATIONS = 4;
const NUM_TRANSACTIONS = NUM_CUSTOMERS * TRANSACTIONS_FACTOR;

const CUSTOMERS = [];
for (let i = 0; i < NUM_CUSTOMERS; i++) {
  let colorI = getRandomInt(COLORS.length);
  let itemI = getRandomInt(ITEMS.length);

  CUSTOMERS[i] = {
    color: COLORS[colorI],
    item: ITEMS[itemI],
    id: getRandomInt(NUM_CUSTOMERS)
  }
}
const ALL_PRODUCTS = COLORS.flatMap(c => ITEMS.map(i => c + "_" + i));

function getCustomerId(customer) {
  return customer.color + customer.id;
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function addColumnFamilies(numCols, columnFamilies, path) {
  let cfHeader = [];
  for (let i = 0; i < numCols; i++) {
    cfHeader[i] = columnFamilies[i] || "";
  }
  cfHeader = cfHeader.join(",");

  prependFile(path, `${cfHeader}\n`, () => {
    console.log('added column families successfully');
  })
}

function getPossibleItems(customer) {
  return ITEMS.map(i => customer.color + "_" + i);
}

function generateTransactionCSV(customers, numTransactions) {
  let path = `./retail-transactions-${NUM_TRANSACTIONS}.csv`;
  let header = ["", "user_id", ...ALL_PRODUCTS, "sale"];
  //Make header a map so it adds header row
  header = header.map(h => ({id: h, title: h}));

  const csvWriter = createCsvWriter({
    path,
    header
  });

  let records = [];
  for (let i = 0; i < NUM_TRANSACTIONS; i++) {
    let customer = customers[getRandomInt(customers.length)];
    let user_id = getCustomerId(customer);
    let record = {
      "": user_id + "#" + Date.now(),
      user_id,
      sale: [],
    }

    let possibleItems = getPossibleItems(customer);

    for (let t = 0; t < 10; t++) {
      let curItem = ALL_PRODUCTS[getRandomInt(ALL_PRODUCTS.length)];
      record[curItem] = "seen";
      if (possibleItems.includes(curItem)) {
        record[curItem] = "viewed details";
        if (Math.random() < .5) {
          record.sale.push(curItem);
          record[curItem] = "purchased";
        }
      }
    }
    record.sale = record.sale.join("#");
    records.push(record);
  }

  csvWriter.writeRecords(records)
      .then(() => {
        console.log( `Wrote ${records.length} transactions` ) ;
      });

  const columnFamilies = [];
  columnFamilies[1] = "Engagements";
  columnFamilies[header.length - 1] = "Sales";

  addColumnFamilies(header.length, columnFamilies, path);
}

function generateRecommendationsCSV(customers) {
  const recs = new Array(NUM_RECOMMENDATIONS).fill(0).map(
      (v, i) => "Recommendation" + i);
  let header = ["", ...recs];

  let path = `./retail-recommendations-${NUM_CUSTOMERS}.csv`;
  //Make header a map so it adds header row
  header = header.map(h => ({id: h, title: h}));

  let csvWriter = createCsvWriter({
    path,
    header,
  });

  let records = [];
  customers.forEach(customer => {
    let record = {
      "": getCustomerId(customer)
    }

    let possibleItems = getPossibleItems(customer);

    for (let i = 0; i < NUM_RECOMMENDATIONS; i++) {
      // let curItem = ALL_PRODUCTS[getRandomInt(ALL_PRODUCTS.length)];
      let randomInt = getRandomInt(possibleItems.length);
      let curItem = possibleItems[randomInt];
      record[`Recommendation${i}`] = curItem;
      possibleItems.splice(randomInt,1);
      // if (possibleItems.includes(curItem)) {
      //   record[curItem] = "viewed details";
      // }
    }

    records.push(record);
  });

  csvWriter.writeRecords(records)
      .then(() => {
        console.log( `Wrote ${records.length} recommendations` ) ;
      });

  const columnFamilies = {
    1: "Recommendations"
  }
  addColumnFamilies(header.length, columnFamilies, path);
}

generateTransactionCSV(CUSTOMERS, NUM_TRANSACTIONS);
generateRecommendationsCSV(CUSTOMERS);