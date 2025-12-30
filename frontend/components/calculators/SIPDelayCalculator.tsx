'use client';

import React, { useState, useEffect, useCallback } from 'react';
import NumberInput from '../NumberInput';
import SliderInput from '../SliderInput';
import { ResultCard, ResultRow } from '../ResultCard';
import { financialAPI, SIPDelayInput, SIPDelayOutput } from '@/services/api';
import { debounce, formatCurrency } from '@/utils/formatters';

const SIPDelayCalculator: React.FC = () => {
  const [inputs, setInputs] = useState<SIPDelayInput>({
    monthly_investment: 10000,
    period_years: 10,
    expected_returns: 12.0,
    delay_months: 1,
  });

  const [results, setResults] = useState<SIPDelayOutput | null>(null);
  const [loading, setLoading] = useState(false);

  const calculate = async (data: SIPDelayInput) => {
    try {
      setLoading(true);
      const response = await financialAPI.calculateSIPDelay(data);
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

  const updateInput = (key: keyof SIPDelayInput, value: number) => {
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

        <SliderInput
          label="Delay In Months"
          value={inputs.delay_months}
          onChange={(v) => updateInput('delay_months', v)}
          min={1}
          max={120}
          minLabel="1 Month"
          maxLabel="120 Months"
        />
      </div>

      <div>
        <ResultCard title="SIP DELAY COST" icon={<span className="text-4xl">⏰</span>}>
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
            </div>
          ) : results ? (
            <>
              <div className="mb-6">
                <h4 className="text-sm text-gray-600 mb-2">Estimated SIP Delay Cost</h4>
                <div className="text-4xl font-bold text-red-600">
                  {formatCurrency(results.delay_cost, 0)}
                </div>
                <div className="h-1 bg-red-200 rounded-full my-4"></div>
              </div>

              <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Projected Future Value of SIP *</h4>
                <div className="space-y-3">
                  <div>
                    <div className="text-xs text-gray-600 mb-1">Without Delay</div>
                    <div className="text-2xl font-bold text-green-600">
                      {formatCurrency(results.future_value_without_delay, 0)}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600 mb-1">With Delay</div>
                    <div className="text-2xl font-bold text-gray-800">
                      {formatCurrency(results.future_value_with_delay, 0)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-gray-700">
                  ⚠️ Delaying your SIP by <strong>{inputs.delay_months} month{inputs.delay_months > 1 ? 's' : ''}</strong> costs you{' '}
                  <strong className="text-red-600">{formatCurrency(results.delay_cost, 0)}</strong>
                </p>
              </div>
            </>
          ) : null}
        </ResultCard>
      </div>
    </div>
  );
};

export default SIPDelayCalculator;
