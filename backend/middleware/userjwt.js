import jwt from "jsonwebtoken";

const userjwt = (req, res, next) => {
    const authHeaders = req.headers.authorization;

    // Check if Authorization header is present and correctly formatted
    if (!authHeaders || !authHeaders.startsWith("Bearer ")) {
        return res.status(401).json({ error: "No token available" });
    }

    // Extract the token
    const token = authHeaders.split(" ")[1];

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.USER_PASSWORD);

        // Store user ID in request object
        req.adminId = decoded.id;

        // Proceed to next middleware or route
        next();
    } catch (error) {
        // If token is invalid or expired
        res.status(401).json({ error: "Invalid or expired token" });
        console.log(error);
    }
};

export default userjwt;
