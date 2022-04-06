import devServer from './server/dev';
import prodServer from './server/prod';
import express from 'express';
import { Server } from 'socket.io';
import http from 'http';
import UserService from '@/service/UserService';

import { name } from '@/utils';

const port = 3000;
const app = express();
const server = http.createServer(app);
const serverIo = new Server(server);

serverIo.on('connection', (socket) => {
  socket.emit('join', {
    text: `Welcome to ${name} chatroom`,
  });

  socket.on('chat', (msg) => {
    serverIo.emit('chat', msg);
  });
});

// 執行npm run dev本地開發 or 執行npm run start部署後啟動線上伺服器
if (process.env.NODE_ENV === 'development') {
  devServer(app);
} else {
  prodServer(app);
}

console.log('server side', name);

server.listen(port, () => {
  console.log(`The application is running on port ${port}.`);
});
