const mongoose = require('mongoose')


const UserSchema = new mongoose.Schema(
    {
        name:{
            type:String,
            required:true,
            maxLength: 200,
        },
        email: {
            type: String,
            required: true,
            unique:true,
            maxLength:200,
        },
        password:{
            type: String,
            required: true,
        },
        address:{
            type:String,

        },
        contactNumber: {
            type: String,
            required:true,
        },
        role:{
            type: String,
            enum: ['Admin', 'User', 'Doctor'],
            default:'User',
        },
        profileImage:{
            type: String,
            default: null,
        },

    },{
        timestamps: true,
    }
)

module.exports = mongoose.model('User', UserSchema);