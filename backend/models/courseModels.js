import mongoose from "mongoose";
import User from "./userModel.js";

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { 
    public_id:{
      type: String, required: true 
    },
    url:{
      type: String, required: true 
    }
  },
  createrId:{
    type:mongoose.Types.ObjectId,
    ref:User
  }
});

const Course = mongoose.model("Course", courseSchema);

export default Course;
