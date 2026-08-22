import jwt from "jsonwebtoken";
export const verifyToken = (req, res, next) => {
    try {
        const token = req.cookies.access_token;
        if (!token) {
            return res.status(401).json({
                message: "you are not siggned in"
            });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // extended the type of this request ibject
        req.user_id = decoded.userId;
        return next();
    }
    catch (e) {
        return res.status(401).json({
            message: "please login"
        });
    }
};
//# sourceMappingURL=isSignedIn.js.map