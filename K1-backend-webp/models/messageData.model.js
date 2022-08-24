const db = require("../db/db");

// GET ALL MESSAGES, SELECT * FROM messages.

function getAllMessages(message) {
  const sql = "SELECT * FROM message";
  return new Promise((resolve, reject) => {
    db.all(sql, [message], (error) => {
      if (error) {
        console.error(error.message);
        reject(error);
      }
      resolve();
    });
  });
}
// Denna är mer korrekt gå efter denna.
// function /klassNamn/(samma data som i db.js)
function addMessage(message, username, rooms, timestamp) {
  const sql =
    "INSERT INTO messages (message, username, rooms, timestamp) VALUES ( ?, ?, ?, ?)";
  return new Promise((resolve, reject) => {
    db.run(sql, [message, username, rooms, timestamp], (error) => {
      if (error) {
        console.error(error.message);
        reject(error);
      }
      resolve();
    });
  });
}

// GET ALL MESSAGES FROM A ROOM?
// Behöver jag lägga till meddelande för enskilt rum?
// SELECT * FROM message WHERE currentRoom = ?

function getRoomMessage(currentRoom) {
  const sql = "SELECT * FROM message WHERE rooms = ?";
  return new Promise((resolve, reject) => {
    db.all(sql, [currentRoom], (error, rows) => {
      if (error) {
        console.error(error.message);
      }
      resolve(rows);
    });
  });
}

function deleteMessages(room) {
  const sql = "DELETE from message WHERE rooms = ?";
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
  getAllMessages,
  getRoomMessage,
  addMessage,
  deleteMessages,
};
