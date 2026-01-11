const Appointment = require("../model/appointmentModel.js");
const User = require("../model/userModel.js");
const Doctor = require("../model/doctorModel.js");

exports.getDashboardStats = async (req, res) => {
 try {
    const totalAppointments = await Appointment.countDocuments();

    const doctorsOnline = await Doctor.countDocuments({
      status: "Approved",
    });

    const activeUsers = await User.countDocuments({
      role: "User",
    });

    const pendingRequests = await Appointment.countDocuments({
      status: "Pending",
    });

    const recentAppointments = await Appointment.find()
      .populate("doctorId", "name")
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      stats: {
        totalAppointments,
        doctorsOnline,
        activeUsers,
        pendingRequests,
      },
      recentActivities: recentAppointments.map((a) => ({
        time: new Date(a.createdAt).toLocaleString(),
        action: `Appointment with Dr. ${a.doctorId?.name}`,
        status: a.status === "Approved" ? "success" : "warning",
      })),
    });
  } catch (error) {
    console.error("Dashboard Error:", error);
    res.status(500).json({
      success: false,
      message: "Dashboard data error",
    });
  }
};