const express = require("express");
const router = express.Router();

const appointmentController = require("../controller/appointmentController");
const { auth, doctor } = require("../middleware/auth");

// Create appointment
router.post("/create", auth, appointmentController.createAppointment);

// Doctor updates appointment status
router.patch(
  "/statusUpdateByDoctor/:id",
  auth,
  doctor,
  appointmentController.statusUpdateByDoctor
);

// Get appointments (User / Doctor)
router.get(
  "/getAppointmentsByUser",
  auth,
  appointmentController.getAppointmentsByUser
);

// Doctor: get own appointments
router.get(
  "/showAppointmentsOfDoctor",
  auth,
  doctor,
  appointmentController.showAppointmentsOfDoctor
);

// Update appointment
router.put("/update/:id", auth, appointmentController.updateAppointment);

// Delete appointment
router.delete("/delete/:id", auth, appointmentController.deleteAppointment);

module.exports = router;
