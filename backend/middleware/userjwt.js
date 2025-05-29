import jwt from "jsonwebtoken";
import { config } from "dotenv";
config();

const userjwt = (req, res, next) => {
    const token = req.cookies.jwt; // get token from cookie
    if (!token) {
        return res.status(401).json({ error: "No token available" });
    }

    try {
        const decoded = jwt.verify(token, process.env.USER_PASSWORD);
        req.userId = decoded.id;
        next();
    } catch (error) {
        res.status(401).json({ error: "Invalid or expired token" });
        console.log(error);
    }
};

export default userjwt;