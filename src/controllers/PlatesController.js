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

    const ingredientsInsert = ingredients?.map(ingredient => {
      return {
        name: ingredient,
        plates_id
      }
    })

    if (ingredientsInsert?.length > 0) {
      await knex("ingredients").insert(ingredientsInsert)
    }

    return response.json({id: plates_id})
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

  async delete(request, response) {
    const { id } = request.params
    
    await knex("plates").where({ id }).delete()

    return response.json()
  }

  async index(request, response) {
    const { title, ingredients } = request.query

    let plates

    if(ingredients) {
      const filterIngredients = ingredients.split(',').map(ingredient => ingredient.trim())

      plates = await knex("ingredients")
        .select([
          "plates.id",
          "plates.title",
          "plates.description",
          "plates.category",
          "plates.price",
          "plates.image"          
        ])
        .whereLike("plates.title", `%${title}%`)
        .whereIn("name", filterIngredients)
        .innerJoin("plates", "plates.id", "ingredients.plates_id")
        .groupBy("plates.id")
        .orderBy("plates.title")
    } else {
      plates = await knex("plates")
        .whereLike("title", `%${title}%`)
        .orderBy("title")
    }

    const platesIngredients = await knex("ingredients")

    const platesWithIngredients = plates.map(plate => {
      const plateIngredients = platesIngredients.filter(ingredient => ingredient.plates_id === plate.id)

      return {
        ...plate,
        ingredients: plateIngredients
      }
    })

    return response.json(platesWithIngredients)
  }
}

module.exports = PlatesController