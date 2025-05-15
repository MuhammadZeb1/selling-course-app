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
    const userAvailable = await user.findOne({ email: email });
    const hashPassowrdComp = await bcrypt.compare(password,userAvailable.password)
    if (!userAvailable ||!hashPassowrdComp) {
      return res.status(403).json({ errors: "invalid credentials" });
    }
    // jwt code 
    const token = jwt.sign(
      { id: userAvailable._id },
      process.env.USER_PASSWORD  // ✅ یہ درست ہے
    );
    res.cookie("jwt",token)
    
    res.status(201).json({message:"login successfully",userAvailable,token})
  } catch (error) {
    res.status(500).json({ error: "error in login" });
    console.log(error);
  }
};

export const logout = (req,res)=>{
 try {
  if(!req.cookies.jwt ){
      res.status(400).json({message:"singup first"})
    }
  res.clearCookie("jwt")
  res.status(200).json({message:"logout successfully"})
 } catch (error) {
  res.status(500).json({error:"error in logout"})
  console.log(error);
  
 }
}

export const purchases =async (req,res )=>{
  const userId = req.userId;
  try {
    const purchase = await Purchase.find()
    let purchaseCourseId=[]
    for (let i = 0;i<purchaseCourseId.length;i++){
      purchaseCourseId.push(purchase[i].userId)
    }
    const courseData = await Course.find({
      _id:{$in:purchaseCourseId},
    })
    res.status(200).json({purchase,courseData})
  } catch (error) {
    res.status()
    console.log(error);
    
  }

}
