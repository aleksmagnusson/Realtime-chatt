const db = require("../db/db");

// GET ALL ROOMS, SELECT * FROM rooms.

function getRooms() {
  const sql = "SELECT * from rooms";
  return new Promise((resolve, reject) => {
    db.all(sql, (error, rows) => {
      if (error) {
        console.error(error.message);
        reject(error);
      }
      resolve(rows);
    });
  });
}

// GET ONE ROOM, INSERT INTO rooms (room) VALUES ?.

function addRoom(timestamp) {
  const sql = "INSERT INTO rooms (timestamp) VALUES (?)";
  return new Promise((resolve, reject) => {
    db.run(sql, [timestamp], (error) => {
      if (error) {
        console.error(error.message);
        reject(error);
      }
      resolve();
    });
  });
}

module.exports = {
  getRooms,
  addRoom,
};
