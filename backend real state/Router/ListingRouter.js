import express from "express";
import {
  CreateListing,
  DeleteListing,
  UpdateListing,
  getListing,
  getmoreListings,
} from "../Controller/ListingController.js";

const Router = express.Router();

// Middleware function for requiring authentication with JWT token
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

Router.post("/create", requireAuth, CreateListing);
Router.delete("/delete/:id", requireAuth, DeleteListing);
Router.post("/update/:id", requireAuth, UpdateListing);
Router.get("/get/:id", getListing);
Router.get("/get", getmoreListings);

export default Router;
