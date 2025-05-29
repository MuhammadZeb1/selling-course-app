  import express from "express";
  import dotenv from 'dotenv';
  import mongoose from "mongoose";

  import courseRoute from './routes/courseRoutes.js'
  import userRoute from './routes/userRouter.js'
  import adminRoute from './routes/adminRoute.js'
  import orderRoute from './routes/orderRoute.js'

  import fileUpload from "express-fileupload";
  import { v2 as cloudinary } from 'cloudinary';
  import cookieParser from "cookie-parser";
  import cors from 'cors'
import { connectDB } from "./config/mongodb.js";


  dotenv.config();
  const app = express();
  app.use(express.json()); 
  app.use(cookieParser()); 
  app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : '/tmp/'
  }));
  app.use(cors({
    origin: process.env.FRONTEND_URL, 
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  }));
  const PORT = process.env.PORT || 5000;

  const dataBasa = process.env.DATABASE_URI

  
  connectDB();

  app.get('/', (req, res) => {
    res.send('Server is running!');
  });
  app.use("/api/v1/course",courseRoute)
  app.use("/api/v1/user",userRoute)
  app.use("/api/v1/admin",adminRoute)
  app.use("/api/v1/order",orderRoute)
  // cludnery config file
  cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.API_KEY, 
    api_secret: process.env.API_SECRET 
  });

  app.listen(3000, () => {
    console.log(`Server is running on http://localhost:${3000}`);
  });
