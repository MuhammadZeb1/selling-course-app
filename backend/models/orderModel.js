import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  email: { type: String,  },
  courseId: { type: String, },
 userId: { type: mongoose.Schema.Types.ObjectId,
   ref: 'User',  },
  paymentId: { type: String, },
  amount: { type: Number,  },
  status: { type: String, },
});

const Order = mongoose.model("Order", orderSchema);
export default Order;
