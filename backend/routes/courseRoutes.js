import express from 'express';

import { createCourse } from '../controller/courseControle.js'; // ✔️ اپنے کنٹرولر سے فنکشن امپورٹ کر رہے ہیں

const router = express.Router(); // ✔️ روٹر انیشیئیٹ کر رہے ہیں

router.post("/create", createCourse); // ✔️ POST ریکویسٹ ہینڈل کر رہے ہیں

export default router; // ✔️ روٹر کو ایکسپورٹ کر رہے ہیں
