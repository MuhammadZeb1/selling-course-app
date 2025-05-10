import express from 'express';

import { buyCourse, courseDetail, createCourse, deleteCourse, getCourse, updataCourse } from '../controller/courseControle.js';
import userjwt from '../middleware/userjwt.js';
import adminjwt from '../middleware/adminjwt.js';

const router = express.Router(); 

router.post("/create",adminjwt, createCourse);
router.put("/updata/:courseId",adminjwt, updataCourse);
router.delete("/delete/:courseId",adminjwt, deleteCourse);
router.get("/:courseId", courseDetail);
router.get("/courses", getCourse);

router.post("/buy/course/:courseId",userjwt, buyCourse);

export default router; 
