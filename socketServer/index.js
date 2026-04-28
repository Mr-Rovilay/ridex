import express from "express"
import dotenv from "dotenv"
import connectDB from "./lib/db.ts"
import cors from "cors"
import http from "http"
import { Server } from "socket.io"  // <-- This is the Socket.IO Server, not http

dotenv.config()
const port = process.env.PORT || 5000
const app = express()

app.use(cors({
  origin: process.env.NEXT_BASE_URL,
  credentials: true
}))

const server = http.createServer(app) // create HTTP server with express
const io = new Server(server, {       // use Socket.IO Server here
  cors: {
    origin: process.env.NEXT_BASE_URL,
    methods: ["GET", "POST"]
  }
})

io.on("connection", (socket)=> {
    console.log(socket.id)
    socket.on("identity", (data)=>{
        console.log(data)
    })
})

// io.on("connection", (socket) => {
//   console.log("Client connected:", socket.id)
  
//   socket.on("disconnect", () => {
//     console.log("Client disconnected:", socket.id)
//   })
// })

connectDB()
  .then(() => {
    server.listen(port, () => {  // <-- Use server.listen, not app.listen
      console.log(`Server listening on port ${port}`)
    })
  })
  .catch((err) => {
    console.error("Failed to connect to the database", err)
  })