import AuthModel from "../Models/AuthModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const SignUp = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      res.status(404).json({
        success: false,
        message: "please fill all the fileds",
      });
    }

    const genSalt = await bcrypt.genSalt(10);
    const hashed_pass = await bcrypt.hash(password, genSalt);

    const user = await AuthModel.create({
      name,
      email,
      password: hashed_pass,
    });

    user.save();

    return res.status(201).json({
      success: true,
      message: user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "something went wrong",
    });
  }
};

const secretKey = "juttjoshwa";

export const SignIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    const validUser = await AuthModel.findOne({ email });
    if (!validUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    const ValidPassword = bcrypt.compareSync(password, validUser.password);
    if (!ValidPassword) {
      return res.status(401).json({
        success: false,
        message: "Invalid cridentials!",
      });
    }
    const token = jwt.sign({ id: validUser._id }, secretKey);
    const { password: pass, ...restof } = validUser._doc;

    res
      .cookie("tokken", token, {
        httpOnly: true,
      })
      .status(200)
      .json({
        success: true,
        restof,
      });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "something went wrong",
    });
  }
};

export const google = async (req, res) => {
  try {
    const { name, email, photo } = req.body;
    const user = await AuthModel.findOne({ email });

    if (user) {
      const token = jwt.sign({ id: user._id }, secretKey);

      if (!token) {
        //!check for the token
        return res.status(403).json({
          success: false,
          message: "Cannot not create token",
        });
      }

      const { password: pass, ...restof } = user._doc;

      return res
        .cookie("tokken", token, {
          httpOnly: true,
        })
        .status(200)
        .json({
          success: true,
          restof,
        });
    } else {
      const genratedpassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);

      const Hashedpassword = bcrypt.hashSync(genratedpassword, 10);

      const newUsername =
        name.split(" ").join("").toLowerCase() +
        Math.random().toString(14).slice(-4);

      const newUser = new AuthModel({
        name: newUsername,
        email: email,
        password: Hashedpassword,
        avatar: photo,
      });

      await newUser.save();

      const token = jwt.sign({ id: newUser._id }, secretKey);
      const { password: pass, ...rest } = newUser._doc;
      return res.cookie("tokken", token, { httpOnly: true }).status(201).json({
        success: true,
        rest,
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "something went wrong",
    });
  }
};

export const SignOutUser = async (req, res) => {
  try {
    res.clearCookie("tokken");
    res.status(200).json({
      success: true,
      message: "User Logged out successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong" || error.message,
    });
  }
};
