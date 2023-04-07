import axios from "axios";
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
    setIngredients([...ingredients, { name: '', weight: ''}]);
    setAddShowButton(false);
    setDoneShowButton(true);
  };

  const handleDone = () => {
    // Add ingredients to purchasedIngredients state
    const purchased = ingredients.map((ingredient) => ({
        name: ingredient.name,
        amount: 0,
        price: 0
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
    axios({
      method: "GET",
      url:"/recipe?id=1",
    })
    .then((response) => {
      const res =response.data.data.recipe
      setTotalCost(res.cost)
      setRecipeName(res.name)
      const ingredients = res.recipe_ingredients.map((ingredient) => ({
        name: ingredient.name,
        weight: ingredient.weight
      }));
      setIngredients(ingredients)
      const purchased = res.ingredients.map((ingredient) => ({
        name: ingredient.name,
        amount: ingredient.purchase_amount,
        price: ingredient.purchase_price
      }));
      setPurchasedIngredients(purchased)
    }).catch((error) => {
      if (error.response) {
        console.log(error.response)
        console.log(error.response.status)
        console.log(error.response.headers)
        }
    })
  }, []);

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
    let ingredientsMap = []
    ingredients.map((ingredient, index) => {
      ingredientsMap.push({
        name: ingredient.name,
        purchase_price: purchasedIngredients[index].price,
        purchase_amount: purchasedIngredients[index].amount,
        weight: ingredient.weight
      })
    })
    let body = {
      "recipe": {
          "name": recipeName,
          "cost": totalCost.toFixed(3),
          "ingredients": ingredientsMap
      }
  }
    axios.post('/recipe', body)
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
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
                    <th></th>
                    </tr>
                </thead>
                <tbody>
                    {ingredients.map((ingredient, index) => (
                    <Ingredient key={index} index={index} ingredient={ingredient} onDelete={handleDeleteIngredient} onChange={handleIngredientChange} />
                    ))}
                </tbody>
            </table>
            <div className='buttons-container'>
                {showAddButton && (
                <button onClick={handleAddIngredient}>Add Ingredient</button>
                )}       
                {showDoneButton && (
                <button onClick={handleDone}>Done</button>
                )}
            </div>
        </div>
        <div className="cost-container">
            <table className='cost-table'>
            <thead>
                <tr>
                <th>Ingredient</th>
                <th>Purchase Price</th>
                <th></th>
                <th>Purchase Amount</th>
                </tr>
            </thead>
            <tbody>
                {purchasedIngredients.map((ingredient, index) => (
                <tr key={index}>
                    <td>{ingredient.name}</td>
                    <td className="cost-row">
                        <strong>$</strong>
                        <input
                        type="number"
                        min="0"
                        step="0.01"
                        defaultValue={ingredient.price}
                        onChange={(event) => handlePurchaseChange(index, "price", event)}
                        />
                    </td>
                    <td><strong>per</strong></td>
                    <td className="cost-row">
                        <input
                        type="number"
                        min="0"
                        step="0.01"
                        defaultValue={ingredient.amount}
                        onChange={(event) => handlePurchaseChange(index, "amount", event)}
                        />
                        <strong>oz</strong>
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
                <div className="total-cost">
                    <table className='total-cost-table'>
                    <tbody>
                    <tr>
                      <td>
                          <label>Total Cost:</label>
                          <span>{totalCost}</span>
                      </td>
                      <td><button onClick={calculateTotalCost}>Calculate</button></td>
                    </tr>
                    </tbody>
              </table>
                </div>
        </div>
        </div>
    </div>
  );
}

export default App;
