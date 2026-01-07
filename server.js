const express = require("express")
const dotenv = require("dotenv")
const connectDB = require("./config/db")
const cors = require("cors")

dotenv.config()
connectDB()

const app = express()

app.use(express.json())
app.use(cors())

app.use("/api/user", require("./routes/userRoutes"))


const PORT = process.env.PORT || 7005

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})