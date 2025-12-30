'use client';

import React, { useState, useEffect, useCallback } from 'react';
import NumberInput from '../NumberInput';
import SliderInput from '../SliderInput';
import { ResultCard, ResultRow } from '../ResultCard';
import { financialAPI, SWPInput, SWPOutput } from '@/services/api';
import { debounce, formatCurrency, formatNumber } from '@/utils/formatters';

const SWPCalculator: React.FC = () => {
  const [inputs, setInputs] = useState<SWPInput>({
    initial_investment: 2500000,
    monthly_withdrawal: 10000,
    expected_returns: 8.0,
    yearly_increase: 10.0,
    increase_withdrawal: false,
    swp_start_years: 0,
  });

  const [results, setResults] = useState<SWPOutput | null>(null);
  const [loading, setLoading] = useState(false);

  const calculate = async (data: SWPInput) => {
    try {
      setLoading(true);
      const response = await financialAPI.calculateSWP(data);
      setResults(response.data);
    } catch (err) {
      setResults(null);
    } finally {
      setLoading(false);
    }
  };

  const debouncedCalculate = useCallback(debounce(calculate, 500), []);

  useEffect(() => {
    debouncedCalculate(inputs);
  }, [inputs]);

  const updateInput = (key: keyof SWPInput, value: number | boolean) => {
    setInputs((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="bg-white rounded-xl shadow-card p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Input Parameters</h2>

        <NumberInput
          label="Initial Investment Amount (₹)"
          value={inputs.initial_investment}
          onChange={(v) => updateInput('initial_investment', v)}
          min={10000}
          max={100000000}
          step={10000}
        />

        <NumberInput
          label="Monthly Withdrawal Amount (₹)"
          value={inputs.monthly_withdrawal}
          onChange={(v) => updateInput('monthly_withdrawal', v)}
          min={1000}
          max={10000000}
          step={1000}
        />

        <div className="mb-4">
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={inputs.increase_withdrawal}
              onChange={(e) => updateInput('increase_withdrawal', e.target.checked)}
              className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700 font-medium">
              Do you want to increase withdrawal amount yearly with a definite growth rate ?
            </span>
          </label>
        </div>

        <SliderInput
          label="Yearly Increase In SWP Amount / Inflation"
          value={inputs.yearly_increase || 10}
          onChange={(v) => updateInput('yearly_increase', v)}
          min={0}
          max={15}
          step={0.5}
          displayValue={`${(inputs.yearly_increase || 10).toFixed(2)}%`}
        />

        <SliderInput
          label="Expected Returns %"
          value={inputs.expected_returns}
          onChange={(v) => updateInput('expected_returns', v)}
          min={2}
          max={15}
          step={0.5}
          displayValue={`${inputs.expected_returns.toFixed(2)}%`}
        />

        <SliderInput
          label="SWP Start After Years"
          value={inputs.swp_start_years || 0}
          onChange={(v) => updateInput('swp_start_years', v)}
          min={0}
          max={30}
          minLabel="Now"
          maxLabel="30 Years"
        />
      </div>

      <div>
        <ResultCard title="SWP CALCULATOR" icon={<span className="text-4xl">💸</span>}>
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
            </div>
          ) : results ? (
            <>
              <div className="mb-6">
                <h4 className="text-sm text-gray-600 mb-2">Period End Value</h4>
                <div className="text-4xl font-bold text-blue-600">
                  {formatCurrency(results.period_end_value, 0)}
                </div>
                <div className="h-1 bg-blue-200 rounded-full my-4"></div>
              </div>

              <ResultRow label="Total Amount Withdrawn" value={results.total_withdrawn} />
              <ResultRow 
                label="Full Instalments Withdrawn" 
                value={results.full_instalments} 
                isCurrency={false} 
              />

              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-700">
                  <strong>Last Instalment Date:</strong>{' '}
                  <span className="font-semibold text-blue-600">{results.last_instalment_date}</span>
                </p>
              </div>

              <div className="mt-4 text-xs text-gray-500 italic">
                with last estimated full instalment on {results.last_instalment_date}
              </div>
            </>
          ) : null}
        </ResultCard>
      </div>
    </div>
  );
};

export default SWPCalculator;
