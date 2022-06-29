import { useState, useEffect } from 'react'
import { io } from "socket.io-client"
import './App.css'

let socket;

function App() {
  const [socketId, setSocketId] = useState("");
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [messageData, setMessageData] = useState([]);
  // const [user, setUser] = useState("");

  useEffect(() => {
    socket = io("http://localhost:4000")

    socket.on("connect", () => {
      socket.emit("ready");
      socket.emit("username", "aleks");
      socket.on("message", (Data) => {

        setMessageData((PrevMessage) => [...PrevMessage, Data])
      });
    });
  }, []);


  function createRoom() {
    // Använder en prompt/popup ruta.
    const room = prompt("Vad vill du namnge rummet?");
    // Socket -global används här.
    socket.emit("create_room", room);
    console.log(room);
  }

  // Skapa användare och namnge användare.
  function createUser() {
    const username = prompt("Ange ditt användarnamn:");
    socket.emit("username", username);
    console.log(username);
  }

  // Skicka meddelande.
  function handleMessage() {

    socket.emit("message", message);
  }

  function leaveRoom(room) {
    socket.emit("leave_room", room);
  }

  function joinRoom() {
    // Använder en prompt/popup ruta.
    const room = prompt("Vilket room vill du gå med i?");
    socket.emit("join_room", room);
    console.log("Du har gått med i rum: " + room);
  }

  return (
    <div className="App">
      <header className="App-header">
        <p>Realtime Chat K3</p>
        <form id="form" action="" onSubmit={(e) => e.preventDefault()}></form>

        <body className="App-body">
          <ul id="message">{messageData.map((message) => {
            return <li>{message}</li>
          })}</ul>

          <input id='message' type="text" value={message}
            placeholder="Skicka meddelande" onChange={(e) => setMessage(e.target.value)} />
          <button type='submit' onClick={() => handleMessage()}>Skicka</button>
          <br />

          <button onClick={() => createUser("user")}>Skapa Användare</button>

          <button onClick={() => createRoom("room")}>Skapa rum</button>
          <button onClick={() => joinRoom("room")}>Gå med i rum</button>
          <button onClick={() => leaveRoom("room")}>Lämna rum</button>
        </body>
      </header>
    </div>
  )
}

export default App
