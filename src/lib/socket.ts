import { io, Socket } from 'socket.io-client';
import { chatbotWorkflow } from '../app/chatbotWorkflow';
import ChatbotRepository from '../app/repositories/ChatbotRepository';
import {
  ClientToServerEvents,
  ServerToClientEvents,
} from '../types/SocketTypes';
import { parseWhatsappNumber } from '../utils/parseWhatsappNumber';

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  'https://gsafra-chatbot-server.onrender.com'
  // 'http://localhost:3000'
);

socket.on('connect', () => {
  console.log('Websocket connection established');
});

socket.on('disconnect', () => {
  console.log('Websocket disconnected');
});

socket.on('newUser', async (number) => {
  const parsedNumber = parseWhatsappNumber(number);
  const canResponse = await ChatbotRepository.findHasPermission(parsedNumber);

  socket.emit('newUserResponse', {
    number,
    canResponse,
    clientName: 'IRAN ADRYAN'
  });
});

socket.on('newMessage', async (body) => {
  await chatbotWorkflow(body);
});
