import express from "express";
import {
  SignIn,
  SignOutUser,
  SignUp,
  google,
} from "../Controller/AuthController.js";
import {
  updateUserInfo,
  DeleteUserInfo,
  getUserListing,
  getUser,
} from "../Controller/UserController.js";
import { VerifyToken } from "../Utills/verifyToken.js";

const Router = express.Router();

const requireAuth = async (req, res, next) => {
  const token = req.cookies.tokken; // Extract token from the cookie in the request
  const key = "juttjoshwa";
  const secretToken = key; // Secret key for verifying the token

  if (!token) {
    // If the token is not present, return a 401 Unauthorized response
    return res
      .status(401)
      .json({ message: "Please log in to access this resource" });
  }
  try {
    // Verify the token using the secret key
    const decodedToken = await jwt.verify(token, secretToken);
    req.user = decodedToken; // Set the decoded token as part of the request object
    next(); // Move to the next middleware or route handler
  } catch (err) {
    // If the token verification fails, return a 401 Unauthorized response
    return res.status(401).json({ message: "Invalid token" });
  }
};

Router.post("/signup", SignUp);
Router.post("/signin", SignIn);
Router.post("/google", google);
Router.post("/update/:id", requireAuth, updateUserInfo);
Router.delete("/delete/:id", requireAuth, DeleteUserInfo);
Router.get("/signout/:id", requireAuth, SignOutUser);
Router.get("/listing/:id", requireAuth, getUserListing);
Router.get("/:id", requireAuth, getUser);

export default Router;
