// const createCsvWriter = require('csv-writer').createObjectCsvWriter;
// const prependFile = require('prepend-file');
//
// const { v4: uuidv4 } = require('uuid');
//
// const COLORS = ["red", "orange", "yellow", "green", "blue", "purple"];
// const ITEMS = ["blouse", "skirt", "dress", "hat", "shoes", "jacket"];
// const NUM_CUSTOMERS = 250;
// const NUM_RECOMMENDATIONS = 4;
//
//
// function getRandomInt(max) {
//   return Math.floor(Math.random() * max);
// }
//
// const ALL_PRODUCTS = COLORS.flatMap(c => ITEMS.map(i => c+"_"+i));
//
// const recs = new Array(NUM_RECOMMENDATIONS).fill(0).map((v,i) => "Recommendation"+i);
// console.log(recs);
// header = ["", ...recs];
//
// let path = `./retail-recommendations-${NUM_CUSTOMERS}.csv`;
// //Make header a map so it adds header row
// header = header.map(h => ({id: h, title:h}));
//
// let csvWriter = createCsvWriter({
//     path,
//     header,
// });
//
// let records = [];
// for (let i = 0; i < NUM_CUSTOMERS; i++) {
//     let record = {
//         "": uuidv4()
//     }
//
//     for (let i = 0; i < NUM_RECOMMENDATIONS; i++) {
//         record[`Recommendation${i}`] = ALL_PRODUCTS[getRandomInt(ALL_PRODUCTS.length)];
//     }
//     records.push(record);
//
// }
//
// csvWriter.writeRecords(records)
// .then(() => {
//     console.log('Wrote ' + records.length);
// });
//
//
// const COLUMN_FAMILIES = {
//     1: "Recommendations"
// }
//
// const CF_HEADER = header.map((v, i) => COLUMN_FAMILIES[i] || "").join(",");
//
// prependFile(path, `${CF_HEADER}\n`, () => {
//   console.log('added column families successfully');
// })
