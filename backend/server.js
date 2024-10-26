const express = require("express");
const cors = require('cors');
const dotenv = require('dotenv');
const chats = require("./data/data");
const connectDB = require("./config/db");
const colors = require('colors');
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const messageRoutes = require('./routes/messageRoutes');
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const path = require('path');

dotenv.config();

connectDB();

const app = express();

app.use(cors());

app.use(express.json());



// app.get('/api/chat', (req, res) => {
//     res.send(chats);
// });

// app.get('/api/chat/:id', (req, res) => {
//     const singleChat = chats.find(c => c._id === req.params.id);
//     res.json(singleChat);
// });


app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/message', messageRoutes);

// ------------------------Deployment----------------------

const __dirname1 = path.resolve();

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname1, "/frontend/build")));
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname1, "frontend", "build", "index.html"));
    })
} else {
    app.get('/', (req, res) => {
        res.send('API is Running Successfully');
    });
}

// ------------------------Deployment----------------------
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
    console.log(`Server is successfully runnning on port ${PORT}`.blue.bold);
});

const io = require('socket.io')(server, {
    pingTimeout: 60000,
    cors: {
        origin: 'http://localhost:3001'
    }
});

io.on("connection", (socket) => {
    console.log("Connected to socket.io");

    socket.on('setup', (userData) => {
        socket.join(userData._id);
        socket.emit('connected');
    });

    socket.on('join chat', (room) => {
        socket.join(room);
        console.log(`User Joined Room ${room}`);
    }); 

    socket.on('typing', (room) => {
        socket.in(room).emit("typing");
    });

    socket.on('stop typing', (room) => {
        socket.in(room).emit("stop typing");
    });

    socket.on('new message', (newMessageReceived) => {
        let chat = newMessageReceived.chat;

        if (!chat.users) return console.log(`chat.users not defined`);

        chat.users.forEach(user => {
            if (user._id === newMessageReceived.sender._id) return;

            socket.in(user._id).emit('message received', newMessageReceived);
        });
    });

    socket.off("setup", () => {
        console.log('USER DISCONNECTED');
        socket.leave(userData._id);
    });
});