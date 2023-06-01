const knex = require("../database/knex")

class PlatesController {
  async create(request, response) {
    const {title, description, ingredients, category, price} = request.body
    const [plates_id] = await knex("plates").insert({
      title, 
      description, 
      category, 
      price
    })

    const ingredientsInsert = ingredients.map(ingredient => {
      return {
        name: ingredient,
        plates_id
      }
    })

    await knex("ingredients").insert(ingredientsInsert)

    return response.json()
  }

  async show(request, response) {
    const { id } = request.params

    const plate = await knex("plates").where({ id }).first()
    const ingredients = await knex("ingredients").where({ plates_id: id }).orderBy("name")

    return response.json({
      ...plate,
      ingredients
    })
  }
}

module.exports = PlatesController