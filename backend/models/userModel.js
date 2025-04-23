import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const likedBooksSchema = new mongoose.Schema(
  {
    bookId: { type: String, required: true },
    title: { type: String, required: true },
    author: { type: String, required: true },
    thumbnail: { type: String, required: true },
  },
  { timestamps: true }
);


const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required:true,
    },

    phone: {
      type: String,
      unique: true,
      sparse: true, 
      required: false,  
      validate: {
        validator: (v) => /\+?[0-9]{10,15}/.test(v), 
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
    likedBooks: [likedBooksSchema], 
    
    resetPasswordToken: String,
    resetPasswordExpiresAt: Date,
    profileImage: {
      type: String, 
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



