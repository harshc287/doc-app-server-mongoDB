const mongoose = require("mongoose")

const appointmentSchema = new mongoose.Schema(
    {
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        doctorId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required: true,
        },
        dateTime: {
            type: Date, 
            required: true,
        },
        status:{
            type: String,
            enum: ["Pending", "Accepted", "Completed", "Reject"],
            default: "Pending"
        },
        updatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model("Appointment", appointmentSchema)