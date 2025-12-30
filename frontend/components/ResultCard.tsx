import React from 'react';
import { formatCurrency, formatNumber } from '@/utils/formatters';

interface ResultCardProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export const ResultCard: React.FC<ResultCardProps> = ({ title, icon, children }) => {
  return (
    <div className="bg-white rounded-xl shadow-card p-6 border border-gray-100">
      <div className="flex items-center gap-3 mb-6">
        {icon && <div className="text-blue-500">{icon}</div>}
        <h3 className="text-2xl font-bold text-gray-800">{title}</h3>
      </div>
      {children}
    </div>
  );
};

interface ResultRowProps {
  label: string;
  value: number;
  isCurrency?: boolean;
  isHighlight?: boolean;
  isNegative?: boolean;
}

export const ResultRow: React.FC<ResultRowProps> = ({
  label,
  value,
  isCurrency = true,
  isHighlight = false,
  isNegative = false,
}) => {
  const displayValue = isCurrency ? formatCurrency(value, 0) : formatNumber(value, 2);
  
  const valueClass = isHighlight
    ? 'text-3xl font-bold text-blue-600'
    : isNegative && value < 0
    ? 'text-xl font-semibold text-red-600'
    : 'text-xl font-semibold text-gray-800';

  return (
    <div className={`flex justify-between items-center ${isHighlight ? 'py-4 border-t-2 border-b-2 border-blue-200 bg-blue-50 px-4 rounded-lg' : 'py-3'}`}>
      <span className={`${isHighlight ? 'font-semibold text-gray-700' : 'text-gray-600'}`}>
        {label}
      </span>
      <span className={valueClass}>{displayValue}</span>
    </div>
  );
};

interface InvestmentOptionsProps {
  monthly: number;
  yearly: number;
  oneTime: number;
}

export const InvestmentOptions: React.FC<InvestmentOptionsProps> = ({
  monthly,
  yearly,
  oneTime,
}) => {
  return (
    <div>
      <h4 className="text-sm font-semibold text-gray-700 mb-3">Required Investment Amount</h4>
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="text-xs text-gray-600 mb-1">Monthly</div>
          <div className="text-lg font-bold text-gray-800">
            {formatCurrency(monthly, 0)}
          </div>
        </div>
        <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="text-xs text-gray-600 mb-1">Yearly</div>
          <div className="text-lg font-bold text-gray-800">
            {formatCurrency(yearly, 0)}
          </div>
        </div>
        <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="text-xs text-gray-600 mb-1">One Time</div>
          <div className="text-lg font-bold text-gray-800">
            {formatCurrency(oneTime, 0)}
          </div>
        </div>
      </div>
    </div>
  );
};
