import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Life Goal Calculators
export interface RetirementInput {
  present_age: number;
  retirement_age: number;
  monthly_expenses: number;
  expected_returns: number;
  inflation?: number;
  growth_in_savings?: number;
  existing_investments?: number;
}

export interface RetirementOutput {
  recommended_corpus: number;
  monthly_sip: number;
  yearly_sip: number;
  one_time_investment: number;
  future_value_existing: number;
  shortfall: number;
  monthly_expenses_retirement: number;
  years_remaining: number;
}

export interface EducationInput {
  years_remaining: number;
  cost_today: number;
  inflation?: number;
  expected_returns: number;
  growth_in_savings?: number;
  existing_investments?: number;
}

export interface GoalOutput {
  target_amount: number;
  monthly_sip: number;
  yearly_sip: number;
  one_time_investment: number;
  future_value_existing: number;
  shortfall: number;
}

// Financial Calculators
export interface SIPGrowthInput {
  monthly_investment: number;
  period_years: number;
  expected_returns: number;
  growth_in_savings?: number;
}

export interface SIPGrowthOutput {
  future_value: number;
  total_invested: number;
  wealth_gain: number;
  growth_multiple: number;
}

export interface SIPNeedInput {
  target_amount: number;
  period_years: number;
  expected_returns: number;
  inflation?: number;
  growth_in_savings?: number;
}

export interface SIPNeedOutput {
  monthly_sip: number;
  target_amount_adjusted: number;
  projected_investment: number;
  growth_multiple: number;
}

export interface SIPDelayInput {
  monthly_investment: number;
  period_years: number;
  expected_returns: number;
  delay_months: number;
}

export interface SIPDelayOutput {
  delay_cost: number;
  future_value_without_delay: number;
  future_value_with_delay: number;
}

export interface SWPInput {
  initial_investment: number;
  monthly_withdrawal: number;
  expected_returns: number;
  yearly_increase?: number;
  increase_withdrawal?: boolean;
  swp_start_years?: number;
}

export interface SWPOutput {
  period_end_value: number;
  total_withdrawn: number;
  full_instalments: number;
  last_instalment_date: string;
}

// Quick Tools
export interface SingleAmountInput {
  calculate_type: 'present_value' | 'future_value';
  amount: number;
  years: number;
  inflation: number;
}

export interface SingleAmountOutput {
  result: number;
  calculation_type: string;
}

export interface CashFlow {
  amount: number;
  years: number;
}

export interface IrregularCashFlowInput {
  calculate_type: 'present_value' | 'future_value';
  cash_flows: CashFlow[];
  discount_rate: number;
}

export interface IrregularCashFlowOutput {
  total_value: number;
  calculation_type: string;
}

export interface AssetReturn {
  investment_amount: number;
  expected_return: number;
}

export interface WeightedReturnsInput {
  years: number;
  assets: AssetReturn[];
}

export interface WeightedReturnsOutput {
  future_value: number;
  weighted_return: number;
  total_invested: number;
}

// API Methods
export const lifeGoalAPI = {
  calculateRetirement: (data: RetirementInput) =>
    api.post<RetirementOutput>('/api/life-goal/retirement', data),
  
  calculateEducation: (data: EducationInput) =>
    api.post<GoalOutput>('/api/life-goal/education', data),
  
  calculateMarriage: (data: EducationInput) =>
    api.post<GoalOutput>('/api/life-goal/marriage', data),
  
  calculateOtherGoal: (data: EducationInput & { goal_name?: string }) =>
    api.post<GoalOutput>('/api/life-goal/other-goal', data),
};

export const financialAPI = {
  calculateSIPGrowth: (data: SIPGrowthInput) =>
    api.post<SIPGrowthOutput>('/api/financial/sip-growth', data),
  
  calculateSIPNeed: (data: SIPNeedInput) =>
    api.post<SIPNeedOutput>('/api/financial/sip-need', data),
  
  calculateSIPDelay: (data: SIPDelayInput) =>
    api.post<SIPDelayOutput>('/api/financial/sip-delay', data),
  
  calculateSWP: (data: SWPInput) =>
    api.post<SWPOutput>('/api/financial/swp', data),
};

export const quickToolsAPI = {
  calculateSingleAmount: (data: SingleAmountInput) =>
    api.post<SingleAmountOutput>('/api/quick-tools/single-amount', data),
  
  calculateIrregularCashFlow: (data: IrregularCashFlowInput) =>
    api.post<IrregularCashFlowOutput>('/api/quick-tools/irregular-cash-flow', data),
  
  calculateWeightedReturns: (data: WeightedReturnsInput) =>
    api.post<WeightedReturnsOutput>('/api/quick-tools/weighted-returns', data),
};

export default api;
