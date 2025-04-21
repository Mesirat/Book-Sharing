// import genereateToken from "../utils/generateToken.js";
// import { User } from "../models/userModel.js";

// export const logIn = async (req, res) => {
//   const { email, password } = req.body;

 
//   const user = await User.findOne({ email });

  
//   if (user && (await user.matchPassword(password))) {
   
//     generateToken(res, user._id);

   
//     res.status(200).json({
//       _id: user._id,
//       firstname: user.firstname,
//       lastname: user.lastname,
//       email: user.email,
//     });
//   } else {
   
//     res.status(400).json({
//       message: "Invalid Email or Password",
//     });
//   }
// };

// export const signUp = async (req, res) => {
//   const { username,  email, password } = req.body;
//   try {

//   const userExists = await User.findOne({ email });
//   if (userExists) {
//    return res.status(400).json({message:"User Already Exists"});
//   }

//   const user = await User.create({
//     username,
//     email,
//     password,
//   });
//   if (user) {
//     genereateToken(res,user._id);
//     return res.status(201).json({
//       _id: user._id,
//       username: user.username,
    
//       email: user.email,
//     });
//   } else {
//    return res.status(400).json({message:"Invalid User Data"});
//   }
// } catch (error) {
//   return res.status(500).json({ message: "Server error", error: error.message });
// }};

// export const logOut = async (req, res) => {
//   res.cookies('jwt','',{
//     httpOnly:true,
//     expires:new Date(0)
//   })
//   res.status(200).json({message:'User Logged out successfully'})
// };
// export const getProfile = async (req, res) => {};
// export const updateProfile = async (req, res) => {};

import asyncHandler from "express-async-handler";
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

export const Contact = asyncHandler(async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: email,
      to: process.env.EMAIL_RECEIVER,
      subject: `Contact Form Submission from ${name}`,
      text: message,
    });

    res.status(200).json({ message: "Message sent successfully!" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to send message", error: error.message });
  }
});

export const updateProfilePicture = [
  upload.single("profileImage"),
  asyncHandler(async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const filePath = `/uploads/${req.file.filename}`;

    try {
      const user = await User.findById(req.user._id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (user.profileImage) {
        const oldImagePath = path.join(__dirname, "..", user.profileImage);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }

      user.profileImage = filePath;
      await user.save();

      // Send updated profile image URL as response
      res.json({
        message: "Profile image updated successfully",
        profileImage: filePath,
        user: {
          ...user._doc,
          password: undefined, // Exclude password from the response
        },
      });
    } catch (error) {
      console.error("Error updating profile picture:", error);
      res.status(500).json({ message: "Server error: " + error.message });
    }
  }),
];
export const getLaterReads = asyncHandler(async (req, res) => {
  try {
    const userId = req.user?._id;
    console.log("User ID in Request:", userId); // Log the user ID to check if it's valid

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid or missing user ID" });
    }

    console.log(`Fetching Later Reads for User ID: ${userId}`);

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log("User fetched from DB:", user); // Log the user object to verify

    // Return laterReads or an empty array if it's undefined
    res.status(200).json({ laterReads: user.laterReads || [] });
  } catch (error) {
    console.error("Error fetching Later Reads:", error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching Later Reads." });
  }
});
export const getLikedBooks = asyncHandler(async (req, res) => {
  try {
    const userId = req.user?._id;

    console.log("User ID from Token:", userId);  // Log the user ID

    // Check if userId exists and is valid
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid User ID format" });
    }

    console.log("Fetching Liked Books for User ID:", userId);  // Log the user ID for debugging

    const user = await User.findById(userId).select("likedBooks");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log("User Found:", user);  // Log the user object for debugging

    res.status(200).json({ likedBooks: user.likedBooks || [] });
  } catch (error) {
    console.error("Error fetching Liked Books:", error);  // Log detailed error message
    res.status(500).json({
      message: error.message || "An error occurred while fetching liked books.",
    });
  }
});

export const likeBook = asyncHandler(async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const { bookId, title, author, thumbnail } = req.body;
    const userId = req.user._id;  // This will no longer throw an error

    if (!bookId || !title || !author || !thumbnail) {
      return res.status(400).json({ message: "Missing book details" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Proceed with the like/unlike logic...
  } catch (error) {
    console.error("Error in likeBook:", error);
    res.status(500).json({ message: "Server error: " + error.message });
  }
});

export const laterRead = asyncHandler(async (req, res) => {
  try {
    const { bookId, title, author, thumbnail } = req.body;
    const userId = req.user._id;

    if (!bookId || !title || !author || !thumbnail) {
      return res.status(400).json({ message: "Missing book details" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the book already exists in the laterReads list
    const existingIndex = user.laterReads.findIndex(
      (book) => book.bookId.toString() === bookId
    );

    if (existingIndex !== -1) {
      // Remove the book from the laterReads list
      user.laterReads.splice(existingIndex, 1);
      await user.save();

      return res.status(200).json({
        message: "Book removed from Later Reads",
        laterReads: user.laterReads,
      });
    }

    // Add the book to the laterReads list
    user.laterReads.push({ bookId, title, author, thumbnail });
    await user.save();

    res.status(200).json({
      message: "Book added to Later Reads",
      laterReads: user.laterReads,
    });
  } catch (error) {
    console.error("Error in laterRead:", error.message);
    res.status(500).json({ message: "Server error: " + error.message });
  }
});
