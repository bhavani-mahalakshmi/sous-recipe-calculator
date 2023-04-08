import axios from "axios";
import React, { useState, useEffect } from 'react';
import Ingredient from './Ingredient';

function App() {
  const [recipeName, setRecipeName] = useState('');
  const [ingredients, setIngredients] = useState([]);
  const [showAddButton, setAddShowButton] = useState(true);
  const [showDoneButton, setDoneShowButton] = useState(false);
  const [enableCalculateButton, setEnableCalculateButton] = useState(false);
  const [purchasedIngredients, setPurchasedIngredients] = useState([]);
  const [totalCost, setTotalCost] = useState(0.0);
  const [latestIngredient, setLatestIngredient] = useState({ name: '', weight: ''});
  const [calcCalled, setCalcCalled] = useState(false);

  const handleRecipeNameChange = (e) => {
    setRecipeName(e.target.value);
  };

  const handleAddIngredient = () => {
    setIngredients([...ingredients, { name: '', weight: ''}]);
    setAddShowButton(false);
  };

  const disableInputs = () => {
    const inputs = document.querySelectorAll('.ingredient input');
    for (let i = 0; i < inputs.length; i++) {
      inputs[i].setAttribute('disabled', true);
    }
  };

  const handleDone = () => {
    // Add ingredients to purchasedIngredients state
    const newPurchasedIngredients = [...purchasedIngredients];
    const count = ingredients.filter((ingredient) => ingredient.name === latestIngredient.name).length;
    if (count > 1) {
      alert('Ingredient already added. Please delete and re-add again if you want to change the weight.');
      return;
    }
    newPurchasedIngredients.push({ name: latestIngredient.name, amount: '', price: '' });
    setPurchasedIngredients(newPurchasedIngredients);
    setAddShowButton(true);
    setDoneShowButton(false);
    setEnableCalculateButton(false);
    disableInputs();
  };

  useEffect(() => {
    axios.get("/recipe").then((response) => {
      const res =response.data.data
      if(res) {
        let recipe = res.recipe
        setTotalCost(recipe.cost)
        setRecipeName(recipe.name)
        const ingredients = recipe.ingredients.map((ingredient) => ({
          name: ingredient.name,
          weight: ingredient.weight
        }));
        setIngredients(ingredients)
        const purchased = recipe.ingredients.map((ingredient) => ({
          name: ingredient.name,
          amount: ingredient.purchase_amount,
          price: ingredient.purchase_price
        }));
        setPurchasedIngredients(purchased);
        disableInputs();
      }
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
    if(newIngredients.length === 0) {
      setTotalCost(0.0);
      setEnableCalculateButton(false);
    }
    calculateTotalCost();
    setAddShowButton(true);
    setDoneShowButton(false);
    setEnableCalculateButton(true);
  };

  const toggleDoneButton = (ingredient) => {
        // enable Done button on all filled inputs
        const allInputsFilled = Object.values(ingredient).every(val => val !== '');
        if (allInputsFilled) {
          setDoneShowButton(true);
        } else {
          setDoneShowButton(false);
        }
  };    

  function checkInputsNotEmpty(className) {
    const inputs = document.querySelectorAll(`.${className} input`);
    let allFilled = true;
  
    for (let i = 0; i < inputs.length; i++) {
      if (!inputs[i].value) {
        allFilled = false;
        break;
      }
    }
    return allFilled;
  }

  const toggleCalculateButton = () => {
      if (checkInputsNotEmpty('cost-table')) {
        setEnableCalculateButton(true);
      } else {
        setEnableCalculateButton(false);
      }
  };

  const handleIngredientChange = (index, key, value) => {
    const newIngredients = [...ingredients];
    const ingredient = newIngredients[index];
    if (!ingredient) return; // Return if ingredient is undefined or null
    ingredient[key] = value;
    setLatestIngredient(ingredient);
    setIngredients(newIngredients);
    toggleDoneButton(ingredient);
  };

  const handlePurchaseChange = (index, key, event) => {
    const newPurchasedIngredients = [...purchasedIngredients];
    const ingredient = newPurchasedIngredients[index];
    if (!ingredient) return; // Return if ingredient is undefined or null
    ingredient[key] = event.target.value;
    setPurchasedIngredients(newPurchasedIngredients);
    toggleCalculateButton();
    // calculateTotalCost();
  };

  const calculateTotalCost = () => {
    if((ingredients.length !== purchasedIngredients.length) || (purchasedIngredients.some(({amount, price}) => !amount || !price))) {
      return;
    }
    let totalCost = 0;
    purchasedIngredients.forEach((ingredient, index) => {
      const costPerUnit = ingredient.price / ingredient.amount;
      totalCost += costPerUnit * ingredients[index].weight;
    });
    if(!isNaN(parseFloat(totalCost)) && isFinite(totalCost) && totalCost >= 0){
      setTotalCost(totalCost.toFixed(3));
    } else {
      setTotalCost(0.0);
    }
  };

  const save = () => {
    if (calcCalled) {
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
            "cost": parseFloat(totalCost).toFixed(3),
            "ingredients": ingredientsMap
        }
    }
      axios.post('/recipe', body)
      .then(function (response) {
        console.log(response);
        alert("Recipe saved successfully!");
      })
      .catch(function (error) {
        console.log(error);
        alert("There was an error saving the recipe. Please recheck the values and try again.")
      });
      setCalcCalled(false);
    }
  }
  useEffect(() => {
    // Run the save function whenever totalCost changes
    save();
  }, [totalCost]);

  const handleCalculate = () => {
    if (recipeName === '') {
      alert('Please enter a recipe name');
      return;
    }
    calculateTotalCost(true);
    if (ingredients.length === 0) {
      alert('Please add ingredients');
      return;
    }
    setCalcCalled(true);
    save();
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
                        placeholder="Purchase Price"
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
                        placeholder="Purchase Amount"
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
                      <td>
                        <button onClick={handleCalculate} disabled={!enableCalculateButton}>Calculate</button>
                      </td>
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
