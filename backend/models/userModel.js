import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profileImage: {
      type: String,
      default: "default-avatar.jpg",
    },
    role:{
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
    mustChangePassword: {
      type: Boolean,
      default: false,
    },
    
  },
  
  {
    timestamps: true, 
  }
);


userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});


userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};


userSchema.methods.isPasswordResetTokenValid = function () {
  return this.resetPasswordExpiresAt > Date.now();
};


// userSchema.methods.isEmailVerificationTokenValid = function () {
//   return this.verificationTokenExpiresAt > Date.now();
// };

export const User = mongoose.model("User", userSchema);
