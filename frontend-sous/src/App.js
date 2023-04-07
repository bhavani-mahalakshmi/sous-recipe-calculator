import React, { useState, useEffect } from 'react';
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

  useEffect(() => {
    console.log(totalCost);
  }, [totalCost]);

  const handleDeleteIngredient = (index) => {
    const newIngredients = [...ingredients];
    newIngredients.splice(index, 1);
    setIngredients(newIngredients);
    const newPurchasedIngredients = [...purchasedIngredients];
    newPurchasedIngredients.splice(index, 1);
    setPurchasedIngredients(newPurchasedIngredients);
    calculateTotalCost();
  };

  const handleIngredientChange = (index, key, value) => {
    const newIngredients = [...ingredients];
    const ingredient = newIngredients[index];
    if (!ingredient) return; // Return if ingredient is undefined or null
    ingredient[key] = value;
    setIngredients(newIngredients);
  };

  const handlePurchaseChange = (index, key, event) => {
    const newPurchasedIngredients = [...purchasedIngredients];
    const ingredient = newPurchasedIngredients[index];
    if (!ingredient) return; // Return if ingredient is undefined or null
    ingredient[key] = event.target.value;
    setPurchasedIngredients(newPurchasedIngredients);
    // calculateTotalCost();
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
    <div>
        <div className='recipe-name-container'>
            <label htmlFor="recipe-name">Recipe Name:</label>
            <input type="text" id="recipe-name" value={recipeName} onChange={handleRecipeNameChange} />
        </div>
        <div className="recipe-container">
        <div className="ingredients-container">
            <table>
                <thead>
                    <tr>
                    <th>Name</th>
                    <th>Amount</th>
                    </tr>
                </thead>
            </table>
            {ingredients.map((ingredient, index) => (
            <Ingredient key={index} index={index} ingredient={ingredient} onDelete={handleDeleteIngredient} onChange={handleIngredientChange} />
            ))}
            {showAddButton && (
            <button className="add-ingredient" onClick={handleAddIngredient}>Add Ingredient</button>
            )}       
            {showDoneButton && (
            <button onClick={handleDone}>Done</button>
            )}
        </div>
        <div className="cost-container">
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
                    <td>
                        <input
                        type="number"
                        min="0"
                        step="0.01"
                        defaultValue={ingredient.amount}
                        onChange={(event) => handlePurchaseChange(index, "amount", event)}
                        />
                    </td>
                    <td>
                        <input
                        type="number"
                        min="0"
                        step="0.01"
                        defaultValue={ingredient.price}
                        onChange={(event) => handlePurchaseChange(index, "price", event)}
                        />
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
            <div className="total-cost">
            <label>Total Cost:</label>
            <span>{totalCost}</span>
            </div>
            <button onClick={calculateTotalCost}>Calculate</button>
        </div>
        </div>
    </div>
  );
}

export default App;
