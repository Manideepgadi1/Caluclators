"""
Pydantic models for Life Goal Calculators
"""
from pydantic import BaseModel, Field
from typing import Optional


class RetirementInput(BaseModel):
    """Plan Your Retirement Calculator Input"""
    present_age: int = Field(..., ge=18, le=100, description="Current age")
    retirement_age: int = Field(..., ge=30, le=100, description="Planned retirement age")
    monthly_expenses: float = Field(..., gt=0, description="Current monthly expenses in INR")
    expected_returns: float = Field(..., ge=1, le=30, description="Expected annual returns %")
    inflation: float = Field(default=6.0, ge=0, le=20, description="Expected inflation %")
    growth_in_savings: float = Field(default=0, ge=0, le=20, description="Expected growth in savings %")
    existing_investments: float = Field(default=0, ge=0, description="Current retirement investments")


class RetirementOutput(BaseModel):
    """Plan Your Retirement Calculator Output"""
    recommended_corpus: float
    monthly_sip: float
    yearly_sip: float
    one_time_investment: float
    future_value_existing: float
    shortfall: float
    monthly_expenses_retirement: float
    years_remaining: int


class EducationInput(BaseModel):
    """Child Education Calculator Input"""
    years_remaining: int = Field(..., ge=1, le=50, description="Years until education starts")
    cost_today: float = Field(..., gt=0, description="Education cost in today's terms")
    inflation: float = Field(default=10.0, ge=0, le=20, description="Education inflation %")
    expected_returns: float = Field(..., ge=1, le=30, description="Expected returns %")
    growth_in_savings: float = Field(default=0, ge=0, le=20, description="Growth in savings %")
    existing_investments: float = Field(default=0, ge=0, description="Current investments")


class EducationOutput(BaseModel):
    """Child Education Calculator Output"""
    target_amount: float
    monthly_sip: float
    yearly_sip: float
    one_time_investment: float
    future_value_existing: float
    shortfall: float


class MarriageInput(BaseModel):
    """Marriage for Child Calculator Input"""
    years_remaining: int = Field(..., ge=1, le=50, description="Years until marriage")
    cost_today: float = Field(..., gt=0, description="Marriage cost in today's terms")
    inflation: float = Field(default=8.0, ge=0, le=20, description="Inflation %")
    expected_returns: float = Field(..., ge=1, le=30, description="Expected returns %")
    growth_in_savings: float = Field(default=0, ge=0, le=20, description="Growth in savings %")
    existing_investments: float = Field(default=0, ge=0, description="Current investments")


class MarriageOutput(BaseModel):
    """Marriage for Child Calculator Output"""
    target_amount: float
    monthly_sip: float
    yearly_sip: float
    one_time_investment: float
    future_value_existing: float
    shortfall: float


class OtherGoalInput(BaseModel):
    """Your Other Goal Calculator Input"""
    goal_name: str = Field(default="", description="Custom goal name")
    years_remaining: int = Field(..., ge=1, le=50, description="Years until goal")
    cost_today: float = Field(..., gt=0, description="Goal cost in today's terms")
    inflation: float = Field(default=8.0, ge=0, le=20, description="Inflation %")
    expected_returns: float = Field(..., ge=1, le=30, description="Expected returns %")
    growth_in_savings: float = Field(default=0, ge=0, le=20, description="Growth in savings %")
    existing_investments: float = Field(default=0, ge=0, description="Current investments")


class OtherGoalOutput(BaseModel):
    """Your Other Goal Calculator Output"""
    target_amount: float
    monthly_sip: float
    yearly_sip: float
    one_time_investment: float
    future_value_existing: float
    shortfall: float
