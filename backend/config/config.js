import dotenv from "dotenv";
dotenv.config();

const config = {
 
  JWT_SECRET: process.env.USER_PASSWORD,
  };

export default {
  STRIPE_SECRET: process.env.STRIPE_SECRET,
 
}
