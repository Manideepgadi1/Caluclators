"""
Life Goal Calculator Services
Implements retirement, education, marriage, and custom goal calculations
"""
from app.services.financial_utils import (
    future_value_lumpsum,
    future_value_sip,
    calculate_sip_needed,
    inflation_adjusted_amount,
    calculate_retirement_corpus,
    total_sip_invested
)
from app.models.life_goal import (
    RetirementInput, RetirementOutput,
    EducationInput, EducationOutput,
    MarriageInput, MarriageOutput,
    OtherGoalInput, OtherGoalOutput
)


class RetirementCalculator:
    """Plan Your Retirement Calculator"""
    
    @staticmethod
    def calculate(data: RetirementInput) -> RetirementOutput:
        years_remaining = data.retirement_age - data.present_age
        
        if years_remaining <= 0:
            raise ValueError("Retirement age must be greater than present age")
        
        # Calculate inflation-adjusted monthly expenses at retirement
        monthly_expenses_retirement = data.monthly_expenses * pow(1 + data.inflation / 100, years_remaining)
        
        # Calculate retirement period (years of retirement)
        retirement_period = data.life_expectancy - data.retirement_age
        if retirement_period <= 0:
            retirement_period = 25  # Default fallback
        
        # Calculate required retirement corpus
        # This corpus needs to last for retirement_period years
        # providing inflation-adjusted withdrawals
        
        # Annual expenses at the START of retirement
        inflated_monthly_expenses = data.monthly_expenses * pow(1 + data.inflation / 100, years_remaining)
        annual_expenses_at_retirement = inflated_monthly_expenses * 12
        
        # Calculate corpus needed using perpetuity/annuity formula
        # The corpus grows at retirement_kitty_returns% while expenses grow at post_retirement_inflation%
        # We need to find present value (at retirement) of all future expenses
        
        corpus_needed = 0
        for year in range(1, retirement_period + 1):
            # Expenses in this year (growing with post-retirement inflation)
            expense_this_year = annual_expenses_at_retirement * pow(1 + data.post_retirement_inflation / 100, year - 1)
            # Present value of this expense (discounted at retirement kitty returns)
            pv_expense = expense_this_year / pow(1 + data.retirement_kitty_returns / 100, year)
            corpus_needed += pv_expense
        
        recommended_corpus = corpus_needed
        
        # Future value of existing investments
        future_value_existing = future_value_lumpsum(
            data.existing_investments,
            data.expected_returns,
            years_remaining
        )
        
        # Shortfall to be covered
        shortfall = recommended_corpus - future_value_existing
        
        if shortfall <= 0:
            # Already have enough
            return RetirementOutput(
                recommended_corpus=recommended_corpus,
                monthly_sip=0,
                yearly_sip=0,
                one_time_investment=0,
                future_value_existing=future_value_existing,
                shortfall=shortfall,
                monthly_expenses_retirement=monthly_expenses_retirement,
                years_remaining=years_remaining
            )
        
        # Calculate required investments
        monthly_sip = calculate_sip_needed(
            shortfall,
            data.expected_returns,
            years_remaining,
            data.growth_in_savings
        )
        
        yearly_sip = monthly_sip * 12
        
        # One-time investment needed today
        one_time_investment = shortfall / pow(1 + data.expected_returns / 100, years_remaining)
        
        return RetirementOutput(
            recommended_corpus=recommended_corpus,
            monthly_sip=monthly_sip,
            yearly_sip=yearly_sip,
            one_time_investment=one_time_investment,
            future_value_existing=future_value_existing,
            shortfall=shortfall,
            monthly_expenses_retirement=monthly_expenses_retirement,
            years_remaining=years_remaining
        )


class EducationCalculator:
    """Child Education Calculator"""
    
    @staticmethod
    def calculate(data: EducationInput) -> EducationOutput:
        # Inflate cost to future
        target_amount = inflation_adjusted_amount(
            data.cost_today,
            data.inflation,
            data.years_remaining
        )
        
        # Future value of existing investments
        future_value_existing = future_value_lumpsum(
            data.existing_investments,
            data.expected_returns,
            data.years_remaining
        )
        
        # Shortfall
        shortfall = target_amount - future_value_existing
        
        if shortfall <= 0:
            return EducationOutput(
                target_amount=target_amount,
                monthly_sip=0,
                yearly_sip=0,
                one_time_investment=0,
                future_value_existing=future_value_existing,
                shortfall=shortfall
            )
        
        # Calculate SIP needed
        monthly_sip = calculate_sip_needed(
            shortfall,
            data.expected_returns,
            data.years_remaining,
            data.growth_in_savings
        )
        
        yearly_sip = monthly_sip * 12
        
        # One-time investment
        one_time_investment = shortfall / pow(1 + data.expected_returns / 100, data.years_remaining)
        
        return EducationOutput(
            target_amount=target_amount,
            monthly_sip=monthly_sip,
            yearly_sip=yearly_sip,
            one_time_investment=one_time_investment,
            future_value_existing=future_value_existing,
            shortfall=shortfall
        )


class MarriageCalculator:
    """Marriage for Child Calculator"""
    
    @staticmethod
    def calculate(data: MarriageInput) -> MarriageOutput:
        # Same logic as education calculator
        target_amount = inflation_adjusted_amount(
            data.cost_today,
            data.inflation,
            data.years_remaining
        )
        
        future_value_existing = future_value_lumpsum(
            data.existing_investments,
            data.expected_returns,
            data.years_remaining
        )
        
        shortfall = target_amount - future_value_existing
        
        if shortfall <= 0:
            return MarriageOutput(
                target_amount=target_amount,
                monthly_sip=0,
                yearly_sip=0,
                one_time_investment=0,
                future_value_existing=future_value_existing,
                shortfall=shortfall
            )
        
        monthly_sip = calculate_sip_needed(
            shortfall,
            data.expected_returns,
            data.years_remaining,
            data.growth_in_savings
        )
        
        yearly_sip = monthly_sip * 12
        one_time_investment = shortfall / pow(1 + data.expected_returns / 100, data.years_remaining)
        
        return MarriageOutput(
            target_amount=target_amount,
            monthly_sip=monthly_sip,
            yearly_sip=yearly_sip,
            one_time_investment=one_time_investment,
            future_value_existing=future_value_existing,
            shortfall=shortfall
        )


class OtherGoalCalculator:
    """Your Other Goal Calculator"""
    
    @staticmethod
    def calculate(data: OtherGoalInput) -> OtherGoalOutput:
        # Generic goal calculator
        target_amount = inflation_adjusted_amount(
            data.cost_today,
            data.inflation,
            data.years_remaining
        )
        
        future_value_existing = future_value_lumpsum(
            data.existing_investments,
            data.expected_returns,
            data.years_remaining
        )
        
        shortfall = target_amount - future_value_existing
        
        if shortfall <= 0:
            return OtherGoalOutput(
                target_amount=target_amount,
                monthly_sip=0,
                yearly_sip=0,
                one_time_investment=0,
                future_value_existing=future_value_existing,
                shortfall=shortfall
            )
        
        monthly_sip = calculate_sip_needed(
            shortfall,
            data.expected_returns,
            data.years_remaining,
            data.growth_in_savings
        )
        
        yearly_sip = monthly_sip * 12
        one_time_investment = shortfall / pow(1 + data.expected_returns / 100, data.years_remaining)
        
        return OtherGoalOutput(
            target_amount=target_amount,
            monthly_sip=monthly_sip,
            yearly_sip=yearly_sip,
            one_time_investment=one_time_investment,
            future_value_existing=future_value_existing,
            shortfall=shortfall
        )
