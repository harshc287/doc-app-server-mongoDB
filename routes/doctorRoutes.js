const express = require("express");
const router = express.Router();

const doctorController = require("../controllers/doctorController");
const { auth, doctor, admin } = require("../middleware/auth");

// Apply for doctor
router.post("/apply", auth, doctorController.applyDoctor);

// Get logged-in doctor profile
router.get("/getDoctorInfo", auth, doctor, doctorController.getDoctorInfo);

// Update doctor profile
router.patch("/updateDoctor", auth, doctor, doctorController.updateDoctor);

// Admin: approve / reject doctor
router.patch("/docStatus/:DoctorID", auth, admin, doctorController.docStatus);

// Admin: delete doctor
router.delete("/deleteDoctor/:DoctorID", auth, admin, doctorController.deleteDoctor);

// Get all accepted doctors
router.get("/getAllDoctors", auth, doctorController.getAllDoctors);

module.exports = router;
