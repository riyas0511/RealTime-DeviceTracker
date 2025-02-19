 const express =require('express');
 const app = express();
 const http= require('http');
    const path = require('path');
 const socketio = require('socket.io');
 require("dotenv").config();
const mongoose = require("mongoose");
const Location = require("./models/location");
 const server = http.createServer(app);

 const io = socketio(server);

 app.set("view engine", "ejs");
 app.use(express.static(path.join(__dirname, "public")));

 //connect to mongodb
 mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log(" MongoDB Connected"))
.catch((err) => console.error(" MongoDB Connection Error:", err));

 io.on("connection", (socket) => {        //io function call is handled here by socket object
    socket.on("sendLocation", async (data) => {
        console.log(` Location received from ${socket.id}:`, data);

        // Save to MongoDB
        await Location.create({
            userId: socket.id,
            latitude: data.latitude,
            longitude: data.longitude,
        });
        // Broadcast location to all clients
        io.emit("locationMessage", {id : socket.id, ...data});
    });
    socket.on("disconnect", () => {
        io.emit("user-disconnected", {id: socket.id});
    });  
 });

 app.get("/", (req, res) => {
        res.render("index");
    });

 server.listen(3000, () => {
        console.log("Server is running on port 3000");
    });