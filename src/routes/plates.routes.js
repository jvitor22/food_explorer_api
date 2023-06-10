const { Router } = require("express")
const multer = require("multer")
const uploadConfig = require("../configs/upload")

const ensureAuthenticated = require("../middlewares/ensureAuthenticated")

const PlatesController = require("../controllers/PlatesController")
const PlateImageController = require("../controllers/PlateImageController")

const platesRoutes = Router()

const platesController = new PlatesController

const plateImageController = new PlateImageController

const upload = multer(uploadConfig.MULTER)

platesRoutes.use(ensureAuthenticated)
platesRoutes.post("/", platesController.create)
platesRoutes.get("/:id", platesController.show)
platesRoutes.delete("/:id", platesController.delete)
platesRoutes.get("/", platesController.index)
platesRoutes.patch("/:id/image", upload.single("image"), plateImageController.update)

module.exports = platesRoutes