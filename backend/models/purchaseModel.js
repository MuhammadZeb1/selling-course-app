import mongoose from "mongoose";

const purchaseSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Usually "User" with capital U
    required: true,
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course", // Usually "Course" with capital C
    required: true,
  },
  
});

const Purchase = mongoose.model("Purchase", purchaseSchema);
export default Purchase;
