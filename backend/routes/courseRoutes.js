import express from 'express';

import { buyCourse, courseDetail, createCourse, deleteCourse, getCourse, updataCourse } from '../controller/courseControle.js';
import userjwt from '../middleware/userjwt.js';

const router = express.Router(); 

router.post("/create", createCourse);
router.put("/updata/:courseId", updataCourse);
router.delete("/delete/:courseId", deleteCourse);
router.get("/:courseId", courseDetail);
router.get("/courses", getCourse);

router.post("/buy/course/:courseId",userjwt, buyCourse);

export default router; 
