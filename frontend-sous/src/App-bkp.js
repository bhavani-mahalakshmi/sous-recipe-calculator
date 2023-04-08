import React, { useState } from 'react';
import Ingredient from './Ingredient';

function App() {
  const [recipeName, setRecipeName] = useState('');
  const [ingredients, setIngredients] = useState([]);
  const [showAddButton, setAddShowButton] = useState(true);
  const [showDoneButton, setDoneShowButton] = useState(false);
  const [purchaseIngredients, setPurchaseIngredients] = useState([]);

  const handleRecipeNameChange = (e) => {
    setRecipeName(e.target.value);
  };

  const handleAddIngredient = () => {
    const newIngredients = [...ingredients, { name: '', weight: '', amount: '', price: '' }];
    setIngredients(newIngredients);

    const newPurchaseIngredients = [...purchaseIngredients, { name: '', amount: 0, price: 0 }];
    setPurchaseIngredients(newPurchaseIngredients);

    setAddShowButton(false);
    setDoneShowButton(true);
  };

  const handleDone = () => {
    setAddShowButton(true);
    setDoneShowButton(false);
    const inputs = document.querySelectorAll('.ingredient input');
    inputs.forEach((input) => {
        input.setAttribute('disabled', true);
    });
  };

  const handleDeleteIngredient = (index) => {
    const newIngredients = [...ingredients];
    newIngredients.splice(index, 1);
    setIngredients(newIngredients);

    const newPurchaseIngredients = [...purchaseIngredients];
    newPurchaseIngredients.splice(index, 1);
    setPurchaseIngredients(newPurchaseIngredients);
  };

  const handleIngredientChange = (index, key, value) => {
    const newIngredients = [...ingredients];
    newIngredients[index][key] = value;
    setIngredients(newIngredients);
  };

  const calculateTotalCost = () => {
    let totalCost = 0;
    ingredients.forEach((ingredient, index) => {
      const costPerUnit = purchaseIngredients[index].price / purchaseIngredients[index].amount;
      totalCost += costPerUnit * ingredient.weight;
    });
    return totalCost.toFixed(2);
  };

  return (
    <div className="recipe-container">
      <div className="ingredients-container">
        <h2>Ingredients</h2>
        <label htmlFor="recipe-name">Recipe Name:</label>
        <input type="text" id="recipe-name" value={recipeName} onChange={handleRecipeNameChange} />
        {ingredients.map((ingredient, index) => (
          <Ingredient key={index} index={index} ingredient={ingredient} onDelete={handleDeleteIngredient} onChange={handleIngredientChange} />
        ))}
        {showAddButton && (
            <button onClick={handleAddIngredient}>Add Ingredient</button>
        )}       
        {showDoneButton && (
            <button onClick={handleDone}>Done</button>
        )}
      </div>
      <div className="cost-container">
        <div className="ingredient-costs">
          {ingredients.map((ingredient, index) => (
            <div key={index}>
              <label>{ingredient.name}</label>
              <input type="number" min="0" step="any" value={ingredient.amount} onChange={(e) => handleIngredientChange(index, 'amount', e.target.value)} />
              <input type="number" min="0" step="any" value={ingredient.price} onChange={(e) => handleIngredientChange(index, 'price', e.target.value)} />
            </div>
          ))}
          <div>
            <label>Total Cost:</label>
            <span>{calculateTotalCost()}</span>
          </div>
        </div>
        <button onClick={calculateTotalCost}>Calculate</button>
      </div>
    </div>
  );
          }
  export default App;