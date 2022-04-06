import express from 'express';
import { Server } from 'socket.io';
import http from 'http';
import devServer from '@/server/dev';
import prodServer from '@/server/prod';
import UserService from '@/service/UserService';

import { name } from '@/utils';
import { io } from 'socket.io-client';

const port = 3000;
const app = express();
const server = http.createServer(app);
const serverIo = new Server(server);
const userService = new UserService();

serverIo.on('connection', (socket) => {
  socket.on('join', ({ userName, roomName }: { userName: string; roomName: string }) => {
    const user = userService.userDataInfoHandler(socket.id, userName, roomName);
    userService.addUser(user);

    serverIo.emit('join', `${userName} 加入了 ${roomName}`);
  });

  socket.on('chat', (msg) => {
    serverIo.emit('chat', msg);
  });

  socket.on('disconnect', () => {
    const user = userService.getUser(socket.id);
    const userName = user?.userName || '有人';
    serverIo.emit('leave', `${userName} 離開聊天室`);

    userService.removeUser(socket.id);
  });
});

if (process.env.NODE_ENV === 'development') {
  devServer(app);
} else {
  prodServer(app);
}

console.log('server side', name);

server.listen(port, () => {
  console.log(`The application is running on port ${port}.`);
});
