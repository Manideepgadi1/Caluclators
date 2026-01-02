'use client';

import React, { useState, useEffect, useCallback } from 'react';
import NumberInput from '../NumberInput';
import SliderInput from '../SliderInput';
import Dropdown from '../Dropdown';
import { ResultCard, ResultRow, InvestmentOptions } from '../ResultCard';
import { lifeGoalAPI, RetirementInput, RetirementOutput } from '@/services/api';
import { debounce } from '@/utils/formatters';

const RetirementCalculator: React.FC = () => {
  const [inputs, setInputs] = useState<RetirementInput>({
    present_age: 30,
    retirement_age: 60,
    monthly_expenses: 50000,
    expected_returns: 12.0,
    inflation: 6.0,
    growth_in_savings: 0,
    existing_investments: 0,
  });

  const [lifeExpectancy, setLifeExpectancy] = useState(60);
  const [preRetirementInflation, setPreRetirementInflation] = useState(6);
  const [retirementKittyReturns, setRetirementKittyReturns] = useState(8);
  const [postRetirementInflation, setPostRetirementInflation] = useState(8);
  const [assumptionsOpen, setAssumptionsOpen] = useState(false);
  const [growthOpen, setGrowthOpen] = useState(false);
  const [existingOpen, setExistingOpen] = useState(false);

  const [results, setResults] = useState<RetirementOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const calculate = async (data: RetirementInput) => {
    try {
      setLoading(true);
      setError('');
      const response = await lifeGoalAPI.calculateRetirement(data);
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

  const updateInput = (key: keyof RetirementInput, value: number) => {
    setInputs((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Input Section */}
      <div className="bg-white rounded-xl shadow-card p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Input Parameters</h2>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <NumberInput
            label="Present Age"
            value={inputs.present_age}
            onChange={(v) => updateInput('present_age', v)}
            min={18}
            max={100}
            prefix=""
            suffix=""
          />

          <NumberInput
            label="Retirement Age"
            value={inputs.retirement_age}
            onChange={(v) => updateInput('retirement_age', v)}
            min={30}
            max={100}
            prefix=""
            suffix=""
          />
        </div>

        <NumberInput
          label="Monthly Expenses"
          value={inputs.monthly_expenses}
          onChange={(v) => updateInput('monthly_expenses', v)}
          min={1000}
          max={10000000}
          step={1000}
        />

        <SliderInput
          label="Expected Returns %"
          value={inputs.expected_returns}
          onChange={(v) => updateInput('expected_returns', v)}
          min={4}
          max={20}
          step={0.5}
          unit="%"
          minLabel="4%"
          maxLabel="20%"
          displayValue={`${inputs.expected_returns.toFixed(2)}%`}
        />

        {/* Expected Growth in Savings Dropdown */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Expected Growth in Savings</label>
          <div className="relative">
            <button
              onClick={() => setGrowthOpen(!growthOpen)}
              className="w-full px-4 py-3 text-left bg-white border-2 border-blue-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 flex justify-between items-center"
            >
              <span className="text-blue-600 font-medium">{inputs.growth_in_savings} % Every Year</span>
              <svg className={`w-5 h-5 text-gray-600 transition-transform ${growthOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {growthOpen && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
                <div className="p-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <input type="checkbox" className="w-4 h-4" />
                    <input
                      type="number"
                      defaultValue="2"
                      className="w-16 px-2 py-1 border border-gray-300 rounded text-center"
                    />
                    <span className="text-sm text-gray-700">% Every Year</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" className="w-4 h-4" />
                    <input
                      type="number"
                      defaultValue="1000"
                      className="w-20 px-2 py-1 border border-gray-300 rounded text-center"
                    />
                    <span className="text-sm text-blue-600">Half Yearly (₹)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" className="w-4 h-4" />
                    <input
                      type="number"
                      defaultValue="1000"
                      className="w-20 px-2 py-1 border border-gray-300 rounded text-center"
                    />
                    <span className="text-sm text-blue-600">Yearly (₹)</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Existing Investments Dropdown */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Existing Investments</label>
          <div className="relative">
            <button
              onClick={() => setExistingOpen(!existingOpen)}
              className="w-full px-4 py-3 text-left bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 flex justify-between items-center"
            >
              <span className="text-blue-600 font-medium">
                {inputs.existing_investments === 0 ? 'Nil' : `₹${inputs.existing_investments.toLocaleString('en-IN')}`}
              </span>
              <svg className={`w-5 h-5 text-gray-600 transition-transform ${existingOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {existingOpen && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
                <div className="p-2">
                  {[
                    { label: 'Nil', value: 0 },
                    { label: '₹1,00,000', value: 100000 },
                    { label: '₹5,00,000', value: 500000 },
                    { label: '₹10,00,000', value: 1000000 },
                    { label: '₹25,00,000', value: 2500000 },
                    { label: '₹50,00,000', value: 5000000 },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        updateInput('existing_investments', option.value);
                        setExistingOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-blue-50 rounded text-sm text-gray-700"
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          {inputs.existing_investments < 0 && (
            <p className="text-red-500 text-xs mt-1">Amount of Investments(₹) cannot be less than ₹0</p>
          )}
        </div>

        {/* Assumptions Section */}
        <div className="mt-4">
          <button
            onClick={() => setAssumptionsOpen(!assumptionsOpen)}
            className="w-full px-4 py-3 text-left bg-white border-2 border-blue-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 flex justify-between items-center"
          >
            <span className="text-gray-700 font-medium">Assumptions</span>
            <svg className={`w-5 h-5 text-gray-600 transition-transform ${assumptionsOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {assumptionsOpen && (
            <div className="mt-2 p-4 bg-white border border-gray-200 rounded-lg">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Life Expectancy (years)</label>
                  <input
                    type="number"
                    value={lifeExpectancy}
                    onChange={(e) => setLifeExpectancy(parseInt(e.target.value) || 60)}
                    className="w-full px-3 py-2 bg-gray-100 border-0 rounded text-center font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Pre-retirement inflation p.a. %</label>
                  <input
                    type="number"
                    value={preRetirementInflation}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 6;
                      setPreRetirementInflation(val);
                      updateInput('inflation', val);
                    }}
                    className="w-full px-3 py-2 bg-gray-100 border-0 rounded text-center font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Returns on Retirement Kitty %</label>
                  <input
                    type="number"
                    value={retirementKittyReturns}
                    onChange={(e) => setRetirementKittyReturns(parseInt(e.target.value) || 8)}
                    className="w-full px-3 py-2 bg-gray-100 border-0 rounded text-center font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Post-retirement inflation p.a. %</label>
                  <input
                    type="number"
                    value={postRetirementInflation}
                    onChange={(e) => setPostRetirementInflation(parseInt(e.target.value) || 8)}
                    className="w-full px-3 py-2 bg-gray-100 border-0 rounded text-center font-semibold"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Results Section */}
      <div>
        <ResultCard title="PLAN YOUR RETIREMENT" icon={<span className="text-4xl">🪑</span>}>
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
                <h4 className="text-sm text-gray-600 mb-2">Recommended Retirement Kitty Amount</h4>
                <div className="text-4xl font-bold text-blue-600">
                  ₹{results.recommended_corpus.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
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
                <ResultRow
                  label="Monthly expenses in Retirement Year"
                  value={results.monthly_expenses_retirement}
                />
              </div>
            </>
          )}
        </ResultCard>
      </div>
    </div>
  );
};

export default RetirementCalculator;
