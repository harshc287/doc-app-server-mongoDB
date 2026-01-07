const Doctor = require("../model")
const User = require("../model/userModel")


exports.applyDoctor = async (req, res) => {
  try {
    if (req.user.role === "Doctor") {
      return res.status(400).json({
        success: false,
        msg: "You are already a Doctor",
      });
    }

    const existing = await Doctor.findOne({ createdBy: req.user.id });
    if (existing) {
      return res.status(400).json({
        success: false,
        msg: "Doctor application already submitted",
      });
    }

    const doctor = await Doctor.create({
      specialist: req.body.specialist,
      fees: req.body.fees,
      createdBy: req.user.id,
    });

    res.status(201).json({
      success: true,
      msg: "Doctor applied successfully",
      doctor,
    });
  } catch (error) {
    console.error("Apply Doctor Error:", error);
    res.status(500).json({
      success: false,
      msg: "Server error",
    });
  }
};