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
    <tr className="ingredient">
      <td>
        <input type="text" value={ingredient.name} placeholder="Ingredient Name" onChange={handleIngredientNameChange} />
      </td>
      <td>
        <input type="number" value={ingredient.weight} placeholder="Weight" onChange={handleIngredientWeightChange} />
      </td>
      <td>
        <button onClick={handleDelete}>Delete</button>
      </td>
    </tr>
  );
}

export default Ingredient;
