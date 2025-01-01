import express from 'express'
import { getProfile, logIn, logOut, signUp, updateProfile } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import passport from 'passport';
const router = express.Router();


router.post('/login',logIn)
router.get('/google',passport.authenticate('google',{scope:['profile,email']}))
router.post('/signup',signUp)
router.post('/logOut',logOut)
router.route('/profile')
.get(protect,getProfile)
.put(protect,updateProfile)


export default router;