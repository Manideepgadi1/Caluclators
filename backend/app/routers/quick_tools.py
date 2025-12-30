"""
Quick Tools API Router
"""
from fastapi import APIRouter, HTTPException
from app.models.quick_tools import (
    SingleAmountInput, SingleAmountOutput,
    IrregularCashFlowInput, IrregularCashFlowOutput,
    WeightedReturnsInput, WeightedReturnsOutput
)
from app.services.quick_tools_service import (
    SingleAmountCalculator,
    IrregularCashFlowCalculator,
    WeightedReturnsCalculator
)

router = APIRouter()


@router.post("/single-amount", response_model=SingleAmountOutput)
async def calculate_single_amount(data: SingleAmountInput):
    """
    Single Amount Calculator
    
    Calculates present value or future value of a single amount
    based on inflation/discount rate.
    """
    try:
        return SingleAmountCalculator.calculate(data)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Calculation error")


@router.post("/irregular-cash-flow", response_model=IrregularCashFlowOutput)
async def calculate_irregular_cash_flow(data: IrregularCashFlowInput):
    """
    Irregular Cash Flow Calculator
    
    Calculates present value or future value of irregular cash flows
    occurring at different points in time.
    """
    try:
        return IrregularCashFlowCalculator.calculate(data)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Calculation error")


@router.post("/weighted-returns", response_model=WeightedReturnsOutput)
async def calculate_weighted_returns(data: WeightedReturnsInput):
    """
    Weighted Average Returns Calculator
    
    Calculates portfolio future value based on weighted average
    returns of different asset classes.
    """
    try:
        return WeightedReturnsCalculator.calculate(data)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Calculation error")
