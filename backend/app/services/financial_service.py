"""
Financial Calculators Services
SIP Growth, SIP Need, SIP Delay Cost, SWP Calculator
"""
from datetime import datetime, timedelta
from app.services.financial_utils import (
    future_value_sip,
    calculate_sip_needed,
    total_sip_invested,
    calculate_swp_duration
)
from app.models.financial import (
    SIPGrowthInput, SIPGrowthOutput,
    SIPNeedInput, SIPNeedOutput,
    SIPDelayInput, SIPDelayOutput,
    SWPInput, SWPOutput
)


class SIPGrowthCalculator:
    """SIP Growth Calculator"""
    
    @staticmethod
    def calculate(data: SIPGrowthInput) -> SIPGrowthOutput:
        # Calculate future value
        future_value = future_value_sip(
            data.monthly_investment,
            data.expected_returns,
            data.period_years,
            data.growth_in_savings
        )
        
        # Total invested
        total_invested = total_sip_invested(
            data.monthly_investment,
            data.period_years,
            data.growth_in_savings
        )
        
        # Wealth gain
        wealth_gain = future_value - total_invested
        
        # Growth multiple
        growth_multiple = future_value / total_invested if total_invested > 0 else 0
        
        return SIPGrowthOutput(
            future_value=future_value,
            total_invested=total_invested,
            wealth_gain=wealth_gain,
            growth_multiple=growth_multiple
        )


class SIPNeedCalculator:
    """SIP Need Calculator"""
    
    @staticmethod
    def calculate(data: SIPNeedInput) -> SIPNeedOutput:
        # Adjust target for inflation
        target_adjusted = data.target_amount * pow(1 + data.inflation / 100, data.period_years)
        
        # Calculate monthly SIP needed
        monthly_sip = calculate_sip_needed(
            target_adjusted,
            data.expected_returns,
            data.period_years,
            data.growth_in_savings
        )
        
        # Total investment
        projected_investment = total_sip_invested(
            monthly_sip,
            data.period_years,
            data.growth_in_savings
        )
        
        # Growth multiple
        growth_multiple = target_adjusted / projected_investment if projected_investment > 0 else 0
        
        return SIPNeedOutput(
            monthly_sip=monthly_sip,
            target_amount_adjusted=target_adjusted,
            projected_investment=projected_investment,
            growth_multiple=growth_multiple
        )


class SIPDelayCalculator:
    """SIP Delay Cost Calculator"""
    
    @staticmethod
    def calculate(data: SIPDelayInput) -> SIPDelayOutput:
        # FV without delay
        fv_without_delay = future_value_sip(
            data.monthly_investment,
            data.expected_returns,
            data.period_years,
            0
        )
        
        # FV with delay
        delay_years = data.delay_months / 12
        reduced_period = data.period_years - delay_years
        
        if reduced_period <= 0:
            fv_with_delay = 0
        else:
            fv_with_delay = future_value_sip(
                data.monthly_investment,
                data.expected_returns,
                reduced_period,
                0
            )
        
        # Delay cost
        delay_cost = fv_without_delay - fv_with_delay
        
        return SIPDelayOutput(
            delay_cost=delay_cost,
            future_value_without_delay=fv_without_delay,
            future_value_with_delay=fv_with_delay
        )


class SWPCalculator:
    """SWP (Systematic Withdrawal Plan) Calculator"""
    
    @staticmethod
    def calculate(data: SWPInput) -> SWPOutput:
        # If SWP starts after some years, grow the initial investment
        if data.swp_start_years > 0:
            initial = data.initial_investment * pow(
                1 + data.expected_returns / 100,
                data.swp_start_years
            )
        else:
            initial = data.initial_investment
        
        # Calculate SWP duration
        months_lasted, remaining_value = calculate_swp_duration(
            initial,
            data.monthly_withdrawal,
            data.expected_returns,
            data.yearly_increase,
            data.increase_withdrawal
        )
        
        # Total withdrawn
        if data.increase_withdrawal:
            total_withdrawn = 0
            current_withdrawal = data.monthly_withdrawal
            for month in range(1, months_lasted + 1):
                if month > 1 and (month - 1) % 12 == 0:
                    current_withdrawal = current_withdrawal * (1 + data.yearly_increase / 100)
                total_withdrawn += current_withdrawal
        else:
            total_withdrawn = data.monthly_withdrawal * months_lasted
        
        # Calculate last instalment date
        start_date = datetime.now() + timedelta(days=365 * data.swp_start_years)
        last_date = start_date + timedelta(days=30 * months_lasted)
        
        return SWPOutput(
            period_end_value=remaining_value,
            total_withdrawn=total_withdrawn,
            full_instalments=months_lasted,
            last_instalment_date=last_date.strftime("%d-%B-%Y")
        )
