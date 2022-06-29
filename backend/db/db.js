const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./sqlite.db", (error) => {
  if (error) {
    console.log(error.message);
    throw error;
  }
});
// Får fel från "CREATE TABLE IF NOT EXISTS messages".
// SQL error
const messageData = ` CREATE TABLE IF NOT EXISTS messages ( 
 id INTEGER PRIMARY KEY AUTOINCREMENT,
 message TEXT,
 username TEXT,
 rooms TEXT,
 timestamp DATE
)`;

// const userData = ` CREATE TABLE IF NOT EXISTS users (
//  id INTEGER PRIMARY KEY AUTOINCREMENT,
//  username TEXT PRIMARY KEY,
//  current_room TEXT
// )`;

const roomData = ` CREATE TABLE IF NOT EXISTS rooms (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  timestamp DATE
)`;

db.run(messageData, (error) => {
  if (error) {
    console.error(error.message);
    throw error;
  } else {
    console.log("messageData databasen har blivit skapad");
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

db.run(roomData, (error) => {
  if (error) {
    console.error(error.message);
    throw error;
  } else {
    console.log("room databas har blivit skapad");
  }
});

module.exports = db;
