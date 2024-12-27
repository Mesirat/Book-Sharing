import genereateToken from "../utils/generateToken.js";
import { User } from "../models/userModel.js";

export const logIn = async (req, res) => {
    const {email,password} = req.body;
    const user =await User.findOne(email)
    if (user && (await user.matchPassword(password))) {
        genereateToken(res,user._id)
        res.status(201).json({
          _id: user._id,
          firstname: user.firstname,
          lastname: user.lastname,
          email: user.email,
        });
      } else {
        res.status(404);
        throw new Error("Invalid Email or Password");
      }
   
};
export const signUp = async (req, res) => {
  const { firstname, lastname, email, password } = req.body;
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User Already Exists");
  }

  const user = await User.create({
    firstname,
    lastname,
    email,
    password,
  });
  if (user) {
    genereateToken(res,user._id)
    res.status(201).json({
      _id: user._id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
    });
  } else {
    res.status(404);
    throw new Error("Invalid User Data");
  }
  res.status(200).json({ message: "Sign Up" });
};
export const logOut = async (req, res) => {
  res.cookies('jwt','',{
    httpOnly:true,
    expires:new Date(0)
  })
  res.status(200).json({message:'User Logged out successfully'})
};
export const getProfile = async (req, res) => {};
export const updateProfile = async (req, res) => {};
