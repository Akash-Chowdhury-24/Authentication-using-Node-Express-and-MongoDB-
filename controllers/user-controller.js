require("dotenv").config();
const User = require("../models/user-model.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

//register the user and create a token

const registerUser = async (req, res) => {
  try {
    const { user_name, email, password, role } = req.body;

    const user_nameCheck = await User.findOne({ user_name });
    if(user_nameCheck){
      return res.status(404).json({
        success: false,
        message: "User name already exists",
      })
    }

    const emailCheck = await User.findOne({ email });
    if(emailCheck){
      return res.status(404).json({
        success: false,
        message: "Email already exists",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = await User.create({
      user_name,
      email,
      password: hashedPassword,
      role: role || "student",
    }); 

    if (!newUser) {
      return res.status(500).json({
        success: false,
        message: "Something went wrong, try again later",
      });
    }

    // this is a bearer token
    const token =  jwt.sign({
      user_name: newUser.user_name,
      email: newUser.email,
      userId: newUser._id,
      role: newUser.role
    }, process.env.JWT_SECRET, {expiresIn: "3d"});

    if(!token){
      return res.status(500).json({
        success: false,
        message: "Something went wrong in token generation, try again later",
      });
    }
    res.status(200).json({
      success: true,
      message: "User registered successfully",
      data: {
        user_name: newUser.user_name,
        email: newUser.email,
        role: newUser.role,
        accesstoken: token,
      },
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


// login user and create a token
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({email});

    if(!user){
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    const passwordCheck = await bcrypt.compare(password, user.password);
    if(!passwordCheck){
      return res.status(404).json({
        success: false,
        message: "Password is incorrect",
      })
    }

    // this is a bearer token
    const token = jwt.sign({
      userId : user._id,
      user_name: user.user_name,
      email: user.email,
      role: user.role,
    }, process.env.JWT_SECRET, {expiresIn: "3d"});

    if(!token){
      return res.status(500).json({
        success: false,
        message: "Something went wrong in token generation, try again later",
      });
    }

    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      data: {
        user_name: user.user_name,
        email: user.email,
        role: user.role,
        accesstoken: token,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


module.exports = {
  registerUser,
  loginUser
};