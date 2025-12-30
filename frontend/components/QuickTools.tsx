'use client';

import React, { useState } from 'react';
import SingleAmountCalculator from './calculators/SingleAmountCalculator';
import IrregularCashFlowCalculator from './calculators/IrregularCashFlowCalculator';
import WeightedReturnsCalculator from './calculators/WeightedReturnsCalculator';

type CalculatorType = 'single-amount' | 'irregular-cash-flow' | 'weighted-returns';

const QuickTools: React.FC = () => {
  const [activeCalculator, setActiveCalculator] = useState<CalculatorType>('single-amount');

  const calculators = [
    {
      id: 'single-amount' as CalculatorType,
      label: 'SINGLE',
      subLabel: 'AMOUNT',
      icon: '💵',
    },
    {
      id: 'irregular-cash-flow' as CalculatorType,
      label: 'IRREGULAR',
      subLabel: 'CASH FLOW',
      icon: '📊',
    },
    {
      id: 'weighted-returns' as CalculatorType,
      label: 'WEIGHTED AVG.',
      subLabel: 'RETURNS',
      icon: '⚖️',
    },
  ];

  return (
    <div>
      {/* Sub-navigation */}
      <div className="flex flex-wrap gap-4 mb-8">
        {calculators.map((calc) => (
          <button
            key={calc.id}
            onClick={() => setActiveCalculator(calc.id)}
            className={`flex-1 min-w-[200px] px-6 py-4 rounded-xl font-bold transition-all duration-300 ${
              activeCalculator === calc.id
                ? 'bg-blue-500 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50 shadow-card hover:shadow-card-hover'
            }`}
          >
            <div className="flex items-center justify-center gap-3">
              <span className="text-2xl">{calc.icon}</span>
              <div className="text-left">
                <div className="text-sm">{calc.label}</div>
                <div className="text-base font-bold">{calc.subLabel}</div>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Calculator Content */}
      <div>
        {activeCalculator === 'single-amount' && <SingleAmountCalculator />}
        {activeCalculator === 'irregular-cash-flow' && <IrregularCashFlowCalculator />}
        {activeCalculator === 'weighted-returns' && <WeightedReturnsCalculator />}
      </div>
    </div>
  );
};

export default QuickTools;
