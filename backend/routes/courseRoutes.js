import express from 'express';

import { createCourse, deleteCourse, updataCourse } from '../controller/courseControle.js';

const router = express.Router(); 

router.post("/create", createCourse);
router.put("/updata/:courseId", updataCourse);
router.delete("/delete/:courseId", deleteCourse);

export default router; 
