const knex = require('../database/knex')

const AppError = require('../utils/AppError')
const DiskStorage = require('../providers/DiskStorage')

class PlateImageController {
    async update(request, response) {
        const { id } = request.params
        const imageFileName = request.file.filename

        const diskStorage = new DiskStorage       

        const plate = await knex("plates").where({ id }).first()
        
        if(!plate) {
          throw new AppError("Prato não existe.")
        }

        if(plate.image) {
          await diskStorage.deleteFile(plate.image)
        }

        const filename = await diskStorage.saveFile(imageFileName)
        plate.image = filename

        await knex("plates").update(plate).where({ id })

        return response.json(plate)
    }
}

module.exports = PlateImageController