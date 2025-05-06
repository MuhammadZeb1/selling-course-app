import user from "../models/userModel.js";
import brypt, { hash } from 'bcryptjs'

export const singup = async (req, res) => {
   const {firstName , lastName , email,password}=req.body
   const hashPassowrd = await brypt.hash(password,10)
   try {
    const userExist = await user.findOne({email:email})
    if(userExist){
        return res.status(400).json({message:"user alerady exist"})
    }
    const newUser = new user({firstName , lastName , email,password:hashPassowrd})
    await newUser.save()
    res.status(201).json(newUser)
   } catch (error) {
    res.status(500).json({error:"error in singup"})
    console.log("error",error);
   }
  };
  