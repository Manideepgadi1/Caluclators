'use client';

import React, { useState, useEffect, useCallback } from 'react';
import NumberInput from '../NumberInput';
import SliderInput from '../SliderInput';
import { ResultCard } from '../ResultCard';
import { quickToolsAPI, SingleAmountInput, SingleAmountOutput } from '@/services/api';
import { debounce, formatCurrency } from '@/utils/formatters';

const SingleAmountCalculator: React.FC = () => {
  const [calcType, setCalcType] = useState<'present_value' | 'future_value'>('present_value');
  const [inputs, setInputs] = useState({
    amount: 100000,
    years: 5,
    inflation: 8.0,
  });

  const [results, setResults] = useState<SingleAmountOutput | null>(null);
  const [loading, setLoading] = useState(false);

  const calculate = async () => {
    try {
      setLoading(true);
      const data: SingleAmountInput = {
        calculate_type: calcType,
        amount: inputs.amount,
        years: inputs.years,
        inflation: inputs.inflation,
      };
      const response = await quickToolsAPI.calculateSingleAmount(data);
      setResults(response.data);
    } catch (err) {
      setResults(null);
    } finally {
      setLoading(false);
    }
  };

  const debouncedCalculate = useCallback(debounce(calculate, 500), []);

  useEffect(() => {
    debouncedCalculate();
  }, [inputs, calcType]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="bg-white rounded-xl shadow-card p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Input Parameters</h2>
        
        <p className="text-sm text-gray-600 mb-6">
          Get the future value of a present investment or the present value of a future amount
        </p>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">Calculate</label>
          <div className="flex gap-4">
            <button
              onClick={() => setCalcType('present_value')}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                calcType === 'present_value'
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Present Value
            </button>
            <button
              onClick={() => setCalcType('future_value')}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                calcType === 'future_value'
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Future Value
            </button>
          </div>
        </div>

        <NumberInput
          label={calcType === 'present_value' ? 'Present Value' : 'Future Value'}
          value={inputs.amount}
          onChange={(v) => setInputs((prev) => ({ ...prev, amount: v }))}
          min={1000}
          max={1000000000}
          step={1000}
        />

        <SliderInput
          label="After Years"
          value={inputs.years}
          onChange={(v) => setInputs((prev) => ({ ...prev, years: v }))}
          min={1}
          max={50}
          minLabel="1 Year"
          maxLabel="50 Years"
        />

        <SliderInput
          label="Inflation"
          value={inputs.inflation}
          onChange={(v) => setInputs((prev) => ({ ...prev, inflation: v }))}
          min={1}
          max={50}
          step={0.5}
          displayValue={`${inputs.inflation.toFixed(2)}%`}
        />
      </div>

      <div>
        <ResultCard title="SINGLE AMOUNT" icon={<span className="text-4xl">💵</span>}>
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
            </div>
          ) : results ? (
            <>
              <div className="mb-6">
                <h4 className="text-sm text-gray-600 mb-2">
                  {calcType === 'present_value' ? 'Present Value' : 'Future Value'}
                </h4>
                <div className="text-5xl font-bold text-blue-600">
                  {formatCurrency(results.result, 0)}
                </div>
                <div className="h-1 bg-blue-200 rounded-full my-4"></div>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-700">
                  <strong>Example:</strong>{' '}
                  {calcType === 'present_value'
                    ? `What is today's worth of ${formatCurrency(inputs.amount, 0)} that I will receive after ${inputs.years} Years?`
                    : `What will be the value of ${formatCurrency(inputs.amount, 0)} after ${inputs.years} years at ${inputs.inflation}% growth rate?`}
                </p>
              </div>
            </>
          ) : null}
        </ResultCard>
      </div>
    </div>
  );
};

export default SingleAmountCalculator;
