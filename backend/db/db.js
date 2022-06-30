const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./sqlite.db", (error) => {
  if (error) {
    console.log(error.message);
    throw error;
  }
});

// SQL databas som hämtar tabell för id, meddelande, användare, rum och tid den skapades.
const messageData = ` CREATE TABLE IF NOT EXISTS messages ( 
 id INTEGER PRIMARY KEY AUTOINCREMENT,
 message TEXT,
 username TEXT,
 rooms TEXT,
 timestamp DATE
)`;

// Databas för rum som hämtar id, rum, tid den skapades.
const roomData = ` CREATE TABLE IF NOT EXISTS rooms (
id INTEGER PRIMARY KEY AUTOINCREMENT,
rooms TEXT,
timestamp DATE
)`;

// const userData = ` CREATE TABLE IF NOT EXISTS users (
//  id INTEGER PRIMARY KEY AUTOINCREMENT,
//  username TEXT PRIMARY KEY,
//  current_room TEXT
// )`;

db.run(messageData, (error) => {
  if (error) {
    console.error(error.message);
    throw error;
  }
});

db.run(roomData, (error) => {
  if (error) {
    console.error(error.message);
    throw error;
  }
});

//db.run(userData, (error) => {
//  if (error) {
//    console.error(error.message);
//    throw error;
//  } else {
//    console.log("userData databasen har redan blivit skapad");
//  }
//});

module.exports = db;
