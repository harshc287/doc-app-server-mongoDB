const Doctor = require("../model/doctorModel")
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
    if (existing && existing.status === "Pending") {
      return res.status(400).json({
        success: false,
        msg: "Doctor application already pending",
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


exports.getDoctorInfo = async (req, res) => {
  try {

    const doctor = await Doctor.findOne({
      createdBy: req.user.id,

    }).populate("createdBy", "name email contactNumber")

    if(!doctor){
      return res.status(404).json({success: false , msg: "Doctor Profile Not Found"})
    }

    res.status(200).json({success:true, doctor})
    
  } catch (error) {
    console.error("Get Doctor Info Error:", error);
    res.status(500).json({
      success: false,
      msg: "Server error",
    });
  }
}

exports.updateDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({
      createdBy: req.user.id,
    })

    if(!doctor){
      return res.status(404).json({
        success: false,
        msg: "Doctor profile not found",
      });
    }

    doctor.specialist = req.body.specialist ?? doctor.specialist;
    doctor.fees = req.body.fees ?? doctor.fees
    
    await doctor.save()

      res.status(200).json({
      success: true,
      msg: "Doctor profile updated successfully",
      doctor,
    });

  } catch (error) {
    console.error("Update Doctor Error:", error);
    res.status(500).json({
      success: false,
      msg: "Server error",
    });
  }
}

exports.docStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["Accepted", "Rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        msg: "Invalid status value",
      });
    }

    const doctor = await Doctor.findById(req.params.doctorId);
    console.log(req.params);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        msg: "Doctor not found",
      });
    }


    // update doctor status
    doctor.status = status;
    await doctor.save();

    if (status === "Accepted") {
      await User.findByIdAndUpdate(doctor.createdBy, {
        role: "Doctor",
      });
    }

    if (status === "Rejected") {
      await User.findByIdAndUpdate(doctor.createdBy, {
        role: "User",
      });
    }

    res.status(200).json({
      success: true,
      msg: `Doctor application ${status}`,
    });
  } catch (error) {
    console.error("Doctor Status Error:", error);
    res.status(500).json({
      success: false,
      msg: "Server error",
    });
  }
};


exports.deleteDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.DoctorID);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        msg: "Doctor not found",
      });
    }

    await Doctor.findByIdAndDelete(req.params.DoctorID);

    await User.findByIdAndUpdate(doctor.createdBy, {
      role: "User",
    });

    res.status(200).json({
      success: true,
      msg: "Doctor deleted successfully",
    });
  } catch (error) {
    console.error("Delete Doctor Error:", error);
    res.status(500).json({
      success: false,
      msg: "Server error",
    });
  }
};

exports.getAllDoctors = async (req, res) => {
  try {

    let query = {}
    if(req.user.role === "Admin"){
      query ={}
    }else{
      query = {status :"Accepted"}
    }
    const doctors = await Doctor.find(query)
      .populate("createdBy", "name email contactNumber role");

     res.status(200).json({
      success: true,
      doctors,
    });
    
  } catch (error) {
    console.error("Get All Doctors Error:", error);
    res.status(500).json({
      success: false,
      msg: "Server error",
    });
  }
}

// controller/doctorController.js
exports.getApplicationStatus = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ createdBy: req.user.id });

    if (!doctor) {
      return res.status(200).json({
        exists: false,
        msg: "No application found",
      });
    }

    res.status(200).json({
      exists: true,
      status: doctor.status,
    });
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};
