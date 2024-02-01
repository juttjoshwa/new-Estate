import jwt from "jsonwebtoken";

const secretKey = "juttjoshwa";
export const VerifyToken = async (req, res, next) => {
  const token = req.cookies.tokken;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      return res.status(403).json({
        success: false,
        message: "Forbidden",
      });
    }

    req.user = user;
    next();
  });
};
