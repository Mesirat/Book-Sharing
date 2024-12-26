import express from 'express'
import { getProfile, logIn, logOut, signUp, updateProfile } from '../controllers/user_controller';
const router = express.Router();


router.post('/login',logIn)
router.post('/signup',signUp)
router.post('/logOut',logOut)
router.route('/profile').get(getProfile).put(updateProfile)


module.exports =router