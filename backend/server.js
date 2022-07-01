const express = require("express");
const { fstat } = require("fs");
const app = express();
const port = 4000;
const http = require("http");
const { Server } = require("socket.io");
const server = http.createServer(app);
const messageModel = require("./models/messageData.model");
const roomModel = require("./models/roomData.model");
const fs = require("fs");

const rooms = {
  default: {
    name: "Default room",
    state: [],
  },
};

const username = {
  default: {
    name: "Default user",
    state: [],
  },
};

// Lägg till cors med socket.io
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// socket connection / anslutning.
io.on("connection", (socket) => {
  console.log(`${socket.id} har anslutit.`);

  // Lägga till middleware.
  // message, username, room och (timestamp Date())
  socket.use(([event, ...args], next) => {
    if (event === "message") {
      console.log(event, args);

      const data = JSON.stringify({
        timestamp: Date(),
        room: socket.currentRoom,
        username: socket.username,
        message: args[0],
      });
      console.log(data);
      fs.writeFile("data_log.txt", data, { flag: "a" }, (error) => {
        if (error) {
          console.log(error);
        } else {
          console.log("data skrevs till data_log.txt");
        }
      });
    }
    console.log(event);
    next();
  });

  // Skapa rum med hjälp av socket.on.
  socket.on("create_room", (room) => {
    console.log(`Rum "${room}" har skapats`);

    const timestamp = Date();

    roomModel.addRoom(timestamp);
    // Kallar på rum och skriver ut rooms(?).
    socket.emit("create_room", room);
  });

  // socket.io | socket.join room
  socket.on("join_room", (room) => {
    socket.leave(socket.currentRoom);

    socket.join(room);
    socket.currentRoom = room;
    console.log(`${socket.username} har gått med i rum: ${room}`);
  });

  // socket.io | socket.leave room.
  socket.on("leave_room", (room) => {
    socket.currentRoom = "";

    socket.leave(room);
    console.log(`${socket.username} har lämnat rum: ${room}`);
  });

  // socket.io | socket.delete room.
  socket.on("delete_room", (room) => {
    socket.currentRoom = "";

    // Den "console.loggar" när man ansluter.
    // console.log(room, socket.currentRoom);
    roomModel.deleteRoom(room);
    console.log(`${socket.username} har tagit bort ${room}.`);
  });

  // Användare och användarnamn.
  socket.on("username", (username) => {
    socket.username = username;
    console.log(`Användare: ${socket.username} har anslutit.`);
    // Både username och socket.id kallas när jag startar servern.
  });

  // meddelanden
  // message är en "string".
  socket.on("message", (message) => {
    // Koll om tomt meddelande.
    if (!message || message.value.trim().length === 0) {
      alert("Du kan inte skicka ett tomt meddelande!");
    } else {
      console.log(`${socket.username} har skickat meddelande: ${message}`);

      const timestamp = Date();

      messageModel.addMessage(
        message,
        socket.username,
        socket.currentRoom,
        timestamp
      );

      console.log(socket.username, "skickade", message);

      io.in(socket.currentRoom).emit("message", {
        message: message,
        username: socket.username,
      });
    }
  });

  // socket.io | disconnect / avbryter.
  socket.on("disconnect", (reason) => {
    console.log(`Servern avbröts. Anledning: ${reason}`);
  });
});

io.listen(4000);
console.log("Servern körs på port 4000, tryck CTRL + C för att avsluta.");
