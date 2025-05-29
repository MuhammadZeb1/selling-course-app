import user from "../models/userModel.js";
import bcrypt ,{hash}from "bcryptjs";
import { z } from "zod";
import jwt from 'jsonwebtoken'
import { config } from "dotenv";
import Purchase from "../models/purchaseModel.js";
import Course from "../models/courseModels.js";
config()


export const singup = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  const userSchema = z.object({
    firstName: z.string().min(5, "First name is atleast 5 characters long"),
    lastName: z.string().min(3, "Last name is atleast 3 characters long"),
    email: z.string().email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
  });
  const validateData = userSchema.safeParse(req.body);
  if (!validateData.success) {
    return res
      .status(400)
      .json({ errors: validateData.error.issues.map((err) => err.message) });
  }

  const hashPassowrd = await bcrypt.hash(password, 10);
  try {
    const userExist = await user.findOne({ email: email });
    if (userExist) {
      return res.status(400).json({ message: "user alerady exist" });
    }
    const newUser = new user({
      firstName,
      lastName,
      email,
      password: hashPassowrd,
    });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: "error in singup" });
    console.log("error", error);
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const userAvailable = await user.findOne({ email });
    if (!userAvailable) {
      return res.status(403).json({ error: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, userAvailable.password);
    if (!isPasswordValid) {
      return res.status(403).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: userAvailable._id },
      process.env.USER_PASSWORD,
      { expiresIn: '1d' }
    );

    // Cookie settings that work in development
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: false, // Set to false for HTTP in development
      sameSite: 'lax', // Works better than 'strict' for localhost
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    });

   res.status(200).json({ 
  message: "Login successful",
  token, // ✅ Add token here
  user: {
    id: userAvailable._id,
    email: userAvailable.email
  }
});

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Server error during login" });
  }
};

export const logout = (req, res) => {
  try {
    // Clear the cookie
    res.clearCookie("jwt");
    res.status(200).json({ message: "logout successfully" });
  } catch (error) {
    res.status(500).json({ error: "error in logout" });
    console.log(error);
  }
};
export const purchases = async (req, res) => {
  const userId = req.userId;

  try {
    // ✅ Find purchases for the current user
    const purchase = await Purchase.find({ userId });

    // ✅ Extract courseIds from the purchases
    const purchaseCourseIds = purchase.map(p => p.courseId);

    // ✅ Get course details from those IDs
    const courseData = await Course.find({
      _id: { $in: purchaseCourseIds }
    });

    res.status(200).json({ purchases: courseData });
  } catch (error) {
    console.log("Error in fetching purchases", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

