'use client';

import React, { useState } from 'react';
import SIPGrowthCalculator from './calculators/SIPGrowthCalculator';
import SIPNeedCalculator from './calculators/SIPNeedCalculator';
import SIPDelayCalculator from './calculators/SIPDelayCalculator';
import SWPCalculator from './calculators/SWPCalculator';

type CalculatorType = 'sip-growth' | 'sip-need' | 'sip-delay' | 'swp';

const FinancialCalculators: React.FC = () => {
  const [activeCalculator, setActiveCalculator] = useState<CalculatorType>('sip-growth');

  const calculators = [
    {
      id: 'sip-growth' as CalculatorType,
      label: 'SIP',
      subLabel: 'GROWTH',
      icon: '📈',
    },
    {
      id: 'sip-need' as CalculatorType,
      label: 'SIP',
      subLabel: 'NEED',
      icon: '💰',
    },
    {
      id: 'sip-delay' as CalculatorType,
      label: 'SIP',
      subLabel: 'DELAY COST',
      icon: '⏰',
    },
    {
      id: 'swp' as CalculatorType,
      label: 'SWP',
      subLabel: 'CALCULATOR',
      icon: '💸',
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
        {activeCalculator === 'sip-growth' && <SIPGrowthCalculator />}
        {activeCalculator === 'sip-need' && <SIPNeedCalculator />}
        {activeCalculator === 'sip-delay' && <SIPDelayCalculator />}
        {activeCalculator === 'swp' && <SWPCalculator />}
      </div>
    </div>
  );
};

export default FinancialCalculators;
