import mongoose from "mongoose";
import Order from "../models/orderModel.js";
import Purchase from "../models/purchaseModel.js";

export const orderData = async (req, res) => {
  const { email, courseId, paymentId, amount, status } = req.body;
  const userId = req.userId;

  try {
    const orderInfo = new Order({
    
      email,
      courseId,
      paymentId,
      amount,
      status,
      userId: new mongoose.Types.ObjectId(userId),
    });

    await orderInfo.save();

    const newPurchase = new Purchase({
      courseId: new mongoose.Types.ObjectId(courseId),
      userId: new mongoose.Types.ObjectId(userId),
    });

    await newPurchase.save();

    res.status(201).json({ message: "Order placed", orderInfo });
  } catch (error) {
    console.error("Order error:", error);
    res.status(500).json({ error: "Failed to place order" });
  }
};