'use client';

import React, { useState } from 'react';
import RetirementCalculator from './calculators/RetirementCalculator';
import EducationCalculator from './calculators/EducationCalculator';
import MarriageCalculator from './calculators/MarriageCalculator';
import OtherGoalCalculator from './calculators/OtherGoalCalculator';

type CalculatorType = 'retirement' | 'education' | 'marriage' | 'other-goal';

const LifeGoalCalculators: React.FC = () => {
  const [activeCalculator, setActiveCalculator] = useState<CalculatorType>('retirement');

  const calculators = [
    {
      id: 'retirement' as CalculatorType,
      label: 'PLAN YOUR',
      subLabel: 'RETIREMENT',
      icon: '🪑',
      description: 'Calculate your retirement corpus and monthly SIP needed',
    },
    {
      id: 'education' as CalculatorType,
      label: 'CHILD',
      subLabel: 'EDUCATION',
      icon: '🏫',
      description: 'Plan for your child\'s higher education expenses',
    },
    {
      id: 'marriage' as CalculatorType,
      label: 'MARRIAGE FOR',
      subLabel: 'CHILD',
      icon: '💒',
      description: 'Save for your child\'s wedding expenses',
    },
    {
      id: 'other-goal' as CalculatorType,
      label: 'YOUR',
      subLabel: 'OTHER GOAL',
      icon: '🎯',
      description: 'Plan for any custom financial goal',
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
            title={calc.description}
            className={`flex-1 min-w-[200px] px-6 py-4 rounded-xl font-bold transition-all duration-300 group ${
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
                <div className={`text-xs mt-1 font-normal ${
                  activeCalculator === calc.id ? 'text-blue-100' : 'text-gray-500'
                }`}>{calc.description}</div>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Calculator Content */}
      <div>
        {activeCalculator === 'retirement' && <RetirementCalculator />}
        {activeCalculator === 'education' && <EducationCalculator />}
        {activeCalculator === 'marriage' && <MarriageCalculator />}
        {activeCalculator === 'other-goal' && <OtherGoalCalculator />}
      </div>
    </div>
  );
};

export default LifeGoalCalculators;
