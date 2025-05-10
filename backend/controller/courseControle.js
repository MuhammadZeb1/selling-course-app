import Course from '../models/courseModels.js';
import user from '../models/userModel.js'
import Purchase from '../models/purchaseModel.js';
import { v2 as cloudinary } from 'cloudinary';

export const createCourse = async (req, res) => {
  const adminId = req.adminId
  const { title, description, price,  } = req.body;
  const {image} = req.files
  console.log("📦 req.body:", req.body);

  

  try {
    if (!title || !description || !price ) {
      return res.status(400).json({ message: 'All fields are required!' });
    }
    if(!req.files){
      console.log("🚫 No image file received!");
        return res.status(400).json({ message: 'All fields are required!' });
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];

if (!allowedTypes.includes(image.mimetype)) {
  
  return res.status(400).json({ message: 'Only JPEG and PNG images are allowed!' });
}
const cloud_response = await cloudinary.uploader.upload(image.tempFilePath)
if (!cloud_response||cloud_response.error){
  return res.status(400).json({error:"error file uploading cloudery"})
}


    const newCourse = new Course({
       title, description, price, image:{public_id:cloud_response.public_id,url:cloud_response.url},
       createrId:adminId
       });
    await newCourse.save();

    res.status(201).json({
      message: 'Course created successfully!',
      course: newCourse
    });

  } catch (error) {
    console.error("❌ Error creating course:", error.message);
    res.status(500).json({ message: "Something went wrong!", error: error.message });
  }
};




export const updataCourse = async (req, res) => {
  const admin = req.adminId
  const { courseId } = req.params; // Get courseId from URL params
  const { title, description, price, image } = req.body;

  // Check if courseId is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(courseId)) {
    return res.status(400).json({ message: "Invalid course ID" });
  }

  try {
    // Find and update the course
    const updatedCourse = await Course.updateOne(
      {
      _id:courseId,
      createrId:adminId
      },
      {
        title,
        description,
        price,
        image: {
          public_id: image?.public_id,
          url: image?.url
        }
      },
      { new: true } // Return the updated course
    );

    // Check if the course exists
    if (!updatedCourse) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Return success response
    res.json({ message: "Course updated successfully", course: updatedCourse });
  } catch (error) {
    console.error("Error in update:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// delete api

export const deleteCourse = async (req,res)=>{
  const adminId = req.adminId
  const {courseId} = req.params
 try {
  const course = await Course.findOneAndDelete({_id:courseId,
    createrId:adminId
  },)
  if(!course){
   return res.status(404).json({message:"course is not found"})
  }
  res.status(202).json({message:"course is delete successfully"})

 } catch (error) {
  console.log(error);
  console.log("error occur",error);
  res.status(500).json({ message: "Internal server error" });
 }}

 export const getCourse = async (req,res)=>{
  try {
    const courses = await Course.find()

    res.status(201).json({courses})
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
 }


 export const courseDetail = async (req,res)=>{
  const {courseId}=req.params;

  try {
    const course = await Course.findById(courseId)
    if (!course){
     return res.status(401).json({message:"course not found"})
    }
    res.status(201).json({course})
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
 }

 export const buyCourse = async (req, res) => {
  const { userId } = req;
  const { courseId } = req.params;

  try {
  
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    
    
    const existingPurchase = await Purchase.findOne({ courseId, userId });
    
    if (existingPurchase) {
      return res.status(400).json({ message: "Course already purchased" });
    }


    const newPurchase = new Purchase({ courseId, userId });
    await newPurchase.save();

    res.status(200).json({ message: "Course purchased successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error in course purchase" });
  }
};
