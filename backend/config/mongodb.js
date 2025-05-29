import mongoose from 'mongoose';
export const connectDB = async () => {
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