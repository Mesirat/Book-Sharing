import genereateToken from "../utils/generateToken.js";
import { User } from "../models/userModel.js";

export const logIn = async (req, res) => {
  const { email, password } = req.body;

 
  const user = await User.findOne({ email });

  
  if (user && (await user.matchPassword(password))) {
   
    generateToken(res, user._id);

   
    res.status(200).json({
      _id: user._id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
    });
  } else {
   
    res.status(400).json({
      message: "Invalid Email or Password",
    });
  }
};

export const signUp = async (req, res) => {
  const { username,  email, password } = req.body;
  try {

  const userExists = await User.findOne({ email });
  if (userExists) {
   return res.status(400).json({message:"User Already Exists"});
  }

  const user = await User.create({
    username,
    email,
    password,
  });
  if (user) {
    genereateToken(res,user._id);
    return res.status(201).json({
      _id: user._id,
      username: user.username,
    
      email: user.email,
    });
  } else {
   return res.status(400).json({message:"Invalid User Data"});
  }
} catch (error) {
  return res.status(500).json({ message: "Server error", error: error.message });
}};

export const logOut = async (req, res) => {
  res.cookies('jwt','',{
    httpOnly:true,
    expires:new Date(0)
  })
  res.status(200).json({message:'User Logged out successfully'})
};
export const getProfile = async (req, res) => {};
export const updateProfile = async (req, res) => {};
