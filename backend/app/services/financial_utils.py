"""
Core financial calculation utilities
Standard financial mathematics formulas
"""
import math


def future_value_lumpsum(present_value: float, rate: float, years: int) -> float:
    """
    Calculate future value of a lump sum investment
    FV = PV * (1 + r)^n
    """
    if years == 0:
        return present_value
    return present_value * math.pow(1 + rate / 100, years)


def present_value_lumpsum(future_value: float, rate: float, years: int) -> float:
    """
    Calculate present value of a future amount
    PV = FV / (1 + r)^n
    """
    if years == 0:
        return future_value
    return future_value / math.pow(1 + rate / 100, years)


def future_value_sip(monthly_investment: float, annual_rate: float, years: int, growth_rate: float = 0) -> float:
    """
    Calculate future value of SIP with optional step-up
    Uses month-by-month calculation for accuracy
    """
    monthly_rate = annual_rate / 12 / 100
    months = years * 12
    
    if growth_rate == 0:
        # Standard SIP formula
        if monthly_rate == 0:
            return monthly_investment * months
        fv = monthly_investment * ((math.pow(1 + monthly_rate, months) - 1) / monthly_rate) * (1 + monthly_rate)
        return fv
    else:
        # Step-up SIP - month by month calculation
        annual_growth_rate = growth_rate / 100
        fv = 0
        current_sip = monthly_investment
        
        for month in range(1, months + 1):
            # Increase SIP annually
            if month > 1 and (month - 1) % 12 == 0:
                current_sip = current_sip * (1 + annual_growth_rate)
            
            # Calculate future value of this installment
            remaining_months = months - month + 1
            fv += current_sip * math.pow(1 + monthly_rate, remaining_months)
        
        return fv


def calculate_sip_needed(target_amount: float, annual_rate: float, years: int, growth_rate: float = 0) -> float:
    """
    Calculate monthly SIP needed to reach target amount
    Uses iterative approximation for step-up SIP
    """
    if growth_rate == 0:
        # Standard SIP formula (solved for PMT)
        monthly_rate = annual_rate / 12 / 100
        months = years * 12
        
        if monthly_rate == 0:
            return target_amount / months
        
        sip = target_amount / (((math.pow(1 + monthly_rate, months) - 1) / monthly_rate) * (1 + monthly_rate))
        return sip
    else:
        # Step-up SIP - use binary search
        low, high = 0, target_amount / (years * 12)
        tolerance = 1  # INR 1 tolerance
        
        for _ in range(100):  # Max iterations
            mid = (low + high) / 2
            fv = future_value_sip(mid, annual_rate, years, growth_rate)
            
            if abs(fv - target_amount) < tolerance:
                return mid
            
            if fv < target_amount:
                low = mid
            else:
                high = mid
        
        return (low + high) / 2


def total_sip_invested(monthly_sip: float, years: int, growth_rate: float = 0) -> float:
    """
    Calculate total amount invested in SIP
    """
    if growth_rate == 0:
        return monthly_sip * years * 12
    
    total = 0
    current_sip = monthly_sip
    annual_growth = growth_rate / 100
    
    for year in range(years):
        if year > 0:
            current_sip = current_sip * (1 + annual_growth)
        total += current_sip * 12
    
    return total


def inflation_adjusted_amount(current_amount: float, inflation_rate: float, years: int) -> float:
    """
    Calculate inflation-adjusted future amount
    """
    return future_value_lumpsum(current_amount, inflation_rate, years)


def calculate_retirement_corpus(monthly_expenses: float, years_in_retirement: int, inflation_rate: float, post_retirement_return: float) -> float:
    """
    Calculate retirement corpus needed
    Assumes 25-30 years of retirement
    """
    # Inflate expenses to retirement year
    inflated_monthly_expenses = monthly_expenses * math.pow(1 + inflation_rate / 100, years_in_retirement)
    
    # Annual expenses in retirement year
    annual_expenses = inflated_monthly_expenses * 12
    
    # Assume 25 years of retirement (standard assumption)
    retirement_period = 25
    
    # Calculate corpus using annuity formula
    # Corpus should generate annual_expenses for retirement_period years
    # accounting for post-retirement returns
    
    real_return = ((1 + post_retirement_return / 100) / (1 + inflation_rate / 100)) - 1
    
    if real_return <= 0:
        # If real return is negative, simply multiply expenses
        corpus = annual_expenses * retirement_period
    else:
        # Use present value of annuity formula
        corpus = annual_expenses * (1 - math.pow(1 + real_return, -retirement_period)) / real_return
    
    return corpus


def calculate_swp_duration(initial_amount: float, monthly_withdrawal: float, annual_return: float, yearly_increase: float, increase_enabled: bool) -> tuple:
    """
    Calculate how long SWP will last
    Returns (months_lasted, remaining_value)
    """
    monthly_return = annual_return / 12 / 100
    balance = initial_amount
    months = 0
    current_withdrawal = monthly_withdrawal
    
    max_months = 50 * 12  # 50 years max
    
    while balance > 0 and months < max_months:
        # Apply return
        balance = balance * (1 + monthly_return)
        
        # Withdraw
        balance -= current_withdrawal
        months += 1
        
        # Increase withdrawal yearly if enabled
        if increase_enabled and months % 12 == 0:
            current_withdrawal = current_withdrawal * (1 + yearly_increase / 100)
        
        if balance < 0:
            balance = 0
            break
    
    return months, max(0, balance)
