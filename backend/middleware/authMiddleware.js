import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import { User } from '../models/userModel.js';

export const protect = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer')) {
    const token = authHeader.split(' ')[1];

    try {
      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Decoded Token:', decoded); // Debugging: check decoded payload

      // Find user and attach to request
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ success: false, message: 'User not found' });
      }

      next(); // Proceed to the next middleware/route handler
    } catch (error) {
      console.error('Token verification error:', error.message);

      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ success: false, message: 'Token expired, please log in again' });
      }

      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ success: false, message: 'Invalid token, please log in again' });
      }

      return res.status(401).json({ success: false, message: 'Token verification failed' });
    }
  } else {
    console.error('Authorization header missing or malformed');
    return res.status(401).json({ success: false, message: 'No token provided, access denied' });
  }
});
