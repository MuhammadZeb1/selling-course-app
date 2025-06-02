import express from 'express';


import {
  buyCourse,
  courseDetail,
  createCourse,
  deleteCourse,
  getCourse,
  updateCourse,
} from '../controller/courseControle.js';

import userjwt from '../middleware/userjwt.js';
import adminjwt from '../middleware/adminjwt.js';

const router = express.Router();

router.post("/create", adminjwt, createCourse);
router.put("/update/:courseId", adminjwt, updateCourse);
router.delete("/delete/:courseId", adminjwt, deleteCourse);

// ✅ static route first
router.get("/courses", getCourse);

// ✅ dynamic route after
router.get("/:courseId", courseDetail);

router.post("/buy/course/:courseId", userjwt, buyCourse);

export default router;
