import express from 'express';
import { login, logout,  singup } from '../controller/adminControle.js';




const router = express.Router(); 

router.post("/singup", singup);
router.post("/login", login);
router.get("/logout", logout);

export default router; 
