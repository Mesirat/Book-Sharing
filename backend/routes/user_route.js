import express from 'express'
import { getProfile, logIn, logOut, signUp, updateProfile } from '../controllers/user_controller';
import { protect } from './middleware/authMiddleware.js';
const router = express.Router();


router.post('/login',logIn)
router.post('/signup',signUp)
router.post('/logOut',logOut)
router.route('/profile')
.get(protect,getProfile)
.put(protect,updateProfile)


module.exports =router