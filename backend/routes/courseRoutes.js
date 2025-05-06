import express from 'express';

import { createCourse, updataCourse } from '../controller/courseControle.js';

const router = express.Router(); 

router.post("/create", createCourse);
router.put("/updata/:courseId", updataCourse);

export default router; 
