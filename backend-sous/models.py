from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

Base = declarative_base()

class Recipe(Base):
    __tablename__ = 'recipes'
    id = Column(Integer, primary_key=True)
    name = Column(String(255), nullable=False, unique=True)
    cost = Column(Float, nullable=False)
    recipe_ingredients = relationship('RecipeIngredient', back_populates='recipe')

class Ingredient(Base):
    __tablename__ = 'ingredients'
    id = Column(Integer, primary_key=True)
    name = Column(String(255), nullable=False, unique=True)
    purchase_price = Column(Float, nullable=False)
    purchase_amount = Column(Float, nullable=False)
    recipe_ingredients = relationship('RecipeIngredient', back_populates='ingredient')

class RecipeIngredient(Base):
    __tablename__ = 'recipe_ingredients'
    recipe_id = Column(Integer, ForeignKey('recipes.id'), primary_key=True)
    ingredient_id = Column(Integer, ForeignKey('ingredients.id'), primary_key=True)
    weight = Column(Float, nullable=False)
    recipe = relationship('Recipe', back_populates='recipe_ingredients')
    ingredient = relationship('Ingredient', back_populates='recipe_ingredients')