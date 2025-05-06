import express from 'express';

import { courseDetail, createCourse, deleteCourse, getCourse, updataCourse } from '../controller/courseControle.js';

const router = express.Router(); 

router.post("/create", createCourse);
router.put("/updata/:courseId", updataCourse);
router.delete("/delete/:courseId", deleteCourse);
router.get("/:courseId", courseDetail);
router.get("/courses", getCourse);

export default router; 
