'use client';

import React, { useState, useEffect, useCallback } from 'react';
import NumberInput from '../NumberInput';
import SliderInput from '../SliderInput';
import { ResultCard } from '../ResultCard';
import { quickToolsAPI, AssetReturn, WeightedReturnsInput, WeightedReturnsOutput } from '@/services/api';
import { debounce, formatCurrency } from '@/utils/formatters';

const WeightedReturnsCalculator: React.FC = () => {
  const [years, setYears] = useState(5);
  const [assets, setAssets] = useState<AssetReturn[]>([
    { investment_amount: 100000, expected_return: 12.0 },
    { investment_amount: 100000, expected_return: 12.0 },
    { investment_amount: 100000, expected_return: 12.0 },
  ]);

  const [results, setResults] = useState<WeightedReturnsOutput | null>(null);
  const [loading, setLoading] = useState(false);

  const calculate = async () => {
    try {
      setLoading(true);
      const data: WeightedReturnsInput = {
        years,
        assets,
      };
      const response = await quickToolsAPI.calculateWeightedReturns(data);
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
  }, [years, assets]);

  const updateAsset = (index: number, field: keyof AssetReturn, value: number) => {
    const updated = [...assets];
    updated[index] = { ...updated[index], [field]: value };
    setAssets(updated);
  };

  const addAsset = () => {
    setAssets([...assets, { investment_amount: 100000, expected_return: 12.0 }]);
  };

  const removeAsset = (index: number) => {
    if (assets.length > 1) {
      setAssets(assets.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="bg-white rounded-xl shadow-card p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Input Parameters</h2>
        
        <p className="text-sm text-gray-600 mb-6">
          For a portfolio of different asset classes, calculate the weighted average returns on the entire portfolio.
        </p>

        <SliderInput
          label="Future Value After Years"
          value={years}
          onChange={setYears}
          min={1}
          max={50}
          minLabel="1 Year"
          maxLabel="50 Years"
        />

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-3">Asset Allocation</label>
          <div className="space-y-4">
            {assets.map((asset, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-semibold text-gray-700">Asset {index + 1}</h4>
                  <button
                    onClick={() => removeAsset(index)}
                    className="w-8 h-8 flex items-center justify-center bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 text-sm"
                    disabled={assets.length === 1}
                  >
                    −
                  </button>
                </div>
                
                <NumberInput
                  label="Investment Amount"
                  value={asset.investment_amount}
                  onChange={(v) => updateAsset(index, 'investment_amount', v)}
                  min={1000}
                  max={100000000}
                  step={1000}
                  showButtons={false}
                />
                
                <SliderInput
                  label="Expected Returns %"
                  value={asset.expected_return}
                  onChange={(v) => updateAsset(index, 'expected_return', v)}
                  min={1}
                  max={20}
                  step={0.5}
                  displayValue={`${asset.expected_return.toFixed(2)}%`}
                />
              </div>
            ))}
          </div>
          <button
            onClick={addAsset}
            className="mt-4 w-full py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium flex items-center justify-center gap-2"
          >
            <span className="text-lg">+</span> Add Asset
          </button>
        </div>
      </div>

      <div>
        <ResultCard title="WEIGHTED AVG. RETURNS" icon={<span className="text-4xl">⚖️</span>}>
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
            </div>
          ) : results ? (
            <>
              <div className="mb-6">
                <h4 className="text-sm text-gray-600 mb-2">Estimated Future Value</h4>
                <div className="text-5xl font-bold text-blue-600">
                  {formatCurrency(results.future_value, 0)}
                </div>
                <div className="h-1 bg-blue-200 rounded-full my-4"></div>
              </div>

              <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">
                  Weighted average Returns
                </h4>
                <div className="text-3xl font-bold text-blue-600">
                  {results.weighted_return.toFixed(2)} %
                </div>
              </div>

              <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Invested Amount</h4>
                <div className="text-2xl font-bold text-gray-800">
                  {formatCurrency(results.total_invested, 0)}
                </div>
              </div>

              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-gray-700">
                  <strong>Example:</strong> What is today's worth of certain cash receivables in future when both 
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

export default WeightedReturnsCalculator;
