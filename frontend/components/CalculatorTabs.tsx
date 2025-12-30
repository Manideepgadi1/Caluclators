'use client';

import React, { useState } from 'react';
import LifeGoalCalculators from './LifeGoalCalculators';
import FinancialCalculators from './FinancialCalculators';
import QuickTools from './QuickTools';

type TabType = 'life-goal' | 'financial' | 'quick-tools' | 'mutual-fund';

const CalculatorTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('life-goal');

  const tabs = [
    { id: 'life-goal' as TabType, label: 'LIFE GOAL', subLabel: 'CALCULATORS' },
    { id: 'financial' as TabType, label: 'FINANCIAL', subLabel: 'CALCULATORS' },
    { id: 'quick-tools' as TabType, label: 'QUICK', subLabel: 'TOOLS' },
    { id: 'mutual-fund' as TabType, label: 'MUTUAL FUND', subLabel: 'CALCULATORS' },
  ];

  return (
    <div>
      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-4 mb-8 justify-center">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            disabled={tab.id === 'mutual-fund'}
            className={`px-8 py-4 rounded-xl font-bold transition-all duration-300 ${
              activeTab === tab.id
                ? 'bg-blue-500 text-white shadow-lg scale-105'
                : tab.id === 'mutual-fund'
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-white text-gray-700 hover:bg-gray-50 shadow-card hover:shadow-card-hover'
            }`}
          >
            <div className="text-center">
              <div className="text-lg">{tab.label}</div>
              <div className="text-xs mt-1">{tab.subLabel}</div>
            </div>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-screen">
        {activeTab === 'life-goal' && <LifeGoalCalculators />}
        {activeTab === 'financial' && <FinancialCalculators />}
        {activeTab === 'quick-tools' && <QuickTools />}
        {activeTab === 'mutual-fund' && (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">Coming Soon</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CalculatorTabs;
