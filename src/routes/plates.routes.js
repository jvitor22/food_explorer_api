const { Router } = require("express")

const ensureAuthenticated = require("../middlewares/ensureAuthenticated")

const PlatesController = require("../controllers/PlatesController")

const platesRoutes = Router()

const platesController = new PlatesController

platesRoutes.use(ensureAuthenticated)

platesRoutes.post("/", platesController.create)
platesRoutes.get("/:id", platesController.show)
platesRoutes.delete("/:id", platesController.delete)
platesRoutes.get("/", platesController.index)

module.exports = platesRoutes