import express from 'express';

import {
  buyCourse,
  courseDetail,
  createCourse,
  deleteCourse,
  getCourse,
  updataCourse,
} from '../controller/courseControle.js';

import userjwt from '../middleware/userjwt.js';
import adminjwt from '../middleware/adminjwt.js';

const router = express.Router();

router.post("/create", adminjwt, createCourse);
router.put("/updata/:courseId", adminjwt, updataCourse);
router.delete("/delete/:courseId", adminjwt, deleteCourse);

// ✅ static route first
router.get("/courses", getCourse);

// ✅ dynamic route after
router.get("/:courseId", courseDetail);

router.post("/buy/course/:courseId", userjwt, buyCourse);

export default router;
