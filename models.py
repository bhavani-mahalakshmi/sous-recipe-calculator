from sqlalchemy import Column, Integer, String, Numeric, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

Base = declarative_base()

class Recipe(Base):
    __tablename__ = 'recipes'
    id = Column(Integer, primary_key=True)
    name = Column(String)
    cost = Column(Numeric(precision=10, scale=3))

class Ingredient(Base):
    __tablename__ = 'ingredients'
    id = Column(Integer, primary_key=True)
    name = Column(String)
    purchase_price = Column(Numeric(precision=10, scale=3))
    purchase_amount = Column(Numeric(precision=10, scale=3))

class RecipeIngredient(Base):
    __tablename__ = 'recipe_ingredients'
    recipe_id = Column(Integer, ForeignKey('recipes.id'), primary_key=True)
    ingredient_id = Column(Integer, ForeignKey('ingredients.id'), primary_key=True)
    weight = Column(Numeric(precision=10, scale=3))
    recipe = relationship("Recipe", backref="recipe_ingredients")
    ingredient = relationship("Ingredient", backref="recipe_ingredients")
