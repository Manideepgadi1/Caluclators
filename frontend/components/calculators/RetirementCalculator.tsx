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

        <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Assumptions</h4>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>• Retirement period: 25 years</li>
            <li>• Inflation rate: {inputs.inflation}% per year</li>
            <li>• Post-retirement returns: 8% per year</li>
          </ul>
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
