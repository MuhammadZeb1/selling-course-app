// import user from "../models/userModel.js";
import bcrypt ,{hash}from "bcryptjs";
import { z } from "zod";
import jwt from 'jsonwebtoken'
import { config } from "dotenv";
import Admin from "../models/adminModel.js";

config()


export const singup = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  const adminSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
  });
  const validateData = adminSchema.safeParse(req.body);
  if (!validateData.success) {
    return res
      .status(400)
      .json({ errors: validateData.error.issues.map((err) => err.message) });
  }

  const hashPassowrd = await bcrypt.hash(password, 10);
  try {
    const adminExist = await Admin.findOne({ email: email });
    if (adminExist) {
      return res.status(400).json({ message: "admin alerady exist" });
    }
    const newAdmin = new Admin({
      firstName,
      lastName,
      email,
      password: hashPassowrd,
    });
    await newAdmin.save();
    res.status(201).json(newAdmin);
  } catch (error) {
    res.status(500).json({ error: "error in singup" });
    console.log("error", error);
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const adminAvailable = await Admin.findOne({ email: email });
    const hashPassowrdComp = await bcrypt.compare(password,adminAvailable.password)
    if (!adminAvailable ||!hashPassowrdComp) {
      return res.status(403).json({ errors: "invalid credentials" });
    }
    // jwt code 
    const token = jwt.sign(
      { id: adminAvailable._id },
      process.env.ADMIN_PASSWORD  
    );
    res.cookie("jwt",token)
    
    res.status(201).json({message:"login successfully",adminAvailable,token})
  } catch (error) {
    res.status(500).json({ error: "error in login" });
    console.log(error);
  }
};

export const logout = (req,res)=>{
 try {
  if(!req.cookies.jwt
  ){
    res.status(400).json({message:"singup first"})
  }
  res.clearCookie("jwt")
  res.status(200).json({message:"logout successfully"})
 } catch (error) {
  res.status(500).json({error:"error in logout"})
  console.log(error);
  
 }
}