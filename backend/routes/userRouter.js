import express from 'express';
import { login, singup } from '../controller/userController.js';



const router = express.Router(); 

router.post("/singup", singup);
router.post("/login", login);


export default router; 
