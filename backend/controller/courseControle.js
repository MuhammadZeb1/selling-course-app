import Stripe from "stripe";
import mongoose from "mongoose";
import Course from "../models/courseModels.js";
import Purchase from "../models/purchaseModel.js";
 import { v2 as cloudinary } from "cloudinary";

import dotenv from "dotenv";
dotenv.config();
import Config from "../config/config.js";
const stripe = new Stripe(Config.STRIPE_SECRET);


export const createCourse = async (req, res) => {
  const adminId = req.adminId;
  console.log("🚀 adminId:", adminId);

  const { title, description, price } = req.body;
  console.log("jjj", title, description, price);

  const { image } = req.files || {};
  console.log("image", image);

  console.log("📦 req.body: the image ", req.body);

  try {
    if (!title || !description || !price) {
      return res.status(400).json({ message: "All fields are required!" });
    }
    if (!req.files) {
      console.log("🚫 No image file received!");
      return res.status(400).json({ message: "All fields are required!" });
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];

    if (!allowedTypes.includes(image.mimetype)) {
      return res
        .status(400)
        .json({ message: "Only JPEG and PNG images are allowed!" });
    }
    const cloud_response = await cloudinary.uploader.upload(image.tempFilePath);
    if (!cloud_response || cloud_response.error) {
      return res.status(400).json({ error: "error file uploading cloudery" });
    }

    console.log("hell");

    const newCourse = new Course({
      title,
      description,
      price,
      image: { public_id: cloud_response.public_id, url: cloud_response.url },
      createrId: adminId,
    });

    await newCourse.save();

    res.status(201).json({
      message: "Course created successfully!",
      course: newCourse,
    });
  } catch (error) {
    console.error("❌ Error creating course:", error.message);
    res
      .status(500)
      .json({ message: "Something went wrong!", error: error.message });
  }
};

export const updateCourse = async (req, res) => {
  const admin = req.adminId;

  const { courseId } = req.params; // Get courseId from URL params
  const { title, description, price, image } = req.body;

  // Check if courseId is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(courseId)) {
    return res.status(400).json({ message: "Invalid course ID" });
  }

  try {
    const searchCourse = await Course.findById(courseId);
    if (!searchCourse) {
      return res.status(404).json({ message: "Course not found" });
    }
    // Find and update the course
    const updatedCourse = await Course.findOneAndUpdate(
      {
        _id: courseId,
        createrId: admin,
      },
      {
        title,
        description,
        price,
        image: {
          public_id: image?.public_id,
          url: image?.url,
        },
      },
      { new: true } // Return the updated course
    );
    if (!updatedCourse) {
      return res.status(404).json({ message: "Course not found or created by another admin" });
    }

    // Return success response
    res.json({ message: "Course updated successfully", course: updatedCourse });
  } catch (error) {
    console.error("Error in update:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// delete api

export const deleteCourse = async (req, res) => {
  const adminId = req.adminId;
  const { courseId } = req.params;
  try {
    const course = await Course.findOneAndDelete({
      _id: courseId,
      createrId: adminId,
    });
    if (!course) {
      return res.status(404).json({ message: "Course not found or created by another admin" });
    }
    res.status(202).json({ message: "Course deleted successfully" });
  } catch (error) {
    console.log(error);
    console.log("Error occurred:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getCourse = async (req, res) => {
  try {
    const courses = await Course.find();

    res.status(201).json({ courses });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const courseDetail = async (req, res) => {
  const { courseId } = req.params;

  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(401).json({ message: "course not found" });
    }
    res.status(201).json({ course });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
//  console.log("🚀 Stripe secret:", Config.STRIPE_SECRET);

export const buyCourse = async (req, res) => {
  const { userId } = req;
  console.log("🚀 userId:", userId);

  const { courseId } = req.params;
  console.log("🚀 courseId:", courseId);

  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const existingPurchase = await Purchase.findOne({ courseId, userId });

    if (existingPurchase) {
      return res.status(400).json({ message: "Course already purchased" });
    }

    // stripe payment
    const amount = course.price * 100;

    // Validate amount before sending to Stripe
    if (amount > 99999999) {
      // Stripe limit is 999,999.99 USD => 99,999,999 cents
      return res
        .status(400)
        .json({ message: "Course price exceeds the Stripe limit" });
    }
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: "usd",
      payment_method_types: ["card"],
    });

    console.log("Payment Intent Client Secret:", paymentIntent.client_secret);

    res.status(200).json({
      message: "Course purchased successfully",
      course,
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error in course purchase" });
  }
};
