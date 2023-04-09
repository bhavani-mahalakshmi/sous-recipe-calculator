import React, { useState } from 'react';

function PurchaseInput() {
  const [inputValue, setInputValue] = useState('');

  function handleBlur() {
    // do something with the input value
    console.log('Input value:', inputValue);
  }

  return (
    <input 
      type="text"
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
      onBlur={handleBlur}
    />
  );
}
export default PurchaseInput;