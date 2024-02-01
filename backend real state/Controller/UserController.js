import bcryptjs from "bcrypt";
import AuthModel from "../Models/AuthModel.js";
import Listing from "../Models/ListingModel.js";

export const updateUserInfo = async (req, res) => {
  try {
    if (req.user.id !== req.params.id) {
      return res.status(401).json({
        success: false,
        message: "You can only update your account!",
      });
    }
    if (req.body.password) {
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }
    const updateUser = await AuthModel.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          name: req.body.name,
          email: req.body.email,
          password: req.body.password,
          avatar: req.body.avatar,
        },
      },
      { new: true }
    );

    const { password, ...restof } = updateUser._doc;

    return res.status(200).json({
      success: true,
      message: "Updated Successfully",
      restof,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong" || error.message,
    });
  }
};

export const DeleteUserInfo = async (req, res) => {
  try {
    if (req.user.id !== req.params.id) {
      return res.status(401).json({
        success: false,
        message: "You Can only update your account!",
      });
    }
    await AuthModel.findByIdAndDelete(req.params.id);
    res.clearCookie("tokken");
    return res.status(201).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong" || error.message,
    });
  }
};

export const getUserListing = async (req, res) => {
  try {
    if (req.user.id !== req.params.id) {
      return res.status(401).json({
        success: false,
        message: "You are not authorized to make this oppration",
      });
    }
    const listing = await Listing.find({ userRef: req.params.id });
    return res.status(201).json({
      success: false,
      listing,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong" || error.message,
    });
  }
};

export const getUser = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(401).json({
        success: false,
        message: "Id id required",
      });
    }
    const user = await AuthModel.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User is not found",
      });
    }

    const { password: pass, ...restof } = user._doc;

    return res.status(200).json({
      success: true,
      restof,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};
