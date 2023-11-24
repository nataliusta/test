import React, { useState, useRef, useEffect } from 'react';
import './RangeSlider.css';

const formatPrice = (price) => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

const RangeSlider = ({ maxPrice: initialMaxPrice }) => {
  const sliderRef = useRef(null);

  const [range, setRange] = useState({ min: 0, max: initialMaxPrice });
  const [isDragging, setIsDragging] = useState(false);

  const getGradientStops = () => {
    const minStop = (range.min / initialMaxPrice) * 100;
    const maxStop = (range.max / initialMaxPrice) * 100;
    return `linear-gradient(to right, #FFECBB 0%, #FFECBB ${minStop}%, #FDC840 ${minStop}%, #FDC840 ${maxStop}%, #FFECBB ${maxStop}%, #FFECBB 100%)`;
  };

  useEffect(() => {
    setRange((prevRange) => ({
      min: Math.min(prevRange.min, initialMaxPrice),
      max: Math.min(prevRange.max, initialMaxPrice),
    }));
  }, [initialMaxPrice]);

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleInputChange = (key, value) => {
    let newValue = parseInt(value.replace(/\D/g, ''), 10);
    newValue = Math.min(1000, Math.max(0, newValue));

    setRange((prevRange) => ({
      ...prevRange,
      [key]:
        key === 'min'
          ? Math.min(newValue, prevRange.max)
          : Math.max(newValue, prevRange.min),
    }));
  };

  const handleInputBlur = (key, value) => {
    let newValue = parseInt(value.replace(/\D/g, ''), 10);
    newValue = Math.min(1000, Math.max(0, newValue));

    setRange((prevRange) => ({
      ...prevRange,
      [key]:
        key === 'min'
          ? Math.min(newValue, 1000)
          : Math.min(prevRange.max, 1000),
    }));
  };

  const handleMouseDown = (key) => () => {
    setIsDragging(key);
  };

  const handleMouseMove = (e) => {
    if (isDragging !== null) {
      const sliderRect = sliderRef.current.getBoundingClientRect();
      let percentage = (e.clientX - sliderRect.left) / sliderRect.width;
      percentage = Math.min(1, Math.max(0, percentage));
      const newValue = Math.round(initialMaxPrice * percentage);

      setRange((prevRange) => {
        const min =
          isDragging === 'min'
            ? Math.min(newValue, prevRange.max)
            : prevRange.min;
        const max =
          isDragging === 'max'
            ? Math.max(newValue, prevRange.min)
            : prevRange.max;

        return { min, max };
      });
    }
  };

  return (
    <div className="range-slider" ref={sliderRef}>
      <div className="slider-bar" style={{ background: getGradientStops() }}>
        <div
          className="slider-thumb"
          style={{ left: `${(range.min / initialMaxPrice) * 100}%` }}
          onMouseDown={handleMouseDown('min')}
        />
        <div
          className="slider-thumb"
          style={{ left: `${(range.max / initialMaxPrice) * 100}%` }}
          onMouseDown={handleMouseDown('max')}
        />
      </div>
      <div className="price-inputs">
        <input
          type="text"
          value={formatPrice(range.min)}
          onChange={(e) => handleInputChange('min', e.target.value)}
          onBlur={(e) => handleInputBlur('min', e.target.value)}
          min="0"
          max="1000"
          className="numeric-input"
        />
        <input
          type="text"
          value={formatPrice(range.max)}
          onChange={(e) => handleInputChange('max', e.target.value)}
          onBlur={(e) => handleInputBlur('max', e.target.value)}
          min="0"
          max="1000"
          className="numeric-input"
        />
      </div>
      {isDragging && (
        <div
          className="overlay"
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        />
      )}
    </div>
  );
};

export default RangeSlider;