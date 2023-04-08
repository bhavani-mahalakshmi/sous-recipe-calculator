import traceback
from models import Recipe, Ingredient, RecipeIngredient
from db_init import session

def get_recipe():
    try:
        last_recipe = session.query(Recipe).order_by(Recipe.id.desc()).first()

        if last_recipe:
            results = session.query(
                Recipe.name,
                Recipe.cost,
                Ingredient.name,
                Ingredient.purchase_price,
                Ingredient.purchase_amount,
                RecipeIngredient.weight
            ).join(
                RecipeIngredient,
                Recipe.id == RecipeIngredient.recipe_id
            ).join(
                Ingredient,
                Ingredient.id == RecipeIngredient.ingredient_id
            ).filter(
                Recipe.id == last_recipe.id
            ).all()
            ingredients = []
            for row in results:
                ingredient = {
                    "name": row[2],
                    "purchase_price": row[3],
                    "purchase_amount": row[4],
                    "weight": row[5]
                }
                ingredients.append(ingredient)
            recipe_name = results[0][0]
            recipe_cost = results[0][1]
            output = {
                "recipe": {
                    "name": recipe_name,
                    "cost": recipe_cost,
                    "ingredients": ingredients
                },
            }
        else:
            output = None
        return output
    except Exception:
        print(traceback.format_exc())
        raise Exception("Error getting recipe")

def truncate_tables():
    try:
        session.query(RecipeIngredient).delete()
        session.query(Recipe).delete()
        session.query(Ingredient).delete()
        session.commit()
    except Exception:
        session.rollback()
        print(traceback.format_exc())

def insert_recipe(input):
    try:
        truncate_tables()
        recipe = Recipe(name=input['name'], cost=input['cost'])
        session.add(recipe)
        session.commit()
        recipe_id = recipe.id
        for ingredient in input['ingredients']:
            ingredient_entry = Ingredient(
                name=ingredient['name'],
                purchase_price=ingredient['purchase_price'],
                purchase_amount=ingredient['purchase_amount']
            )
            session.add(ingredient_entry)
            session.commit()
            ingredient_id = ingredient_entry.id
            recipe_ingredient = RecipeIngredient(
                recipe_id=recipe_id,
                ingredient_id=ingredient_id,
                weight=ingredient['weight']
            )
            session.add(recipe_ingredient)
            session.commit()
    except Exception:
        session.rollback()
        print(traceback.format_exc())
        raise Exception("Error inserting recipe")
