import express from 'express';
import { Server } from 'socket.io';
import http from 'http';
import moment from 'moment';
import devServer from '@/server/dev';
import prodServer from '@/server/prod';
import UserService from '@/service/UserService';

const port = 3000;
const app = express();
const server = http.createServer(app);
const serverIo = new Server(server);
const userService = new UserService();

type userInfo = {
  userName: string;
  roomName: string;
};

serverIo.on('connection', (socket) => {
  socket.emit('connected', socket.id);

  socket.on('join', ({ userName, roomName }: userInfo) => {
    const user = userService.userDataInfoHandler(socket.id, userName, roomName);
    userService.addUser(user);

    console.log(userName, roomName);
    socket.join(roomName);
    socket.broadcast.to(roomName).emit('join', `${userName} 加入了 ${roomName}`);
  });

  socket.on('chat', (msg) => {
    const time = moment.utc();
    const user = userService.getUser(socket.id);
    if (!user) return;

    const { roomName } = user;
    serverIo.to(roomName).emit('chat', { user, msg, time });
  });

  socket.on('disconnect', () => {
    const user = userService.getUser(socket.id);
    if (!user) return;

    const { userName, roomName } = user;
    userService.removeUser(socket.id);
    socket.broadcast.to(roomName).emit('leave', `${userName} 離開聊天室`);
  });
});

if (process.env.NODE_ENV === 'development') {
  devServer(app);
} else {
  prodServer(app);
}

server.listen(port, () => {
  console.log(`The application is running on port ${port}.`);
});
