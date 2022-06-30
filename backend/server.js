const express = require("express");
const app = express();
const port = 4000;
const http = require("http");
const { Server } = require("socket.io");
const server = http.createServer(app);
const messageModel = require("./models/messageData.model");
const roomModel = require("./models/roomData.model");

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
  console.log(`${socket.id} har anslutit`);

  // Skapa rum med hjälp av socket.on.
  socket.on("create_room", (room) => {
    console.log(`Rum "${room}" har skapats`);
    socket.currentRoom = room;

    const timestamp = Date();

    roomModel.addRoom(timestamp);
    // Kallar på rum och skriver ut rooms(?).
    socket.emit("create_room", room);
  });

  // socket.io | socket.join room
  socket.on("join_room", (room) => {
    socket.currentRoom = room;

    socket.leave(socket.currentRoom);

    console.log(socket.currentRoom);
    console.log(`${socket.username} har gått med i rum: ${room}`);
  });

  // socket.io | socket.leave room.
  socket.on("leave_room", (room) => {
    socket.currentRoom = room;

    console.log(room);
    socket.leave(socket.currentRoom);
    console.log(`${socket.username} har lämnat rum: ${socket.currentRoom}`);
  });

  // socket.io | socket.delete room.
  socket.on("delete_room", (room) => {
    socket.currentRoom = room;

    // Den "console.loggar" när man ansluter.
    // console.log(room, socket.currentRoom);

    roomModel.deleteRoom(socket.currentRoom);
    io.emit("delete_room");
    console.log(`${socket.username} har lämnat ${socket.currentRoom}`);
  });

  // meddelanden
  socket.on("message", (message) => {
    console.log(`${socket.username} har skickat meddelande: ${message}`);

    const timestamp = Date();

    messageModel.addMessage(
      message,
      socket.username,
      socket.currentRoom,
      timestamp
    );
    console.log(socket.username, "skickade", message);

    io.in(socket.currentRoom).emit("message", message);
    // socket.emit(messageModel);
  });

  // Användare och användarnamn.
  socket.on("username", (username) => {
    socket.username = username;
    console.log(`Användare: ${socket.username} har anslutit`);
    // Både username och socket.id kallas när jag startar servern.
  });

  // socket.io | disconnect / avbryter.
  socket.on("disconnect", (reason) => {
    console.log(`Servern avbröts. Anledning: ${reason}`);
  });
});

io.listen(4000);
console.log("Servern körs på port 4000, tryck CTRL + C för att avsluta.");
