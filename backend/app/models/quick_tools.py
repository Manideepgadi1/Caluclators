"""
Pydantic models for Quick Tools
"""
from pydantic import BaseModel, Field
from typing import List


class SingleAmountInput(BaseModel):
    """Single Amount Calculator Input"""
    calculate_type: str = Field(..., description="'present_value' or 'future_value'")
    amount: float = Field(..., gt=0, description="Present or Future value")
    years: int = Field(..., ge=1, le=50, description="Time period in years")
    inflation: float = Field(default=8.0, ge=0, le=50, description="Inflation/discount rate %")


class SingleAmountOutput(BaseModel):
    """Single Amount Calculator Output"""
    result: float
    calculation_type: str


class CashFlow(BaseModel):
    """Individual cash flow"""
    amount: float = Field(..., description="Cash flow amount")
    years: int = Field(..., ge=1, le=50, description="Years from now")


class IrregularCashFlowInput(BaseModel):
    """Irregular Cash Flow Calculator Input"""
    calculate_type: str = Field(..., description="'present_value' or 'future_value'")
    cash_flows: List[CashFlow] = Field(..., min_length=1, description="List of cash flows")
    discount_rate: float = Field(..., ge=0, le=20, description="Discount rate %")


class IrregularCashFlowOutput(BaseModel):
    """Irregular Cash Flow Calculator Output"""
    total_value: float
    calculation_type: str


class AssetReturn(BaseModel):
    """Individual asset return"""
    investment_amount: float = Field(..., gt=0, description="Investment amount")
    expected_return: float = Field(..., ge=1, le=20, description="Expected return %")


class WeightedReturnsInput(BaseModel):
    """Weighted Average Returns Calculator Input"""
    years: int = Field(..., ge=1, le=50, description="Investment period in years")
    assets: List[AssetReturn] = Field(..., min_length=1, description="List of assets")


class WeightedReturnsOutput(BaseModel):
    """Weighted Average Returns Calculator Output"""
    future_value: float
    weighted_return: float
    total_invested: float
