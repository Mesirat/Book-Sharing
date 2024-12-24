import express from 'express'
import { logIn, signUp } from '../controllers/user_controller';
const router = express.Router();


router.post('/login',logIn)
router.post('/signup',signUp)


module.exports =router