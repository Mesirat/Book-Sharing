import { Server } from 'socket.io';
import { JoinGroup, LeaveGroup, getUsersInGroup } from './controllers/groupController.js';
import { Message } from './models/messageModel.js';
import {Group} from './models/groupModel.js';

export const initSocket = (server, corsOptions) => {
  const io = new Server(server, {
    cors: corsOptions,
  });

  io.on('connection', (socket) => {
    let currentGroup = null;
    let userId = null;

    socket.on('joinGroup', async (groupName, _userId, userName) => {
      if (!groupName || !_userId || !userName) {
        socket.emit('error', 'Invalid group join request.');
        return;
      }

      try {
        await JoinGroup(groupName, _userId, userName);
        currentGroup = groupName;
        userId = _userId;

        socket.join(groupName);
        console.log(`${userName} joined ${groupName}`);

        
        const messages = await Message.find({ groupName }).sort({ createdAt: 1 }).exec();
        socket.emit('loadHistory', messages);

       
        const users = await getUsersInGroup(groupName);
        io.to(groupName).emit('userListUpdate', users);
      } catch (error) {
        console.error('Error joining group:', error.message);
        socket.emit('error', 'An error occurred while joining the group.');
      }
    });

    socket.on('sendMessage', async (message) => {
      if (!currentGroup) {
        socket.emit('error', 'You are not in a group.');
        return;
      }

      if (!message || !message.text || !message.sender) {
        socket.emit('error', 'Invalid message data.');
        return;
      }

      const { groupName, sender, text } = message;

      try {
        const newMessage = await Message.create({ groupName, sender, text });

       
        io.to(groupName).emit('receiveMessage', newMessage);

       
        socket.emit('messageSent', { success: true, message: newMessage });
      } catch (error) {
        console.error('Error sending message:', error.message);
        socket.emit('error', 'Message could not be sent.');
      }
    });

    socket.on('leaveGroup', async (groupName, leavingUserId, callback) => {
      try {
        const group = await Group.findOneAndUpdate(
          { name: groupName, members: leavingUserId },
          { $pull: { members: leavingUserId } },
          { new: true }
        );

        if (!group) {
          return callback?.({ error: 'User is not part of this group.' });
        }

        socket.leave(groupName);
        console.log(`${leavingUserId} left ${groupName}`);

        const users = await getUsersInGroup(groupName);
        io.to(groupName).emit('userListUpdate', users);
        callback?.({ success: true });
      } catch (error) {
        console.error('Error leaving group:', error.message);
        callback?.({ error: 'An error occurred while leaving the group.' });
      }
    });

    socket.on('disconnect', async () => {
      if (currentGroup && userId) {
        console.log(`Client disconnected: ${socket.id} from group ${currentGroup}`);
        try {
          await LeaveGroup(userId, currentGroup);
          const users = await getUsersInGroup(currentGroup);
          io.to(currentGroup).emit('userListUpdate', users);
        } catch (error) {
          console.error('Error during disconnect cleanup:', error.message);
        }
      }
    });
  });

  return io;
};
