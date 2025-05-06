import Course from '../models/courseModels.js';
import { v2 as cloudinary } from 'cloudinary';

export const createCourse = async (req, res) => {
  const { title, description, price,  } = req.body;
  const {image} = req.files
  console.log("📦 req.body:", req.body);

  

  try {
    if (!title || !description || !price ) {
      return res.status(400).json({ message: 'All fields are required!' });
    }
    if(!req.files){
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


    const newCourse = new Course({ title, description, price, image:{public_id:cloud_response.public_id,url:cloud_response.url} });
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
