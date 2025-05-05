// 1. Express کو import کریں
import express from "express";
import dotenv from 'dotenv';
import mongoose from "mongoose";
import courseRoute from './routes/courseRoutes.js'
import fileUpload from "express-fileupload";

// 2. Express کا app initialize کریں
dotenv.config();
const app = express();
app.use(express.json()); // ہونا ضروری ہے!

app.use(fileUpload({
  useTempFiles : true,
  tempFileDir : '/tmp/'
}));
const PORT = process.env.PORT || 5000;

const dataBasa = process.env.DATABASE_URI

// conection data base
const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/sele-course', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
  }
};

// Call the function to connect
connectDB();

app.get('/', (req, res) => {
  res.send('Server is running!');
});
app.use("/api/v1/course",courseRoute)

// 5. Server کو listen کروائیں
app.listen(3000, () => {
  console.log(`Server is running on http://localhost:${3000}`);
});
