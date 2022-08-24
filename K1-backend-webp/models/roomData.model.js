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

function addRoom(timestamp, rooms) {
  const sql = "INSERT INTO rooms (timestamp, rooms) VALUES (?, ?)";
  return new Promise((resolve, reject) => {
    db.run(sql, [timestamp, rooms], (error) => {
      if (error) {
        console.error(error.message);
        reject(error);
      }
      resolve();
    });
  });
}

// DELETE rooms, ta bort ett rum.

function deleteRoom(room) {
  const sql = "DELETE from rooms WHERE rooms = (?)";
  return new Promise((resolve, reject) => {
    db.run(sql, [room], (error, rows) => {
      if (error) {
        console.error(error.message);
        reject(error);
      }
      resolve(rows);
    });
  });
}

module.exports = {
  getRooms,
  addRoom,
  deleteRoom,
};
