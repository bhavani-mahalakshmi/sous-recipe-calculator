import React, { useState } from 'react';
import Ingredient from './Ingredient';

function App() {
  const [recipeName, setRecipeName] = useState('');
  const [ingredients, setIngredients] = useState([]);
  const [showAddButton, setAddShowButton] = useState(true);
  const [showDoneButton, setDoneShowButton] = useState(false);
  const [purchasedIngredients, setPurchasedIngredients] = useState([]);
  const [totalCost, setTotalCost] = useState(0.0);

  const handleRecipeNameChange = (e) => {
    setRecipeName(e.target.value);
  };

  const handleAddIngredient = () => {
    setIngredients([...ingredients, { name: '', weight: '', amount: '', price: '' }]);
    setAddShowButton(false);
    setDoneShowButton(true);
  };

  const handleDone = () => {
    // Add ingredients to purchasedIngredients state
    const purchased = ingredients.map((ingredient) => ({
        name: ingredient.name,
        amount: 0,
        price: 0,
      }));
    setPurchasedIngredients(purchased);
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
    purchasedIngredients.splice(index, 1);
    setIngredients(newIngredients);
    setPurchasedIngredients(purchasedIngredients);
  };

  const handleIngredientChange = (index, key, value) => {
    const newIngredients = [...ingredients];
    const ingredient = newIngredients[index];
    if (!ingredient) return; // Return if ingredient is undefined or null
    ingredient[key] = value;
    setIngredients(newIngredients);
  };

  const calculateTotalCost = () => {
    let totalCost = 0;
    ingredients.forEach((ingredient, index) => {
      const costPerUnit = purchasedIngredients[index].price / purchasedIngredients[index].amount;
      totalCost += costPerUnit * ingredient.weight;
    });
    setTotalCost(totalCost.toFixed(3));
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
        <h2>Cost</h2>
        <div className="total-cost">
          <label>Total Cost:</label>
          <span>{totalCost}</span>
        </div>
        <button onClick={calculateTotalCost}>Calculate</button>
        <table>
          <thead>
            <tr>
              <th>Ingredient</th>
              <th>Purchase Amount</th>
              <th>Purchase Price</th>
            </tr>
          </thead>
          <tbody>
            {purchasedIngredients.map((ingredient, index) => (
              <tr key={index}>
                <td>{ingredient.name}</td>
                <td><input type="number" min="0" step="0.01" defaultValue={ingredient.amount} /></td>
                <td><input type="number" min="0" step="0.01" defaultValue={ingredient.price} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
