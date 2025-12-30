'use client';

import React, { useState, useEffect, useCallback } from 'react';
import NumberInput from '../NumberInput';
import SliderInput from '../SliderInput';
import { ResultCard } from '../ResultCard';
import { quickToolsAPI, CashFlow, IrregularCashFlowInput, IrregularCashFlowOutput } from '@/services/api';
import { debounce, formatCurrency } from '@/utils/formatters';

const IrregularCashFlowCalculator: React.FC = () => {
  const [calcType, setCalcType] = useState<'present_value' | 'future_value'>('present_value');
  const [discountRate, setDiscountRate] = useState(8.0);
  const [cashFlows, setCashFlows] = useState<CashFlow[]>([
    { amount: 100000, years: 1 },
    { amount: 100000, years: 1 },
  ]);

  const [results, setResults] = useState<IrregularCashFlowOutput | null>(null);
  const [loading, setLoading] = useState(false);

  const calculate = async () => {
    try {
      setLoading(true);
      const data: IrregularCashFlowInput = {
        calculate_type: calcType,
        cash_flows: cashFlows,
        discount_rate: discountRate,
      };
      const response = await quickToolsAPI.calculateIrregularCashFlow(data);
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
  }, [cashFlows, discountRate, calcType]);

  const updateCashFlow = (index: number, field: keyof CashFlow, value: number) => {
    const updated = [...cashFlows];
    updated[index] = { ...updated[index], [field]: value };
    setCashFlows(updated);
  };

  const addCashFlow = () => {
    setCashFlows([...cashFlows, { amount: 100000, years: 1 }]);
  };

  const removeCashFlow = (index: number) => {
    if (cashFlows.length > 1) {
      setCashFlows(cashFlows.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="bg-white rounded-xl shadow-card p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Input Parameters</h2>
        
        <p className="text-sm text-gray-600 mb-6">
          There might be cases where you would have cash flows that are not fixed amount or at fixed intervals of time. 
          Calculate the future & present values of such irregular cash flows.
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

        <SliderInput
          label="Inflation / Discounting Rate %"
          value={discountRate}
          onChange={setDiscountRate}
          min={1}
          max={20}
          step={0.5}
          displayValue={`${discountRate.toFixed(2)}%`}
        />

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-3">Cash-Flow Amounts</label>
          <div className="space-y-4">
            {cashFlows.map((cf, index) => (
              <div key={index} className="flex gap-3 items-center p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <NumberInput
                    label={`Amount ${index + 1}`}
                    value={cf.amount}
                    onChange={(v) => updateCashFlow(index, 'amount', v)}
                    min={1}
                    max={100000000}
                    step={1000}
                    showButtons={false}
                  />
                </div>
                <div className="flex-1">
                  <SliderInput
                    label="After Years"
                    value={cf.years}
                    onChange={(v) => updateCashFlow(index, 'years', v)}
                    min={1}
                    max={50}
                    minLabel="1 Year"
                    maxLabel="50 Years"
                  />
                </div>
                <button
                  onClick={() => removeCashFlow(index)}
                  className="mt-6 w-10 h-10 flex items-center justify-center bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
                  disabled={cashFlows.length === 1}
                >
                  −
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={addCashFlow}
            className="mt-4 w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
          >
            + Add Cash Flow
          </button>
        </div>
      </div>

      <div>
        <ResultCard title="IRREGULAR CASH FLOW" icon={<span className="text-4xl">📊</span>}>
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
            </div>
          ) : results ? (
            <>
              <div className="mb-6">
                <h4 className="text-sm text-gray-600 mb-2">Total End Value</h4>
                <div className="text-5xl font-bold text-blue-600">
                  {formatCurrency(results.total_value, 0)}
                </div>
                <div className="h-1 bg-blue-200 rounded-full my-4"></div>
              </div>

              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">
                  {calcType === 'present_value' ? 'Present Value' : 'Future Value'}
                </h4>
                <div className="text-3xl font-bold text-gray-800">
                  {formatCurrency(results.total_value, 0)}
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-700">
                  <strong>Example:</strong> What is today's worth of a certain cash receivables in future when both 
                  the amount receivables and the time is not certain?
                </p>
              </div>
            </>
          ) : null}
        </ResultCard>
      </div>
    </div>
  );
};

export default IrregularCashFlowCalculator;
