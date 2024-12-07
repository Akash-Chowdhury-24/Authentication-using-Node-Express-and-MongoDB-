const {registerUser, loginUser} = require("../controllers/user-controller.js");
const {authMiddleware, isAdmin, isTeacher} = require("../middlewares/auth-middleware.js");
const express = require("express");

const router = express.Router();


router.post("/register", registerUser);
router.post("/login", loginUser);

router.get("/student", authMiddleware, (req, res) => {
  res.status(200).json({
    success: true,
    message: "You are authenticated as a student",
    userInfo : req.userInfo,
  })
});

router.get("/teacher", authMiddleware, isTeacher, (req, res) => {
  res.status(200).json({
    success: true,
    message: "You are authenticated as a teacher",
    userInfo : req.userInfo,
  });
})
router.get("/admin", authMiddleware, isAdmin, (req, res) => {
  res.status(200).json({
    success: true,
    message: "You are authenticated as an admin",
    userInfo : req.userInfo,
  });
});

module.exports = router;