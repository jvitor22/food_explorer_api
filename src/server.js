require("express-async-errors")
require("dotenv/config")
const express = require("express")
const cors = require("cors")
const AppError = require("./utils/AppError")
const routes = require("./routes")
const uploadConfig = require("./configs/upload")

const app = express()
app.use(cors())
app.use(express.json())
app.use(routes)

app.use((error, request, response, next) => {
  if (error instanceof AppError) {
    return response.status(error.statusCode).json({
      status: "error",
      message: error.message
    })
  }
  
  console.log(error.message)
  return response.status(500).json({
    status: "error",
    message: "Internal server error"
  })
})

app.use("/files", express.static(uploadConfig.UPLOADS_FOLDER))

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Server is running on Port ${PORT}`))