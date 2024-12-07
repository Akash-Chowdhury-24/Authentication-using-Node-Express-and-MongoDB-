const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  user_name:{
    type:String,
    required:[true,"User name is required"],
    unique:[true,"User name must be unique"],
    trim:true
  },
  email:{
    type:String,
    required:[true,"Email is required"],
    unique:[true,"Email must be unique"],
    trim:true
  },
  password:{
    type:String,
    required:[true,"Password is required"],
    trim:true
  },
  role:{
    type:String,
    enum:["student","admin","teacher"],
    default:"user",
  }
});


const User =mongoose.models.User || mongoose.model("User",userSchema);
module.exports = User;