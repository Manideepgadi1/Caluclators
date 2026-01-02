'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import NumberInput from '../NumberInput';
import SliderInput from '../SliderInput';
import Dropdown from '../Dropdown';
import { ResultCard, ResultRow, InvestmentOptions } from '../ResultCard';
import { lifeGoalAPI, EducationInput, GoalOutput } from '@/services/api';
import { debounce } from '@/utils/formatters';

const EducationCalculator: React.FC = () => {
  const [inputs, setInputs] = useState<EducationInput>({
    years_remaining: 25,
    cost_today: 5000000,
    inflation: 10.0,
    expected_returns: 12.0,
    growth_in_savings: 0,
    existing_investments: 0,
  });

  const [results, setResults] = useState<GoalOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Custom dropdown states
  const [growthOpen, setGrowthOpen] = useState(false);
  const [existingOpen, setExistingOpen] = useState(false);
  const [growthType, setGrowthType] = useState<'none' | 'percentage' | 'halfYearly' | 'yearly'>('none');
  const [growthPercentage, setGrowthPercentage] = useState(2);
  const [growthHalfYearly, setGrowthHalfYearly] = useState(1000);
  const [growthYearly, setGrowthYearly] = useState(1000);

  // Refs for click-outside detection
  const growthRef = useRef<HTMLDivElement>(null);
  const existingRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (growthRef.current && !growthRef.current.contains(event.target as Node)) {
        setGrowthOpen(false);
      }
      if (existingRef.current && !existingRef.current.contains(event.target as Node)) {
        setExistingOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const calculate = async (data: EducationInput) => {
    try {
      setLoading(true);
      setError('');
      const response = await lifeGoalAPI.calculateEducation(data);
      setResults(response.data);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Calculation failed');
      setResults(null);
    } finally {
      setLoading(false);
    }
  };

  const debouncedCalculate = useCallback(debounce(calculate, 500), []);

  useEffect(() => {
    debouncedCalculate(inputs);
  }, [inputs]);

  const updateInput = (key: keyof EducationInput, value: number) => {
    setInputs((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 animate-slide-in bg-white rounded-2xl p-8 shadow-xl">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-4 shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">Child Education</h1>
          <p className="text-gray-600 text-lg">Plan for your child's higher education expenses</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Input Section */}
      <div className="bg-white rounded-xl shadow-card p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Input Parameters</h2>

        <SliderInput
          label="Years Remaining"
          value={inputs.years_remaining}
          onChange={(v) => updateInput('years_remaining', v)}
          min={1}
          max={50}
          step={1}
          unit=" Years"
          minLabel="1 Year"
          maxLabel="50 Years"
        />

        <NumberInput
          label="Cost Today"
          value={inputs.cost_today}
          onChange={(v) => updateInput('cost_today', v)}
          min={10000}
          max={100000000}
          step={100000}
        />

        <SliderInput
          label="Expected Inflation %"
          value={inputs.inflation || 10}
          onChange={(v) => updateInput('inflation', v)}
          min={0}
          max={15}
          step={0.5}
          unit="%"
          minLabel="0%"
          maxLabel="15%"
          displayValue={`${(inputs.inflation || 10).toFixed(2)}%`}
        />

        <SliderInput
          label="Expected Returns %"
          value={inputs.expected_returns}
          onChange={(v) => updateInput('expected_returns', v)}
          min={5}
          max={20}
          step={0.5}
          unit="%"
          minLabel="5%"
          maxLabel="20%"
          displayValue={`${inputs.expected_returns.toFixed(2)}%`}
        />

        {/* Expected Growth in Savings Dropdown */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Expected Growth in Savings</label>
          <div className="relative" ref={growthRef}>
            <button
              onClick={() => setGrowthOpen(!growthOpen)}
              className="w-full px-4 py-3 text-left bg-white border-2 border-blue-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 flex justify-between items-center hover-lift"
              aria-label="Select expected growth in savings"
            >
              <span className="text-blue-600 font-medium">
                {growthType === 'none' ? 'No Growth' :
                 growthType === 'percentage' ? `${growthPercentage}% Yearly` : 
                 growthType === 'halfYearly' ? `₹${growthHalfYearly.toLocaleString('en-IN')} Half Yearly` :
                 `₹${growthYearly.toLocaleString('en-IN')} Yearly`}
              </span>
              <svg className={`w-5 h-5 text-gray-600 transition-transform ${growthOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {growthOpen && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg animate-fadeIn">
                <div className="p-3 space-y-3">
                  {/* No Growth Option */}
                  <div 
                    onClick={() => {
                      setGrowthType('none');
                      updateInput('growth_in_savings', 0);
                    }}
                    className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                  >
                    <div className="w-4 h-4 border-2 border-gray-400 rounded flex items-center justify-center">
                      {growthType === 'none' && (
                        <svg className="w-3 h-3 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <span className="text-sm text-gray-700 font-medium">No Growth (0%)</span>
                  </div>

                  {/* Percentage Option */}
                  <div 
                    onClick={() => {
                      if (growthType === 'percentage') {
                        setGrowthType('none');
                        updateInput('growth_in_savings', 0);
                      } else {
                        setGrowthType('percentage');
                        updateInput('growth_in_savings', growthPercentage);
                      }
                    }}
                    className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                  >
                    <div className="w-4 h-4 border-2 border-gray-400 rounded flex items-center justify-center">
                      {growthType === 'percentage' && (
                        <svg className="w-3 h-3 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <input
                      type="number"
                      value={growthPercentage}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => {
                        const value = parseFloat(e.target.value) || 0;
                        setGrowthPercentage(value);
                        setGrowthType('percentage');
                        updateInput('growth_in_savings', value);
                      }}
                      className="w-20 px-3 py-1.5 border border-gray-300 rounded-lg text-center focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      aria-label="Percentage value"
                      min="0"
                      max="20"
                      step="0.5"
                    />
                    <span className="text-sm text-gray-700">% Every Year</span>
                  </div>

                  {/* Half Yearly Option */}
                  <div 
                    onClick={() => {
                      if (growthType === 'halfYearly') {
                        setGrowthType('none');
                        updateInput('growth_in_savings', 0);
                      } else {
                        setGrowthType('halfYearly');
                        updateInput('growth_in_savings', 10);
                      }
                    }}
                    className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                  >
                    <div className="w-4 h-4 border-2 border-gray-400 rounded flex items-center justify-center">
                      {growthType === 'halfYearly' && (
                        <svg className="w-3 h-3 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <input
                      type="number"
                      value={growthHalfYearly}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => {
                        const value = parseInt(e.target.value) || 0;
                        setGrowthHalfYearly(value);
                        setGrowthType('halfYearly');
                        updateInput('growth_in_savings', 10);
                      }}
                      className="w-28 px-3 py-1.5 border border-gray-300 rounded-lg text-center focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      aria-label="Half yearly amount"
                      min="0"
                      step="100"
                    />
                    <span className="text-sm text-gray-700">Half Yearly (₹)</span>
                  </div>

                  {/* Yearly Option */}
                  <div 
                    onClick={() => {
                      if (growthType === 'yearly') {
                        setGrowthType('none');
                        updateInput('growth_in_savings', 0);
                      } else {
                        setGrowthType('yearly');
                        updateInput('growth_in_savings', 15);
                      }
                    }}
                    className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                  >
                    <div className="w-4 h-4 border-2 border-gray-400 rounded flex items-center justify-center">
                      {growthType === 'yearly' && (
                        <svg className="w-3 h-3 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <input
                      type="number"
                      value={growthYearly}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => {
                        const value = parseInt(e.target.value) || 0;
                        setGrowthYearly(value);
                        setGrowthType('yearly');
                        updateInput('growth_in_savings', 15);
                      }}
                      className="w-28 px-3 py-1.5 border border-gray-300 rounded-lg text-center focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      aria-label="Yearly amount"
                      min="0"
                      step="100"
                    />
                    <span className="text-sm text-gray-700">Yearly (₹)</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Existing Investments Dropdown */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Existing Investments</label>
          <div className="relative" ref={existingRef}>
            <button
              onClick={() => setExistingOpen(!existingOpen)}
              className="w-full px-4 py-3 text-left bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 flex justify-between items-center hover-lift"
              aria-label="Select existing investments"
            >
              <span className="text-blue-600 font-medium">
                {(inputs.existing_investments || 0) === 0 ? 'Nil' : `₹${(inputs.existing_investments || 0).toLocaleString('en-IN')}`}
              </span>
              <svg className={`w-5 h-5 text-gray-600 transition-transform ${existingOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {existingOpen && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-4 animate-fadeIn">
                <label className="block text-xs text-gray-600 mb-2">Amount Of Investments(₹)</label>
                <div className="flex items-center gap-2">
                  <span className="text-gray-600 text-lg">₹</span>
                  <input
                    type="number"
                    value={inputs.existing_investments || 0}
                    onChange={(e) => updateInput('existing_investments', parseInt(e.target.value) || 0)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter amount"
                    aria-label="Amount of existing investments"
                  />
                  <button
                    onClick={() => updateInput('existing_investments', (inputs.existing_investments || 0) + 10000)}
                    className="w-10 h-10 flex items-center justify-center bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-xl font-bold"
                    aria-label="Increase investment"
                  >
                    +
                  </button>
                  <button
                    onClick={() => updateInput('existing_investments', Math.max(0, (inputs.existing_investments || 0) - 10000))}
                    className="w-10 h-10 flex items-center justify-center bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-xl font-bold"
                    aria-label="Decrease investment"
                  >
                    −
                  </button>
                </div>
                {(inputs.existing_investments || 0) < 0 && (
                  <p className="text-red-500 text-xs mt-2">Amount of Investments(₹) cannot be less than ₹0</p>
                )}
                <div className="mt-3">
                  <button
                    onClick={() => setExistingOpen(false)}
                    className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Apply
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div>
        <ResultCard title="CHILD EDUCATION" icon={<span className="text-4xl">🏫</span>}>
          {loading && (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
              <p className="text-gray-600 mt-2">Calculating...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
              {error}
            </div>
          )}

          {results && !loading && (
            <>
              <div className="mb-6">
                <h4 className="text-sm text-gray-600 mb-2">Recommended Target Amount</h4>
                <div className="text-4xl font-bold text-blue-600">
                  ₹{results.target_amount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                </div>
                <div className="h-1 bg-blue-200 rounded-full my-4"></div>
              </div>

              <InvestmentOptions
                monthly={results.monthly_sip}
                yearly={results.yearly_sip}
                oneTime={results.one_time_investment}
              />

              <div className="mt-6 space-y-2">
                <ResultRow
                  label="Future value of Existing Investment"
                  value={results.future_value_existing}
                />
                <ResultRow
                  label="Shortfall / Surplus to Target Amount"
                  value={results.shortfall}
                  isNegative={true}
                />
              </div>
            </>
          )}
        </ResultCard>
      </div>
        </div>
      </div>
    </div>
  );
};

export default EducationCalculator;
