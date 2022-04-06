import './index.css';
import { io } from 'socket.io-client';

const url = new URL(window.location.href);
const userName = url.searchParams.get('user_name');
const roomName = url.searchParams.get('room_name');

if (!userName || !roomName) {
  window.location.href = '/main/main.html';
}
const clientIo = io('http://localhost:3000');

clientIo.emit('join', { userName, roomName });

const headerRoomName = document.querySelector('#headerRoomName') as HTMLParagraphElement;
const backBtn = document.querySelector('#backBtn') as HTMLButtonElement;
const textInput = document.querySelector('#textInput') as HTMLInputElement;
const submitBtn = document.querySelector('#submitBtn') as HTMLButtonElement;
const chatBoard = document.querySelector('#chatBoard') as HTMLDivElement;

headerRoomName.innerText = roomName || ' - ';

const msgHandler = (msg: string) => {
  const msgItem = document.createElement('div');
  msgItem.classList.add('flex', 'justify-end', 'mb-4', 'items-end');
  msgItem.innerHTML = `
    <p class="text-xs text-gray-700 mr-4">00:00</p>
    <div>
      <p class="text-xs text-white mb-1 text-right">${userName}</p>
      <p class="mx-w-[50%] break-all bg-white px-4 py-2 rounded-bl-full rounded-br-full rounded-tl-full">
        ${msg}
      </p>
    </div>
  `;
  chatBoard.appendChild(msgItem);
  textInput.value = '';
  chatBoard.scrollTop = chatBoard.scrollHeight;
};

const roomMsgHandler = (msg: string) => {
  const msgItem = document.createElement('div');
  msgItem.classList.add('flex', 'justify-center', 'mb-4', 'items-center');
  msgItem.innerHTML = `
  <p class="text-gray-700 text-sm">${msg}</p>
  `;
  chatBoard.appendChild(msgItem);
  chatBoard.scrollTop = chatBoard.scrollHeight;
};

backBtn.addEventListener('click', () => {
  window.location.href = '/main/main.html';
});

submitBtn.addEventListener('click', (e) => {
  const text = textInput.value;

  if (text) {
    clientIo.emit('chat', text);
  }
});

clientIo.on('chat', (msg) => {
  msgHandler(msg);
});

clientIo.on('join', (msg) => {
  roomMsgHandler(msg);
});

clientIo.on('leave', (msg) => {
  roomMsgHandler(msg);
});
