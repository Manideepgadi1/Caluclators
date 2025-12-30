'use client';

import React, { useState, useEffect, useCallback } from 'react';
import NumberInput from '../NumberInput';
import SliderInput from '../SliderInput';
import Dropdown from '../Dropdown';
import { ResultCard, ResultRow, InvestmentOptions } from '../ResultCard';
import { lifeGoalAPI, EducationInput, GoalOutput } from '@/services/api';
import { debounce } from '@/utils/formatters';

const MarriageCalculator: React.FC = () => {
  const [inputs, setInputs] = useState<EducationInput>({
    years_remaining: 25,
    cost_today: 5000000,
    inflation: 8.0,
    expected_returns: 12.0,
    growth_in_savings: 0,
    existing_investments: 0,
  });

  const [results, setResults] = useState<GoalOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const calculate = async (data: EducationInput) => {
    try {
      setLoading(true);
      setError('');
      const response = await lifeGoalAPI.calculateMarriage(data);
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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
          value={inputs.inflation || 8}
          onChange={(v) => updateInput('inflation', v)}
          min={0}
          max={15}
          step={0.5}
          unit="%"
          minLabel="0%"
          maxLabel="15%"
          displayValue={`${(inputs.inflation || 8).toFixed(2)}%`}
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

        <Dropdown
          label="Expected Growth in Savings"
          value={inputs.growth_in_savings || 0}
          onChange={(v) => updateInput('growth_in_savings', parseFloat(v))}
          options={[
            { label: '0 % Every Year', value: 0 },
            { label: '5 % Every Year', value: 5 },
            { label: '10 % Every Year', value: 10 },
            { label: '15 % Every Year', value: 15 },
          ]}
        />

        <Dropdown
          label="Existing Investments"
          value={inputs.existing_investments || 0}
          onChange={(v) => updateInput('existing_investments', parseFloat(v))}
          options={[
            { label: 'Nil', value: 0 },
            { label: '₹1,00,000', value: 100000 },
            { label: '₹5,00,000', value: 500000 },
            { label: '₹10,00,000', value: 1000000 },
            { label: '₹25,00,000', value: 2500000 },
            { label: '₹50,00,000', value: 5000000 },
          ]}
        />
      </div>

      {/* Results Section */}
      <div>
        <ResultCard title="MARRIAGE FOR CHILD" icon={<span className="text-4xl">💒</span>}>
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
  );
};

export default MarriageCalculator;
