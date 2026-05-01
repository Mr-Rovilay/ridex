import express from "express"
import dotenv from "dotenv"
import connectDB from "./lib/db.js"
import cors from "cors"
import http from "http"
import { Server } from "socket.io"  // <-- This is the Socket.IO Server, not http
import User from "./models/userModel.js"
import mongoose from "mongoose"

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

    socket.on("identity", async (userId) => {
       // 1. Unwrap if client sent { data: id }
       const id = typeof userId === 'object' && userId?.data ? userId.data : userId
       
       // 2. Validate it's a real ObjectId
       if (!mongoose.Types.ObjectId.isValid(id)) {
         console.log("Invalid userId received:", userId)
         return socket.emit("error", "Invalid user ID")
       }

       try {
         await User.findByIdAndUpdate(id, {
           socketId: socket.id,
           isOnline: true
         })
         console.log(`User ${id} is online with socket ${socket.id}`)
       } catch (err) {
         console.error("DB update failed:", err.message)
       }
    })
    socket.on("update-location", async ({userId,latitude, longitude})=>{
      await User.findByIdAndUpdate(userId,{
        location:{
          type:"Point",
          coordinates:[longitude,latitude]
        }
      })
    })

    // 3. Handle disconnect to set isOnline: false
    socket.on("disconnect", async () => {
      await User.findOneAndUpdate(
        { socketId: socket.id }, 
        { isOnline: false, socketId: null }
      )
      console.log(`Socket ${socket.id} disconnected`)
    })
})

connectDB()
  .then(() => {
    server.listen(port, () => {  // <-- Use server.listen, not app.listen
      console.log(`Server listening on port ${port}`)
    })
  })
  .catch((err) => {
    console.error("Failed to connect to the database", err)
  })