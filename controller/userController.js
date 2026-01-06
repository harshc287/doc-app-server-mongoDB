const User = require("../model/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  try {
    const { name, email, password, contactNumber, address } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, msg: "User already exists" });
    }

    //hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      contactNumber,
      address,
    });
    res.status(201).json({ success: true, msg: "Registered successfully" });
  } catch (error) {
    console.error("Register Error", error);
    res.status(500).json({ msg: "Server Error" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ success: false, msg: "User not found" });
    }

    //Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        msg: "Password incorrect",
      });
    }

    //create token
    const payload = {
      id: user._id,
      role: user.role,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
      expiresIn: "1d",
    });

    res.status(200).json({
      success: true,
      msg: "Login successful",
      token,
    });
  } catch (error) {
    console.error("Register Error", error);
    res.status(500).json({ msg: "Server Error" });
  }
};

const getUserInfo = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Register Error", error);
    res.status(500).json({ msg: "Server Error" });
  }
};

const doctorList = async (req, res) => {
  try {
    const doctors = await User.find({ role: "Doctor" }, { name: 1 });

    res.status(200).json({
      success: true,
      doctors,
    });
  } catch (error) {
    console.error("Register Error", error);
    res.status(500).json({ msg: "Server Error" });
  }
};

const profileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: "No image uploaded" });
    }

    await User.findByIdAndUpdate(req.user.id, {
      profileImage: `/uploads/profiles/${req.file.filename}`,
    });

    res.status(200).json({
      success: true,
      msg: "Profile image uploaded successfully",
    });
  } catch (error) {
    console.error("Register Error", error);
    res.status(500).json({ msg: "Server Error" });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};

module.exports = {
  register,
  login,
  getUserInfo,
  doctorList,
  profileImage,
  getAllUsers,
};
