import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import Game from './components/Game'
import io from "socket.io-client";
const socket = io.connect("http://localhost:3001");

function App() {

  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const  [ showChat ,  setShowChat ]  =  useState ( false ) ;

  const joinRoom = () => {
    if (username !== "" && room !== "") {
      socket.emit("join_room", room);
      setShowChat(true);
    }
  };

  return (
    <div className="App">
      {!showChat ? (
        <div className="joinChatContainer">
          <h3>Phòng Game</h3>
          <input
            type="text"
            placeholder="John..."
            onChange={(event) => {
              setUsername(event.target.value);
            }}
          />
          <input
            type="text"
            placeholder="Room ID..."
            onChange={(event) => {
              setRoom(event.target.value);
            }}
          />
          <button onClick={joinRoom}>Vào Phòng Game</button>
        </div>
      ) : (
        <Game socket={socket} username={username} room={room} />
      )}
    </div>
  );
}

export default App;