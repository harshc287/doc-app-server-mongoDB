const jwt = require("jsonwebtoken")
const User = require("../model/userModel")

const auth = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1]

    if(!token){
        return res.status(401).json({ msg: "No token provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
        req.user = decoded
        next()

    } catch (error) {
    res.status(401).json({ msg: "Invalid token" });
  }
}

const doctor =(req, res, next) =>{
    if(req.user.role !== "Doctor") {
        return res.status(403).json({msg:"Doctor access only"})
    }
    next()
}

const admin = (req, res, next) => {
    if(req.user.role !== "Admin"){
        return res.status(403).json({msg: "Admin access only", success: false})
    }
    next()
}

module.exports = { auth, admin, doctor };