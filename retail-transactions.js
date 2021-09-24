const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const COLORS = ["red", "orange", "yellow", "green", "blue", "purple"];
const ITEMS = ["blouse", "skirt", "dress", "hat", "shoes", "jacket"];
const NUM_CUSTOMERS = 250;
const NUM_TRANSACTIONS = NUM_CUSTOMERS * 2;


const ALL_PRODUCTS = COLORS.flatMap(c => ITEMS.map(i => c+"_"+i));
header = ["id", "user_id", ...ALL_PRODUCTS, "sale"];
// console.log(header);

//Make header a map so it adds header row
header = header.map(h => ({id: h, title:h}));

const csvWriter = createCsvWriter({
    path: './retail-transactions.csv',
    header
});

let shoppers = [];
for (let i = 0; i < NUM_CUSTOMERS; i++) {
  let colorI = getRandomInt(COLORS.length);
  let itemI = getRandomInt(ITEMS.length);

  shoppers[i] = {
    color: COLORS[colorI],
    item: ITEMS[itemI],

}
}

let records = [];
let recordCount = 0;
for (let i = 0; i < NUM_TRANSACTIONS; i++) {
    let shopperI = getRandomInt(shoppers.length);
    let shopper = shoppers[shopperI]
    let user_id =shopper.color+shopperI;
    let record = {
        id: user_id+Date.now(),
        user_id,
        sale: [],
    }

    let possibleItems = ITEMS.map(i => shopper.color +"_"+i);

    for (let t = 0; t<10; t++) {
        let curItem = ALL_PRODUCTS[getRandomInt(ALL_PRODUCTS.length)];
        record[curItem] = 1;
        if (possibleItems.includes(curItem)) {
            record[curItem] = 3;
            if (Math.random() < .5) {
                record.sale.push(curItem);
                record[curItem] = 5;
            }
        }
    }
    record.sale = record.sale.join("#");
    records.push(record);
}

recordCount += records.length;
csvWriter.writeRecords(records)
.then(() => {
    console.log('Wrote ' + recordCount);
});

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}



// const records = [
// {name: 'Bob',  lang: 'French, English'},
// {name: 'Mary', lang: 'English'}
// ];

// csvWriter.writeRecords(records)       // returns a promise
// .then(() => {
//     console.log('...Done');
// });

// csvWriter.writeRecords(records)       // returns a promise
// .then(() => {
//     console.log('...Done');
// });

