"""
Pydantic models for Financial Calculators
"""
from pydantic import BaseModel, Field
from typing import Optional


class SIPGrowthInput(BaseModel):
    """SIP Growth Calculator Input"""
    monthly_investment: float = Field(..., gt=0, description="Monthly SIP amount")
    period_years: int = Field(..., ge=1, le=50, description="Investment period in years")
    expected_returns: float = Field(..., ge=1, le=30, description="Expected annual returns %")
    growth_in_savings: float = Field(default=0, ge=0, le=20, description="Annual increase in SIP %")


class SIPGrowthOutput(BaseModel):
    """SIP Growth Calculator Output"""
    future_value: float
    total_invested: float
    wealth_gain: float
    growth_multiple: float


class SIPNeedInput(BaseModel):
    """SIP Need Calculator Input"""
    target_amount: float = Field(..., gt=0, description="Target corpus needed")
    period_years: int = Field(..., ge=1, le=50, description="Time period in years")
    expected_returns: float = Field(..., ge=1, le=30, description="Expected annual returns %")
    inflation: float = Field(default=8.0, ge=0, le=20, description="Expected inflation %")
    growth_in_savings: float = Field(default=0, ge=0, le=20, description="Annual increase in SIP %")


class SIPNeedOutput(BaseModel):
    """SIP Need Calculator Output"""
    monthly_sip: float
    target_amount_adjusted: float
    projected_investment: float
    growth_multiple: float


class SIPDelayInput(BaseModel):
    """SIP Delay Cost Calculator Input"""
    monthly_investment: float = Field(..., gt=0, description="Monthly SIP amount")
    period_years: int = Field(..., ge=1, le=50, description="Investment period in years")
    expected_returns: float = Field(..., ge=1, le=30, description="Expected annual returns %")
    delay_months: int = Field(..., ge=1, le=120, description="Delay in starting SIP (months)")


class SIPDelayOutput(BaseModel):
    """SIP Delay Cost Calculator Output"""
    delay_cost: float
    future_value_without_delay: float
    future_value_with_delay: float


class SWPInput(BaseModel):
    """SWP Calculator Input"""
    initial_investment: float = Field(..., gt=0, description="Initial lump sum investment")
    monthly_withdrawal: float = Field(..., gt=0, description="Monthly withdrawal amount")
    expected_returns: float = Field(..., ge=2, le=15, description="Expected annual returns %")
    yearly_increase: float = Field(default=10.0, ge=0, le=20, description="Annual increase in withdrawal %")
    increase_withdrawal: bool = Field(default=False, description="Whether to increase withdrawal yearly")
    swp_start_years: int = Field(default=0, ge=0, le=30, description="Years before starting SWP")


class SWPOutput(BaseModel):
    """SWP Calculator Output"""
    period_end_value: float
    total_withdrawn: float
    full_instalments: int
    last_instalment_date: str
