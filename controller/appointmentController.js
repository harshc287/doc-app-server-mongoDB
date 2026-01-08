
const Appointment = require("../model/appointmentModel.js")

//@access  Private (User)
exports.createAppointment = async (req , res) => {
    try {
        const { dateTime , doctorId} = req.body

        const appointment = await Appointment.create({
            dateTime, 
            doctorId,
            createdBy: req.user.id,
        })

        res.status(201).json({
      success: true,
      msg: "Appointment created successfully",
      appointment,
    });
        
    } catch (error) {
    console.error("Create Appointment Error:", error);
    res.status(500).json({
      success: false,
      msg: "Server error",
    });
  }
}

//@access  Private (Doctor)
exports.statusUpdateByDoctor = async (req, res) => {
    try {
        const {status} = req.body

        const allowedStatus = ["Pending", "Accepted", "Completed", "Reject"]
        
        if(!allowedStatus.includes(status)){
            return res.status(400).json({success: false, msg:"Invalid Status value",})
        }

        const appointment = await Appointment.findOne({
            _id: req.params.id,
            doctorId: req.user.id,
        }) 

        if(!appointment){
            return res.status(404).json({success: false, msg: "Appointment Not found or Unauthorized"})
        }
        appointment.status = status 
        appointment.updatedBy = req.user.id
        await appointment.save()

    res.status(200).json({
      success: true,
      msg: "Appointment status updated successfully",
    });

    } catch (error) {
    console.error("Status Update Error:", error);
    res.status(500).json({
      success: false,
      msg: "Server error",
    });
  }
}

//@access  Private (User)
exports.updateAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findOne({
            _id: req.params.id,
            createdBy: req.user.id,
        })

        if(!appointment){
            return res.status(404).json({success:false, msg:"Appointment Not found or unauthorized"})
        }
        
        appointment.dateTime = req.body.dateTime ?? appointment.dateTime;
        appointment.doctorId = req.body.doctorId ?? appointment.doctorId;
        appointment.updatedBy = req.user.id;

        await appointment.save()

        res.status(200).json({success:true, msg: "Appointment Updated Successfully", appointment})


    } catch (error) {
    console.error("Update Appointment Error:", error);
    res.status(500).json({
      success: false,
      msg: "Server error",
    });
}
}

//@access  Private (User)
exports.deleteAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findOneAndDelete({
            _id: req.params.id,
            createdBy: req.user.id,
        })

        if(!appointment){
            return res.status(404).json({success: false, msg:"Appointment not found or unauthorized"})
        }

        res.status(200).json({
        success: true,
        msg: "Appointment deleted successfully",
    });

        
    } catch (error) {
    console.error("Delete Appointment Error:", error);
    res.status(500).json({
      success: false,
      msg: "Server error",
    });
  }
}

//access  Private
exports.getAppointmentsByUser = async (req, res) => {
    try {
        let filter = {}

        if(req.user.role === "User"){
            filter.createdBy = req.user.id
        }

        if(req.user.role === "Doctor"){
            filter.doctorId = req.user.id
        }
        else {
        return res.status(403).json({
        success: false,
        msg: "Unauthorized role",
        });
        }

        const appointments = await Appointment.find(filter)
        .populate("createdBy", "name email")
        .populate("doctorId", "name email")
        .sort({ dateTime: -1})

        res.status(200).json({
        success: true,
        appointments,
    });
        
    } catch (error) {
    console.error("Get Appointments Error:", error);
    res.status(500).json({
      success: false,
      msg: "Server error",
    });
  }
}

//@access  Private (Doctor)
exports.showAppointmentsOfDoctor = async (req, res) => {
    try {
        const appointments = await Appointment.find({
            doctorId: req.user.id,

        })

        .populate("createdBy", "name email")
        .sort({ dateTime: -1 });

    res.status(200).json({
      success: true,
      appointments,
    });
        
    } catch (error) {
    console.error("Show Doctor Appointments Error:", error);
    res.status(500).json({
      success: false,
      msg: "Server error",
    });
  }
}