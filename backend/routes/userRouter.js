import express from 'express';
import { login, logout, purchases, singup } from '../controller/userController.js';
import userjwt from '../middleware/userjwt.js';



const router = express.Router(); 

router.post("/singup", singup);
router.post("/login", login);
router.get("/logout", logout);

router.get("/purchase",userjwt,purchases);


export default router; 
