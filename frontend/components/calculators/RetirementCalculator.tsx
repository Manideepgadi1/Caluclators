'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
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

  const [lifeExpectancy, setLifeExpectancy] = useState('85');
  const [preRetirementInflation, setPreRetirementInflation] = useState('6.0');
  const [retirementKittyReturns, setRetirementKittyReturns] = useState('8');
  const [postRetirementInflation, setPostRetirementInflation] = useState('8');
  const [assumptionsOpen, setAssumptionsOpen] = useState(false);
  const [growthOpen, setGrowthOpen] = useState(false);
  const [existingOpen, setExistingOpen] = useState(false);
  
  // Growth type state - none, percentage, halfYearly, yearly
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

  const [results, setResults] = useState<RetirementOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const calculate = async (data: RetirementInput) => {
    try {
      setLoading(true);
      setError('');
      // Include assumptions in the calculation
      const calculationData = {
        ...data,
        life_expectancy: parseInt(lifeExpectancy) || 85,
        retirement_kitty_returns: parseFloat(retirementKittyReturns) || 8,
        post_retirement_inflation: parseFloat(postRetirementInflation) || 8,
      };
      const response = await lifeGoalAPI.calculateRetirement(calculationData);
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
  }, [inputs, lifeExpectancy, retirementKittyReturns, postRetirementInflation]);

  // Sync preRetirementInflation display with inputs.inflation
  useEffect(() => {
    if (inputs.inflation !== undefined) {
      setPreRetirementInflation(inputs.inflation.toString());
    }
  }, [inputs.inflation]);

  const updateInput = (key: keyof RetirementInput, value: number) => {
    setInputs((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 animate-slide-in bg-white rounded-2xl p-8 shadow-xl">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-4 shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">Plan Your Retirement</h1>
          <p className="text-gray-600 text-lg">Calculate how much you need to retire comfortably</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="bg-white rounded-2xl shadow-2xl p-8 hover-lift animate-slide-in">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Input Parameters</h2>
            </div>

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
                        // Convert to 10% annual growth for backend
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
                        // Convert to 15% annual growth for backend
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
              className="w-full px-4 py-3 text-left bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 flex justify-between items-center"
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
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-4">
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
                  <label className="block text-xs text-gray-600 mb-2">Returns %</label>
                  <SliderInput
                    label=""
                    value={12}
                    onChange={() => {}}
                    min={0}
                    max={20}
                    step={0.5}
                    unit="%"
                    minLabel="0%"
                    maxLabel="20%"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Assumptions Section */}
        <div className="mt-4">
          <button
            onClick={() => setAssumptionsOpen(!assumptionsOpen)}
            className="w-full px-4 py-3 text-left bg-white border-2 border-blue-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 flex justify-between items-center"
            aria-label="Toggle assumptions section"
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
                  <label htmlFor="life-expectancy" className="block text-xs text-gray-600 mb-1">Life Expectancy (years)</label>
                  <input
                    id="life-expectancy"
                    type="text"
                    inputMode="numeric"
                    value={lifeExpectancy}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^0-9]/g, '');
                      setLifeExpectancy(val);
                    }}
                    onBlur={(e) => {
                      const num = parseInt(e.target.value) || 60;
                      setLifeExpectancy(num.toString());
                    }}
                    className="w-full px-3 py-2 bg-gray-100 border-0 rounded text-center font-semibold"
                  />
                </div>
                <div>
                  <label htmlFor="pre-retirement-inflation" className="block text-xs text-gray-600 mb-1">Pre-retirement inflation p.a. %</label>
                  <input
                    id="pre-retirement-inflation"
                    type="text"
                    inputMode="decimal"
                    value={preRetirementInflation}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^0-9.]/g, '');
                      setPreRetirementInflation(val);
                    }}
                    onBlur={(e) => {
                      const num = parseFloat(e.target.value) || 6.0;
                      const rounded = Math.round(num * 10) / 10;
                      setPreRetirementInflation(rounded.toString());
                      if (inputs.inflation !== rounded) {
                        updateInput('inflation', rounded);
                      }
                    }}
                    className="w-full px-3 py-2 bg-gray-100 border-0 rounded text-center font-semibold"
                  />
                </div>
                <div>
                  <label htmlFor="retirement-kitty-returns" className="block text-xs text-gray-600 mb-1">Returns on Retirement Kitty %</label>
                  <input
                    id="retirement-kitty-returns"
                    type="text"
                    inputMode="decimal"
                    value={retirementKittyReturns}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^0-9.]/g, '');
                      setRetirementKittyReturns(val);
                    }}
                    onBlur={(e) => {
                      const num = parseFloat(e.target.value) || 8;
                      setRetirementKittyReturns(num.toString());
                    }}
                    className="w-full px-3 py-2 bg-gray-100 border-0 rounded text-center font-semibold"
                  />
                </div>
                <div>
                  <label htmlFor="post-retirement-inflation" className="block text-xs text-gray-600 mb-1">Post-retirement inflation p.a. %</label>
                  <input
                    id="post-retirement-inflation"
                    type="text"
                    inputMode="decimal"
                    value={postRetirementInflation}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^0-9.]/g, '');
                      setPostRetirementInflation(val);
                    }}
                    onBlur={(e) => {
                      const num = parseFloat(e.target.value) || 8;
                      setPostRetirementInflation(num.toString());
                    }}
                    className="w-full px-3 py-2 bg-gray-100 border-0 rounded text-center font-semibold"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Results Section */}
      <div className="animate-slide-in" style={{animationDelay: '0.2s'}}>
        <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-2xl p-8 hover-lift">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mr-3 shadow-lg">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                PLAN YOUR RETIREMENT
              </h2>
              <p className="text-sm text-gray-600">Your retirement planning results</p>
            </div>
          </div>

          {loading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mb-4"></div>
              <p className="text-gray-600 text-lg font-medium">Calculating your retirement plan...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 text-red-700 animate-fade-in">
              <div className="flex items-center">
                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            </div>
          )}

          {results && !loading && (
            <div className="animate-fade-in">
              <div className="mb-8 p-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white shadow-xl">
                <h4 className="text-sm opacity-90 mb-2">Recommended Retirement Kitty Amount</h4>
                <div className="text-5xl font-bold mb-2">
                  ₹{results.recommended_corpus.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                </div>
                <div className="flex items-center text-sm opacity-75">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  <span>Based on {results.years_remaining} years of investment</span>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Required Investment Amount
                </h4>
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border-2 border-green-200 hover:shadow-lg transition-all">
                    <div className="text-xs text-green-700 font-semibold mb-1">Monthly</div>
                    <div className="text-2xl font-bold text-green-900">₹{results.monthly_sip.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</div>
                  </div>
                  <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-xl border-2 border-yellow-200 hover:shadow-lg transition-all">
                    <div className="text-xs text-yellow-700 font-semibold mb-1">Yearly</div>
                    <div className="text-2xl font-bold text-yellow-900">₹{results.yearly_sip.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</div>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border-2 border-purple-200 hover:shadow-lg transition-all">
                    <div className="text-xs text-purple-700 font-semibold mb-1">One Time</div>
                    <div className="text-2xl font-bold text-purple-900">₹{results.one_time_investment.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</div>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-3 p-4 bg-gray-50 rounded-xl">
                <div className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-all">
                  <span className="text-gray-700 font-medium">Future value of Existing Investment</span>
                  <span className="text-lg font-bold text-gray-900">₹{results.future_value_existing.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-all">
                  <span className="text-gray-700 font-medium">Shortfall / Surplus to Target Amount</span>
                  <span className={`text-lg font-bold ${results.shortfall < 0 ? 'text-red-600' : 'text-green-600'}`}>
                    ₹{Math.abs(results.shortfall).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-all">
                  <span className="text-gray-700 font-medium">Monthly expenses in Retirement Year</span>
                  <span className="text-lg font-bold text-gray-900">₹{results.monthly_expenses_retirement.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      </div>
      </div>
    </div>
  );
};

export default RetirementCalculator;
