const express = require('express');
const app=express();
const cors=require('cors');

module.exports.chatSockets=function(socketServer){
    // let io= require('socket.io')(socketServer);
    let io= require('socket.io')(socketServer,{
        cors:{
            origin:"http://localhost:8000",
            credentials: true,
            methods: ["GET", "POST"],
        },
        allowEIO3: true
    })
// io.connect use connection, it is predefined
    io.sockets.on('connection',function(socket){
        console.log('new connection recieved ', socket.id);


        socket.on('disconnect',function(){
            console.log('socket disconnected');
        });

         socket.on('join_room',function(data){
            console.log('joining request',data);

            socket.join(data.chatroom);
            io.in(data.chatroom).emit('user_joined',data);
         });
         
         //detect send message and broadcast it to evryone present in the chat room
         socket.on('send_message',function(data){
            io.in(data.chatroom).emit('receive_message',data);
         });

    });
    app.use(cors(io));
}
