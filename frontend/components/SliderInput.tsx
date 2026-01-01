import React from 'react';

interface SliderInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  minLabel?: string;
  maxLabel?: string;
  displayValue?: string;
}

const SliderInput: React.FC<SliderInputProps> = ({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  unit = '',
  minLabel,
  maxLabel,
  displayValue,
}) => {
  const [inputValue, setInputValue] = React.useState('');
  const [isEditing, setIsEditing] = React.useState(false);
  const percentage = ((value - min) / (max - min)) * 100;

  React.useEffect(() => {
    if (!isEditing) {
      const formatted = displayValue || `${value}${unit}`;
      setInputValue(formatted.replace(unit, ''));
    }
  }, [value, displayValue, unit, isEditing]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputFocus = () => {
    setIsEditing(true);
  };

  const handleInputBlur = () => {
    setIsEditing(false);
    const cleanValue = inputValue.replace(/[^0-9.-]/g, '');
    const numValue = parseFloat(cleanValue);
    if (!isNaN(numValue)) {
      const clampedValue = Math.max(min, Math.min(max, numValue));
      onChange(clampedValue);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      (e.target as HTMLInputElement).blur();
    }
  };

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <div className="bg-blue-500 px-4 py-1.5 rounded-lg relative">
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            onKeyPress={handleKeyPress}
            title={label}
            aria-label={label}
            className="text-lg font-bold text-white bg-transparent text-center outline-none w-20 placeholder-blue-200"
            placeholder={`${value}${unit}`}
          />
          <span className="text-lg font-bold text-white ml-1">{unit}</span>
        </div>
      </div>
      
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="slider-input w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, #2196F3 0%, #2196F3 ${percentage}%, #E5E7EB ${percentage}%, #E5E7EB 100%)`
          }}
        />
        <div className="absolute w-6 h-6 bg-blue-500 border-4 border-white rounded-full shadow-md pointer-events-none transition-all"
          style={{
            left: `calc(${percentage}% - 12px)`,
            top: '50%',
            transform: 'translateY(-50%)',
          }}
        />
      </div>
      
      <div className="flex justify-between mt-2">
        <span className="text-xs text-gray-500">{minLabel || `${min}${unit}`}</span>
        <span className="text-xs text-gray-500">{maxLabel || `${max}${unit}`}</span>
      </div>
    </div>
  );
};

export default SliderInput;
