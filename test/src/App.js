import React from 'react';
import RangeSlider from './RangeSlider';

const App = () => {
  return (
    <div>
      <div className="slider-container">
        <RangeSlider maxPrice={1000} />
      </div>
    </div>
  );
};

export default App;
