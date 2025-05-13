import jwt from "jsonwebtoken";

const adminjwt = (req, res, next) => {
    const authHeaders = req.headers.authorization;

    if (!authHeaders || !authHeaders.startsWith("Bearer ")) {
        return res.status(401).json({ error: "No token available" });
    }

    const token = authHeaders.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.ADMIN_PASSWORD);        
        req.adminId = decoded.id;
        next();
    } catch (error) {
        res.status(401).json({ error: "Invalid or expired token" });
        console.log(error);
    }
};

export default adminjwt;
