import React from 'react';

function Ingredient({ index, ingredient, onDelete, onChange }) {
  const handleDelete = () => {
    onDelete(index);
  };

  const handleIngredientNameChange = (e) => {
    onChange(index, 'name', e.target.value);
  };

  const handleIngredientWeightChange = (e) => {
    onChange(index, 'weight', e.target.value);
  };

  return (
    <div className="ingredient">
      <input type="text" value={ingredient.name} placeholder="Ingredient Name" onChange={handleIngredientNameChange} />
      <input type="number" value={ingredient.weight} placeholder="Weight" onChange={handleIngredientWeightChange} />
      <button onClick={handleDelete}>Delete</button>
    </div>
  );
}

export default Ingredient;

