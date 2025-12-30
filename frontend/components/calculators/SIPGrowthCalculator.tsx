'use client';

import React, { useState, useEffect, useCallback } from 'react';
import NumberInput from '../NumberInput';
import SliderInput from '../SliderInput';
import Dropdown from '../Dropdown';
import { ResultCard, ResultRow } from '../ResultCard';
import { financialAPI, SIPGrowthInput, SIPGrowthOutput } from '@/services/api';
import { debounce, formatCurrency } from '@/utils/formatters';

const SIPGrowthCalculator: React.FC = () => {
  const [inputs, setInputs] = useState<SIPGrowthInput>({
    monthly_investment: 10000,
    period_years: 10,
    expected_returns: 12.0,
    growth_in_savings: 0,
  });

  const [results, setResults] = useState<SIPGrowthOutput | null>(null);
  const [loading, setLoading] = useState(false);

  const calculate = async (data: SIPGrowthInput) => {
    try {
      setLoading(true);
      const response = await financialAPI.calculateSIPGrowth(data);
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

  const updateInput = (key: keyof SIPGrowthInput, value: number) => {
    setInputs((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="bg-white rounded-xl shadow-card p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Input Parameters</h2>

        <NumberInput
          label="Monthly Investment Amount"
          value={inputs.monthly_investment}
          onChange={(v) => updateInput('monthly_investment', v)}
          min={500}
          max={10000000}
          step={500}
        />

        <SliderInput
          label="Period (Years)"
          value={inputs.period_years}
          onChange={(v) => updateInput('period_years', v)}
          min={1}
          max={50}
          minLabel="1 Year"
          maxLabel="50 Years"
        />

        <SliderInput
          label="Expected Returns %"
          value={inputs.expected_returns}
          onChange={(v) => updateInput('expected_returns', v)}
          min={1}
          max={20}
          step={0.5}
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
      </div>

      <div>
        <ResultCard title="SIP GROWTH" icon={<span className="text-4xl">📈</span>}>
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
            </div>
          ) : results ? (
            <>
              <div className="mb-6">
                <h4 className="text-sm text-gray-600 mb-2">Estimated Future Value</h4>
                <div className="text-4xl font-bold text-blue-600">
                  {formatCurrency(results.future_value, 0)}
                </div>
                <div className="h-1 bg-blue-200 rounded-full my-4"></div>
              </div>
              <ResultRow label="Total Amount Invested" value={results.total_invested} />
              <ResultRow label="Wealth Gain" value={results.wealth_gain} />
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-700">
                  Growth Multiple <span className="font-bold text-blue-600">{results.growth_multiple.toFixed(2)} times</span>
                </p>
              </div>
            </>
          ) : null}
        </ResultCard>
      </div>
    </div>
  );
};

export default SIPGrowthCalculator;
