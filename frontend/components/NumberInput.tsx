import React from 'react';
import { formatCurrency, parseCurrency, clamp } from '@/utils/formatters';

interface NumberInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  prefix?: string;
  suffix?: string;
  showButtons?: boolean;
}

const NumberInput: React.FC<NumberInputProps> = ({
  label,
  value,
  onChange,
  min = 0,
  max = Infinity,
  step = 1,
  prefix = '₹',
  suffix = '',
  showButtons = true,
}) => {
  const [inputValue, setInputValue] = React.useState(displayValue);

  React.useEffect(() => {
    const formatted = prefix === '₹' 
      ? formatCurrency(value, 0).replace('₹', '')
      : value.toLocaleString('en-IN');
    setInputValue(formatted);
  }, [value, prefix]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    setInputValue(rawValue);
  };

  const handleBlur = () => {
    const cleanValue = inputValue.replace(/[₹,\s]/g, '');
    const numValue = parseFloat(cleanValue) || 0;
    onChange(clamp(numValue, min, max));
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleBlur();
    }
  };

  const handleIncrement = () => {
    const newValue = Math.min(value + step, max);
    onChange(newValue);
  };

  const handleDecrement = () => {
    const newValue = Math.max(value - step, min);
    onChange(newValue);
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="flex items-center gap-2">
        <div className="flex-1 relative">
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleBlur}
            onKeyPress={handleKeyPress}
            className="w-full px-4 py-2.5 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            style={{ paddingLeft: prefix ? '2rem' : '1rem' }}
          />
          {prefix && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 font-medium">
              {prefix}
            </span>
          )}
          {suffix && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 text-sm">
              {suffix}
            </span>
          )}
        </div>
        {showButtons && (
          <>
            <button
              onClick={handleIncrement}
              className="w-10 h-10 flex items-center justify-center bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-xl font-bold"
              aria-label="Increment"
            >
              +
            </button>
            <button
              onClick={handleDecrement}
              className="w-10 h-10 flex items-center justify-center bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-xl font-bold"
              aria-label="Decrement"
            >
              −
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default NumberInput;
