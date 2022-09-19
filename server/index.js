const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("có người kết nối")
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`User with ID: ${socket.id} joined room: ${data}`);
  });

  socket.on("su-kien-click", (data) => {
    let vitri = mangUser.indexOf(socket.Username)
    socket.to(data.room).emit("server-send-data", {name: socket.Username,data,nguoichoi:vitri} );
  console.log(data)
});

});

server.listen(3001, () => {
  console.log("SERVER RUNNING");
})
