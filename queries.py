import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import Recipe, Ingredient, RecipeIngredient

# create an engine and session to connect to the database
user=os.environ['DB_USERNAME']
password=os.environ['DB_PASSWORD']
db = os.environ['DB_NAME']
engine = create_engine(f'postgresql://{user}:{password}@localhost:5432/{db}')
Session = sessionmaker(bind=engine)
session = Session()

def get_recipe(recipe_id):
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
        Recipe.id == recipe_id
    ).all()
    ingredients = []
    recipe_ingredients = []
    for row in results:
        ingredient = {
            "name": row[2],
            "purchase_price": row[3],
            "purchase_amount": row[4]
        }
        ingredients.append(ingredient)
        recipe_ingredient = {
            "name": row[2],
            "weight": row[5]
        }
        recipe_ingredients.append(recipe_ingredient)
    recipe_name = results[0][0]
    recipe_cost = results[0][1]
    output = {
        "recipe": {
            "name": recipe_name,
            "cost": recipe_cost,
            "ingredients": ingredients,
            "recipe_ingredients": recipe_ingredients
        },
    }
    return output

def insert_recipe(input):
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