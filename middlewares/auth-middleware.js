const User = require("../models/user-model.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


// authentication middleware to check if the user is authenticated or not
const authMiddleware = async(req,re,next)=>{
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if(!token){
      return res.status(401).json({
        success:false,
        message:"user is not authenticated"
      });
    }
    const decodedToken = jwt.verify(token,process.env.JWT_SECRET);
    req.userInfo = decodedToken;
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success:false, 
      message:"Internal Server Error"
    });
  }
}


const isTeacher = async(req,res,next)=>{
  try {
    const userInfo = req.userInfo;

    if(userInfo.role !== "teacher" && userInfo.role !== "admin"){
      return res.status(401).json({
        success:false,
        message:"You are not a teacher or admin"
      })
    }

    req.userInfo = userInfo;
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success:false, 
      message:"Internal Server Error"
    });
  }
};

const isAdmin = async(req,res,next)=>{
  try {
    const userInfo = req.userInfo;

    if(userInfo.role !== "admin"){
      return res.status(401).json({
        success:false,
        message:"You are not an admin"
      })
    }

    req.userInfo = userInfo;
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success:false, 
      message:"Internal Server Error"
    });
  }
};

module.exports = {authMiddleware,isTeacher,isAdmin};