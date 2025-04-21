import { Server } from 'socket.io';
import { Group } from '../models/GroupModel.js';
import { Message } from '../models/messageModel.js';
import { JoinGroup, LeaveGroup, getUsersInGroup } from '../controller/GroupController.js';

const SocketHandler = (server) => {
  const io = new Server(server, {
    cors: {
      origin: ['http://localhost:5173', 'http://localhost:5173'],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
    },
  });

  const getGroupRoomName = (groupName) => `group_${groupName}`;

  const broadcastUserList = async (groupName) => {
    try {
      const users = await getUsersInGroup(groupName);
      io.to(getGroupRoomName(groupName)).emit('userListUpdate', users);
    } catch (error) {
      console.error('Error broadcasting user list:', error.message);
    }
  };

  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    let currentGroup = null;
    let userId = null;

    // Handle joining a group
    socket.on('joinGroup', async (groupName, _userId, userName) => {
      if (!groupName || !_userId || !userName) {
        socket.emit('error', 'Invalid group join request.');
        return;
      }

      try {
        await JoinGroup(groupName, _userId, userName);
        currentGroup = groupName;
        userId = _userId;

        socket.join(getGroupRoomName(groupName));
        console.log(`${userName} joined ${groupName}`);

        // Load and send chat history
        const messages = await Message.find({ groupName }).sort({ createdAt: 1 }).exec();
        socket.emit('loadHistory', messages);

        // Broadcast updated user list
        await broadcastUserList(groupName);
      } catch (error) {
        console.error('Error joining group:', error.message);
        socket.emit('error', 'An error occurred while joining the group.');
      }
    });

    // Handle sending a message
    socket.on('sendMessage', async (message) => {
      if (!currentGroup || !message) return;

      const { groupName, sender, text } = message;
      if (!groupName || !sender || !text) {
        socket.emit('error', 'Invalid message data.');
        return;
      }

      try {
        const newMessage = await Message.create({ groupName, sender, text });

        // Broadcast message to everyone in the group room
        io.to(getGroupRoomName(groupName)).emit('receiveMessage', newMessage);

        // Acknowledge to sender
        socket.emit('messageSent', { success: true, message: newMessage });
      } catch (error) {
        console.error('Error sending message:', error.message);
        socket.emit('error', 'Message could not be sent.');
      }
    });

    // Handle leaving a group
    socket.on('leaveGroup', async (groupName, leavingUserId, callback) => {
      try {
        const group = await Group.findOneAndUpdate(
          { name: groupName },
          { $pull: { members: leavingUserId } },
          { new: true }
        );

        if (!group) {
          return callback?.({ error: 'Group not found.' });
        }

        socket.leave(getGroupRoomName(groupName));
        console.log(`${leavingUserId} left ${groupName}`);

        await broadcastUserList(groupName);
        callback?.({ success: true });
      } catch (error) {
        console.error('Error leaving group:', error.message);
        callback?.({ error: 'An error occurred while leaving the group.' });
      }
    });

    // Handle disconnection
    socket.on('disconnect', async () => {
      if (currentGroup && userId) {
        console.log(`Client disconnected: ${socket.id} from group ${currentGroup}`);
        try {
          await LeaveGroup(userId, currentGroup);
          await broadcastUserList(currentGroup);
        } catch (error) {
          console.error('Error during disconnect cleanup:', error.message);
        }
      }
    });
  });
};

export default SocketHandler;
