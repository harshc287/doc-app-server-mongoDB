const mongoose = require('mongoose')

const doctorSchema = new  mongoose.Schema(
    {
        specialist:{
            type: String,
            required: true,
            trim: true
        },
        fees:{
            type: Number,
            required: true
        },
        createdBy:{
            type: mongoose.Schema.Types.ObjectId,
            ref:"User",
            
        },
        updatedBy:{
            type: mongoose.Schema.Types.ObjectId,
            ref:"User",
            
        },
        // userID:{
        //     type: mongoose.Schema.Types.ObjectId,
        //     ref:"User",
            
        // },
        status:{
            type: String,
            enum: ["Pending", "Accepted", "Rejected"],
            default: 'Pending'
        }
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model('Doctor', doctorSchema);