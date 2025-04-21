// socket.js
import { Server } from 'socket.io';
import {JoinGroup, LeaveGroup, getUsersInGroup}  from './controllers/groupController.js';
import { Message } from './models/messageModel.js';
export const initSocket = (server, corsOptions) => {
  const io = new Server(server, {
    cors: corsOptions,
  });

  io.on('connection', (socket) => {
    let currentGroup = null;

    socket.on('joinGroup', async (groupName, username) => {
      currentGroup = groupName;
      try {
        await JoinGroup(socket.id, groupName, username);
        const users = await getUsersInGroup(groupName);

        socket.join(groupName);
        io.to(groupName).emit('userListUpdate', users);
        socket.emit('welcomeMessage', `Welcome to the ${groupName} group, ${username}!`);

        const messages = await Message.find({ groupName }).sort({ createdAt: 1 });
        socket.emit('loadHistory', messages);
      } catch (error) {
        console.error('Error joining group:', error);
        socket.emit('error', 'There was an error joining the group.');
      }
    });

    socket.on('sendMessage', (message) => {
      if (currentGroup) {
        io.to(currentGroup).emit('receiveMessage', message);

        const newMessage = new Message({
          groupName: currentGroup,
          sender: message.sender,
          content: message.content,
          createdAt: new Date(),
        });

        newMessage.save().catch(err => console.error('Error saving message:', err));
      }
    });

    socket.on('disconnect', async () => {
      if (currentGroup) {
        try {
          await LeaveGroup(socket.id, currentGroup);
          const users = await getUsersInGroup(currentGroup);
          io.to(currentGroup).emit('userListUpdate', users);
        } catch (error) {
          console.error('Error removing user from group:', error);
        }
      }
    });
  });

  return io;
};
