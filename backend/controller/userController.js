import user from "../models/userModel.js";

export const singup = async (req, res) => {
   const {firstName , lastName , email,password}=req.body
   try {
    const userExist = await user.findOne({email:email})
    if(userExist){
        return res.status(400).json({message:"user alerady exist"})
    }
    const newUser = new user({firstName , lastName , email,password})
    await newUser.save()
    res.status(201).json(newUser)
   } catch (error) {
    res.status(500).json({error:"error in singup"})
    console.log("error",error);
   }
  };
  