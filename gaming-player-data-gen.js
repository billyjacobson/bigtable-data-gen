/**
 * set up
 * cbt createtable playerData
 * cbt createfamily playerData Demographics
 * cbt createfamily playerData Matchmaking
 * cbt import playerData player-data-5000.csv
 * 
 * Or for larger datasets use a larger batch size
 * cbt import playerData player-data-5000000.csv workers=5 batch-size=5000
*/
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const { faker } = require('@faker-js/faker');
const prependFile = require('prepend-file');
const {v4: uuidv4} = require('uuid');


const NUM_PLAYERS = 5_000;

const PLAYERS = [];
for (let i = 0; i < NUM_PLAYERS; i++) {
  PLAYERS[i] = {
    id: getPlayerId(i),
    username: faker.internet.userName(),
    email: faker.internet.email(),
    location: faker.address.country(),
    role_DPS: getRandomInt(500),
    role_Tank: getRandomInt(500),
    role_Support: getRandomInt(500),
    MMR: getRandomInt(5),
  }
}

function getPlayerId(num) {
  let paddedNum = ("000000000000"+num).slice(-12);
  return paddedNum.split('').reverse().join('');
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


async function generatePlayerDataCSV(players) {
  let path = `./player-data-${NUM_PLAYERS}.csv`;
  let columnFamilies = [];
  columnFamilies[1] = "Demographics";
  columnFamilies[4] = "Matchmaking";
  let header = ["", 
  "username", // Demographics cf
  "location",
  "email",
  "role_DPS", // Matchmaking data cf
  "role_Tank",
  "role_Support",
  "MMR",
  ];
  //Make header a map so it adds header row
  header = header.map(h => ({id: h, title: h}));

  const csvWriter = createCsvWriter({
    path,
    header
  });


  players.map((p) => {
    p[""] = p.id;
    return p;
  });
  
  csvWriter.writeRecords(players)
  .then(() => {
    console.log( `Wrote ${players.length} rows` ) ;
  });

  addColumnFamilies(header.length, columnFamilies, path);
}

generatePlayerDataCSV(PLAYERS);
