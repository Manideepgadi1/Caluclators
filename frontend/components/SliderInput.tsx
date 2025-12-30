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
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <div className="bg-gray-100 px-4 py-1.5 rounded-lg">
          <span className="text-lg font-bold text-gray-800">
            {displayValue || `${value}${unit}`}
          </span>
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
