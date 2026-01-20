const express = require("express")
const userController = require("../controller/userController")
const { auth } = require("../middleware/auth")
const upload = require("../middleware/upload");


const router = express.Router();

router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/getUserInfo", auth, userController.getUserInfo);
router.get("/doctorList", auth, userController.doctorList);
router.patch("/updateProfile", auth, userController.updateUserProfile)
router.post(
  "/upload-profile",
  auth,
  upload.single("profileImage"),
  userController.profileImage
);
router.get("/getAllUsers", auth, userController.getAllUsers);



module.exports = router