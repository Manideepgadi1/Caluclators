"""
Financial Calculators API Router
"""
from fastapi import APIRouter, HTTPException
from app.models.financial import (
    SIPGrowthInput, SIPGrowthOutput,
    SIPNeedInput, SIPNeedOutput,
    SIPDelayInput, SIPDelayOutput,
    SWPInput, SWPOutput
)
from app.services.financial_service import (
    SIPGrowthCalculator,
    SIPNeedCalculator,
    SIPDelayCalculator,
    SWPCalculator
)

router = APIRouter()


@router.post("/sip-growth", response_model=SIPGrowthOutput)
async def calculate_sip_growth(data: SIPGrowthInput):
    """
    SIP Growth Calculator
    
    Calculates future value of a systematic investment plan (SIP)
    with optional step-up investments.
    """
    try:
        return SIPGrowthCalculator.calculate(data)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Calculation error")


@router.post("/sip-need", response_model=SIPNeedOutput)
async def calculate_sip_need(data: SIPNeedInput):
    """
    SIP Need Calculator
    
    Calculates monthly SIP required to achieve a target amount
    considering inflation and step-up investments.
    """
    try:
        return SIPNeedCalculator.calculate(data)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Calculation error")


@router.post("/sip-delay", response_model=SIPDelayOutput)
async def calculate_sip_delay(data: SIPDelayInput):
    """
    SIP Delay Cost Calculator
    
    Calculates the cost of delaying your SIP investment
    by showing the difference in future value.
    """
    try:
        return SIPDelayCalculator.calculate(data)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Calculation error")


@router.post("/swp", response_model=SWPOutput)
async def calculate_swp(data: SWPInput):
    """
    SWP (Systematic Withdrawal Plan) Calculator
    
    Calculates how long your investment will last with
    systematic monthly withdrawals.
    """
    try:
        return SWPCalculator.calculate(data)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Calculation error")
