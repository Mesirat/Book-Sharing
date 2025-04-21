import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required:true,
    },

    phone: {
      type: String, // Changed to string for better handling of phone numbers
      default:"+251900000000",
      unique: true,
      validate: {
        validator: (v) => /\+?[0-9]{10,15}/.test(v), // Basic phone number validation
        message: (props) => `${props.value} is not a valid phone number!`,
      },
    },
    email: {
      type: String,
      required:true,
      unique: true,
    },
    password: {
      type: String,
      required:true,
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    
    resetPasswordToken: String,
    resetPasswordExpiresAt: Date,
    verificationToken: String,
    verificationTokenExpiresAt: Date,
    profileImage: {
      type: String, // Store the image URL or path
      default: "default-avatar.jpg", // Default image if none is provided
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

// Hash the password before saving it to the database
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to check if the entered password matches the stored password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Method to check if the password reset token is valid
userSchema.methods.isPasswordResetTokenValid = function () {
  return this.resetPasswordExpiresAt > Date.now();
};

// Method to check if the email verification token is valid
userSchema.methods.isEmailVerificationTokenValid = function () {
  return this.verificationTokenExpiresAt > Date.now();
};

export const User = mongoose.model("user", userSchema);



// const mongoose = require("mongoose");

// const likedBooksSchema = new mongoose.Schema(
//   {
//     bookId: { type: String, required }, // Unique identifier for the book (e.g., Google Books ID)
//     title: { type: String, required },
//     author: { type: String, required },
//     thumbnail: { type: String, required },
//   },
//   { timestamps: true }
// );

// const userSchema = new mongoose.Schema(
//   {
//     email: { type: String, required, unique: true },
//     password: { type: String, required },
//     profileImage: { type: String },
//     likedBooks: [likedBooksSchema], // Array to store liked books
//   },
//   { timestamps: true }
// );

// const User = mongoose.model("User", userSchema);

// module.exports = User;
